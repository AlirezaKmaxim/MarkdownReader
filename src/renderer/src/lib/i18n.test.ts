import { describe, expect, it } from 'vitest'
import { formatNumber, messages, resolveLocale, translate } from './i18n'

describe('messages', () => {
  it('has every key in both languages', () => {
    const fa = Object.keys(messages.fa).sort()
    const en = Object.keys(messages.en).sort()
    expect(en).toEqual(fa)
  })

  it('has no empty strings', () => {
    for (const dict of Object.values(messages)) {
      for (const value of Object.values(dict)) expect(value.trim()).not.toBe('')
    }
  })
})

describe('translate', () => {
  it('replaces placeholders', () => {
    expect(translate('en', 'status.minutesLeft', { minutes: '3', percent: '40' })).toBe(
      '3 min left · 40%'
    )
  })

  it('returns the Persian text for fa', () => {
    expect(translate('fa', 'header.openFile')).toBe('باز کردن فایل')
  })
})

describe('resolveLocale', () => {
  it('keeps Persian for people upgrading from a version without the setting', () => {
    expect(resolveLocale(undefined, true, 'en-US')).toBe('fa')
  })

  it('uses the system language on a fresh install', () => {
    expect(resolveLocale(undefined, false, 'fa-IR')).toBe('fa')
    expect(resolveLocale(undefined, false, 'en-US')).toBe('en')
    expect(resolveLocale(undefined, false, 'de-DE')).toBe('en')
  })

  it('respects a saved choice', () => {
    expect(resolveLocale('en', true, 'fa-IR')).toBe('en')
    expect(resolveLocale('fa', true, 'en-US')).toBe('fa')
  })

  it('ignores a corrupt saved value', () => {
    expect(resolveLocale('xx', true, 'en-US')).toBe('fa')
  })
})

describe('formatNumber', () => {
  it('uses Persian digits for fa and Latin for en', () => {
    expect(formatNumber('fa', 12)).toBe('۱۲')
    expect(formatNumber('en', 12)).toBe('12')
  })
})
