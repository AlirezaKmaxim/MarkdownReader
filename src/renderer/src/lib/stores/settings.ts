import { derived, writable } from 'svelte/store'
import { getTheme, isThemeId, THEMES, type ThemeId } from '$lib/themes'
import { directionOf, resolveLocale, translate, type Locale, type MessageKey } from '$lib/i18n'

export type FontWeight = 300 | 400 | 500 | 700
export type ContentWidth = 'narrow' | 'medium' | 'wide'

export type ReaderSettings = {
  fontSize: number
  fontWeight: FontWeight
  theme: ThemeId
  lineHeight: number
  contentWidth: ContentWidth
  wordSpacing: boolean
  ruler: boolean
  spotlight: boolean
  bionic: boolean
  locale: Locale
}

const STORAGE_KEY = 'markdown-reader-pro:settings'

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 16,
  fontWeight: 400,
  theme: 'light',
  lineHeight: 1.85,
  contentWidth: 'medium',
  wordSpacing: false,
  ruler: false,
  spotlight: false,
  bionic: false,
  locale: 'fa'
}

// One-click preset tuned for readers with ADHD: calm low-glare palette,
// short lines, airy spacing and a reading ruler to anchor the eye.
const ADHD_PRESET: Partial<ReaderSettings> = {
  theme: 'emerald',
  fontSize: 18,
  lineHeight: 2.1,
  contentWidth: 'narrow',
  wordSpacing: true,
  ruler: true,
  spotlight: false
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

function loadSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw)
      return { ...DEFAULT_SETTINGS, locale: resolveLocale(undefined, false, systemLanguage()) }
    const parsed = JSON.parse(raw) as Partial<ReaderSettings>
    const fontSize = clamp(Number(parsed.fontSize) || DEFAULT_SETTINGS.fontSize, 14, 24)
    const fontWeight = ([300, 400, 500, 700] as FontWeight[]).includes(
      parsed.fontWeight as FontWeight
    )
      ? (parsed.fontWeight as FontWeight)
      : DEFAULT_SETTINGS.fontWeight
    const theme = isThemeId(parsed.theme) ? parsed.theme : DEFAULT_SETTINGS.theme
    const lineHeight = clamp(Number(parsed.lineHeight) || DEFAULT_SETTINGS.lineHeight, 1.5, 2.4)
    const contentWidth = (['narrow', 'medium', 'wide'] as ContentWidth[]).includes(
      parsed.contentWidth as ContentWidth
    )
      ? (parsed.contentWidth as ContentWidth)
      : DEFAULT_SETTINGS.contentWidth
    return {
      fontSize,
      fontWeight,
      theme,
      lineHeight,
      contentWidth,
      wordSpacing: Boolean(parsed.wordSpacing),
      ruler: Boolean(parsed.ruler),
      spotlight: Boolean(parsed.spotlight),
      bionic: Boolean(parsed.bionic),
      locale: resolveLocale(parsed.locale, true, systemLanguage())
    }
  } catch {
    return { ...DEFAULT_SETTINGS, locale: resolveLocale(undefined, false, systemLanguage()) }
  }
}

function systemLanguage(): string {
  return typeof navigator !== 'undefined' ? navigator.language : 'en'
}

function applyLocale(locale: Locale): void {
  const root = document.documentElement
  root.lang = locale
  root.dir = directionOf(locale)
  document.title = translate(locale, 'app.title')
  window.api?.setLocale?.(locale)
}

function applyTheme(theme: ThemeId): void {
  const root = document.documentElement
  root.dataset.theme = theme
  root.classList.toggle('dark', getTheme(theme).dark)
}

function createSettingsStore() {
  const initial = typeof localStorage !== 'undefined' ? loadSettings() : { ...DEFAULT_SETTINGS }
  const { subscribe, update } = writable<ReaderSettings>(initial)

  function persist(value: ReaderSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      // Storage unavailable — settings still apply for this session
    }
    applyTheme(value.theme)
    applyLocale(value.locale)
  }

  function patch(changes: Partial<ReaderSettings>): void {
    update((current) => {
      const next = { ...current, ...changes }
      persist(next)
      return next
    })
  }

  applyTheme(initial.theme)
  applyLocale(initial.locale)

  return {
    subscribe,
    patch,
    setFontSize(size: number) {
      patch({ fontSize: clamp(size, 14, 24) })
    },
    setFontWeight(weight: FontWeight) {
      patch({ fontWeight: weight })
    },
    setLocale(locale: Locale) {
      patch({ locale })
    },
    toggleLocale() {
      update((current) => {
        const next: ReaderSettings = { ...current, locale: current.locale === 'fa' ? 'en' : 'fa' }
        persist(next)
        return next
      })
    },
    setTheme(theme: ThemeId) {
      patch({ theme })
    },
    cycleTheme() {
      update((current) => {
        const index = THEMES.findIndex((theme) => theme.id === current.theme)
        const next = { ...current, theme: THEMES[(index + 1) % THEMES.length].id }
        persist(next)
        return next
      })
    },
    setLineHeight(value: number) {
      patch({ lineHeight: clamp(value, 1.5, 2.4) })
    },
    toggle(key: 'wordSpacing' | 'ruler' | 'spotlight' | 'bionic') {
      update((current) => {
        const next = { ...current, [key]: !current[key] }
        persist(next)
        return next
      })
    },
    applyAdhdPreset() {
      patch(ADHD_PRESET)
    },
    reset() {
      // Resetting the look should not switch the interface language
      update((current) => {
        const next = { ...DEFAULT_SETTINGS, locale: current.locale }
        persist(next)
        return next
      })
    }
  }
}

export const settings = createSettingsStore()

export const locale = derived(settings, ($settings) => $settings.locale)

export const t = derived(
  settings,
  ($settings) =>
    (key: MessageKey, params?: Record<string, string | number>): string =>
      translate($settings.locale, key, params)
)
