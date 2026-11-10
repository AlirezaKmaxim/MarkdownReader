export type Locale = 'fa' | 'en'

export const LOCALES: Locale[] = ['fa', 'en']

const fa = {
  'app.title': 'مارک‌داون خوان آرام',
  'error.open': 'خطا در باز کردن فایل',
  'error.read': 'خطا در خواندن فایل',
  'error.unsupported': 'فقط فایل‌های .md و .txt پشتیبانی می‌شوند',
  'focus.exit': 'خروج از تمرکز (Esc / F11)',
  'status.minutesLeft': '{minutes} دقیقه مانده · {percent}٪',
  'status.done': 'پایان متن ✓',

  'header.openFile': 'باز کردن فایل',
  'header.openFileTitle': 'باز کردن فایل (Ctrl+O)',
  'header.font': 'تنظیمات فونت',
  'header.theme': 'انتخاب تم',
  'header.themeTitle': 'انتخاب تم (T)',
  'header.aids': 'ابزارهای تمرکز',
  'header.aidsTitle': 'ابزارهای تمرکز و خوانایی',
  'header.focus': 'حالت تمرکز',
  'header.focusTitle': 'حالت تمرکز (F11)',
  'header.language': 'Switch to English',

  'drop.region': 'ناحیه رها کردن فایل',
  'drop.title': 'فایل را اینجا رها کنید',
  'drop.hint': 'فایل‌های .md و .txt پشتیبانی می‌شوند — یا از دکمه «باز کردن فایل» استفاده کنید',
  'drop.setDefault': 'تنظیم به‌عنوان برنامه پیش‌فرض فایل‌های Markdown',

  'aids.adhdPreset': 'حالت تمرکز ADHD',
  'aids.adhdHint': 'تم زمردی، خطوط کوتاه، فاصله بیشتر و خط‌کش خواندن — یکجا.',
  'aids.ruler': 'خط‌کش خواندن',
  'aids.rulerHint': 'نواری که همراه ماوس حرکت می‌کند',
  'aids.spotlight': 'تمرکز روی پاراگراف',
  'aids.spotlightHint': 'بقیه متن کم‌رنگ می‌شود؛ با ↑↓ جابه‌جا شوید',
  'aids.bionic': 'خوانش بیونیک',
  'aids.bionicHint': 'پررنگ کردن ابتدای کلمات لاتین',
  'aids.wordSpacing': 'فاصله بیشتر کلمات',
  'aids.wordSpacingHint': 'جدا کردن واضح‌تر کلمات',
  'aids.lineHeight': 'فاصله خطوط',
  'aids.contentWidth': 'عرض متن',
  'aids.width.narrow': 'باریک',
  'aids.width.medium': 'متوسط',
  'aids.width.wide': 'عریض',
  'aids.reset': 'بازگشت به تنظیمات پیش‌فرض',

  'font.size': 'سایز فونت',
  'font.weight': 'وزن فونت',
  'font.weight.300': 'سبک',
  'font.weight.400': 'معمولی',
  'font.weight.500': 'متوسط',
  'font.weight.700': 'ضخیم',

  'theme.heading': 'تم',
  'theme.swatch': 'آ',
  'theme.light': 'کاغذی',
  'theme.light.hint': 'روشن و گرم',
  'theme.dark': 'شب',
  'theme.dark.hint': 'تیره و آرام',
  'theme.claude': 'کلاد',
  'theme.claude.hint': 'کرمی با تراکوتا',
  'theme.claude-dark': 'کلاد تیره',
  'theme.claude-dark.hint': 'زغالی گرم',
  'theme.twitter': 'توییتر',
  'theme.twitter.hint': 'سفید با آبی',
  'theme.twitter-dim': 'توییتر Dim',
  'theme.twitter-dim.hint': 'سرمه‌ای ملایم',
  'theme.emerald': 'زمردی تمرکز',
  'theme.emerald.hint': 'کم‌تابش، مناسب ADHD',
  'theme.emerald-dark': 'زمردی شب',
  'theme.emerald-dark.hint': 'تمرکز در نور کم'
}

