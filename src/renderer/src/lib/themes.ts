export type ThemeId =
  | 'light'
  | 'dark'
  | 'claude'
  | 'claude-dark'
  | 'twitter'
  | 'twitter-dim'
  | 'emerald'
  | 'emerald-dark'

export type ThemeInfo = {
  id: ThemeId
  dark: boolean
  swatch: { bg: string; fg: string; accent: string }
}

// Swatch colors mirror the CSS variables defined in app.css.
// Labels live in i18n.ts under theme.<id> and theme.<id>.hint
export const THEMES: ThemeInfo[] = [
  {
    id: 'light',
    dark: false,
    swatch: { bg: '#f7f5f2', fg: '#1c1917', accent: '#0f766e' }
  },
  {
    id: 'dark',
    dark: true,
    swatch: { bg: '#1c1917', fg: '#f5f5f4', accent: '#2dd4bf' }
  },
  {
    id: 'claude',
    dark: false,
    swatch: { bg: '#faf9f5', fg: '#29261b', accent: '#c96442' }
  },
  {
    id: 'claude-dark',
    dark: true,
    swatch: { bg: '#262624', fg: '#ece9e0', accent: '#d97757' }
  },
  {
    id: 'twitter',
    dark: false,
    swatch: { bg: '#ffffff', fg: '#0f1419', accent: '#1d9bf0' }
  },
  {
    id: 'twitter-dim',
    dark: true,
    swatch: { bg: '#15202b', fg: '#f7f9f9', accent: '#1d9bf0' }
  },
  {
    id: 'emerald',
    dark: false,
    swatch: { bg: '#e8f3ec', fg: '#12261e', accent: '#047857' }
  },
  {
    id: 'emerald-dark',
    dark: true,
    swatch: { bg: '#0c1f19', fg: '#d3eadf', accent: '#34d399' }
  }
]

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value)
}

export function getTheme(id: ThemeId): ThemeInfo {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0]
}