export type MessageKey = keyof typeof fa

const en: Record<MessageKey, string> = {
  'app.title': 'Aram Markdown Reader',
  'error.open': 'Could not open the file',
  'error.read': 'Could not read the file',
  'error.unsupported': 'Only .md and .txt files are supported',
  'focus.exit': 'Exit focus (Esc / F11)',
  'status.minutesLeft': '{minutes} min left · {percent}%',
  'status.done': 'End of text ✓',

  'header.openFile': 'Open file',
  'header.openFileTitle': 'Open file (Ctrl+O)',
  'header.font': 'Font settings',
  'header.theme': 'Choose theme',
  'header.themeTitle': 'Choose theme (T)',
  'header.aids': 'Focus tools',
  'header.aidsTitle': 'Focus and readability tools',
  'header.focus': 'Focus mode',
  'header.focusTitle': 'Focus mode (F11)',
  'header.language': 'تغییر به فارسی',

  'drop.region': 'File drop area',
  'drop.title': 'Drop a file here',
  'drop.hint': '.md and .txt files are supported — or use the “Open file” button',
  'drop.setDefault': 'Set as the default app for Markdown files',

  'aids.adhdPreset': 'ADHD focus mode',
  'aids.adhdHint': 'Emerald theme, short lines, more spacing and a reading ruler — in one click.',
  'aids.ruler': 'Reading ruler',
  'aids.rulerHint': 'A band that follows your mouse',
  'aids.spotlight': 'Paragraph spotlight',
  'aids.spotlightHint': 'Dims the rest of the text; move with ↑↓',
  'aids.bionic': 'Bionic reading',
  'aids.bionicHint': 'Bolds the start of Latin words',
  'aids.wordSpacing': 'Wider word spacing',
  'aids.wordSpacingHint': 'Separates words more clearly',
  'aids.lineHeight': 'Line height',
  'aids.contentWidth': 'Text width',
  'aids.width.narrow': 'Narrow',
  'aids.width.medium': 'Medium',
  'aids.width.wide': 'Wide',
  'aids.reset': 'Reset to defaults',

  'font.size': 'Font size',
  'font.weight': 'Font weight',
  'font.weight.300': 'Light',
  'font.weight.400': 'Regular',
  'font.weight.500': 'Medium',
  'font.weight.700': 'Bold',

  'theme.heading': 'Theme',
  'theme.swatch': 'Aa',
  'theme.light': 'Paper',
  'theme.light.hint': 'Light and warm',
  'theme.dark': 'Night',
  'theme.dark.hint': 'Dark and calm',
  'theme.claude': 'Claude',
  'theme.claude.hint': 'Cream with terracotta',
  'theme.claude-dark': 'Claude Dark',
  'theme.claude-dark.hint': 'Warm charcoal',
  'theme.twitter': 'Twitter',
  'theme.twitter.hint': 'White with blue',
  'theme.twitter-dim': 'Twitter Dim',
  'theme.twitter-dim.hint': 'Soft navy',
  'theme.emerald': 'Emerald Focus',
  'theme.emerald.hint': 'Low glare, ADHD-friendly',
  'theme.emerald-dark': 'Emerald Night',
  'theme.emerald-dark.hint': 'Focus in low light'
}

export const messages: Record<Locale, Record<MessageKey, string>> = { fa, en }

export function isLocale(value: unknown): value is Locale {
  return value === 'fa' || value === 'en'
}

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>
): string {
  const template = messages[locale][key] ?? messages.fa[key] ?? key
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  )
}

export function formatNumber(locale: Locale, value: number): string {
  return value.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')
}

/**
 * People upgrading from a version that had no language setting were using a
 * Persian-only app, so they keep Persian. Fresh installs follow the system.
 */
export function resolveLocale(
  saved: unknown,
  hasSavedSettings: boolean,
  systemLanguage: string
): Locale {
  if (isLocale(saved)) return saved
  if (hasSavedSettings) return 'fa'
  return systemLanguage.toLowerCase().startsWith('fa') ? 'fa' : 'en'
}

export function directionOf(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'fa' ? 'rtl' : 'ltr'
}
