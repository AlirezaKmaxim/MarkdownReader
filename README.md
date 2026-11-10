# Aram Markdown Reader · مارک‌داون خوان آرام

A calm, distraction-free Markdown reader for Windows. Built for Persian (right-to-left) and English, with reading aids for people with ADHD.

[فارسی](#فارسی) · [Download](../../releases/latest)

## Features

- **Persian and English interface.** Switch with the `EN` / `FA` button in the toolbar.
- **Automatic text direction.** Each paragraph, heading, list and table follows its own language, so Persian, English and mixed documents all read correctly. Code blocks are always left-to-right. A `dir` you set yourself in the file (for example `<div dir="rtl">`) is always respected.
- **ADHD focus tools**
  - **ADHD focus preset** — one click: low-glare emerald theme, short lines, more spacing and a reading ruler
  - **Reading ruler** — a band that follows the mouse and dims the rest of the page
  - **Paragraph spotlight** — only the block you are reading stays bright
  - **Bionic reading** — bolds the start of Latin words
  - Line height, text width and word spacing controls
  - Progress bar and estimated reading time left
- **Eight themes:** Paper, Night, Claude, Claude Dark, Twitter, Twitter Dim, Emerald Focus, Emerald Night.
- **Live reload** when the file is edited in another program.
- Images next to the file are shown; web links open in your browser; links to other Markdown files open in the reader.
- Vazirmatn font bundled — works offline.

## Install (Windows)

1. Download `Aram-Markdown-Reader-<version>-setup.exe` from [Releases](../../releases/latest).
2. Run it. The installer is not code-signed, so Windows SmartScreen may warn you: click **More info → Run anyway**.

### Make it the default app for `.md` files

Windows 10/11 do not let apps make themselves the default. Once:

1. Right-click any `.md` file → **Open with** → **Choose another app**
2. Pick **Aram Markdown Reader** and tick **Always**

Or use the “Set as the default app” link on the start screen.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Ctrl+O` | Open a file |
| `T` | Next theme |
| `R` | Reading ruler |
| `P` | Paragraph spotlight (move with `↑` `↓` or `J` `K`) |
| `B` | Bionic reading |
| `F11` | Enter / leave focus mode |
| `Esc` | Leave focus mode |

## Build from source

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # run in development
npm test         # unit tests
npm run dist     # build the Windows installer into dist/
```

Built with Electron, Svelte 5, Tailwind CSS and marked.

## License

[MIT](LICENSE) © Alireza karimi

---

<div dir="rtl">

## فارسی

**مارک‌داون خوان آرام** برنامه‌ای سبک برای خواندن فایل‌های Markdown در ویندوز است، با فونت فارسی، فضای بدون حواس‌پرتی و ابزارهای مخصوص ADHD.

### ویژگی‌ها

- **رابط فارسی و انگلیسی.** با دکمه‌ی `EN` / `FA` در نوار بالا عوض می‌شود.
- **جهت خودکار متن.** هر پاراگراف، تیتر، لیست و جدول جهتش را از زبان خودش می‌گیرد. فایل فارسی، انگلیسی و ترکیبی همه درست نمایش داده می‌شوند. کد همیشه چپ‌به‌راست است. اگر خودتان در فایل جهت گذاشته باشید (مثلاً `<div dir="rtl">`)، همان رعایت می‌شود.
- **ابزارهای تمرکز:** حالت تمرکز ADHD با یک کلیک، خط‌کش خواندن، تمرکز روی پاراگراف، خوانش بیونیک، تنظیم فاصله‌ی خطوط و عرض متن، نوار پیشرفت و زمان باقی‌مانده.
- **هشت تم**، از جمله «زمردی تمرکز» برای ADHD.
- **بارگذاری خودکار** وقتی فایل در برنامه‌ی دیگری ویرایش شود.
- تصویرهای کنار فایل نمایش داده می‌شوند؛ لینک‌های وب در مرورگر باز می‌شوند.

### نصب

1. فایل `Aram-Markdown-Reader-<version>-setup.exe` را از بخش [Releases](../../releases/latest) دانلود کنید.
2. اجرایش کنید. فایل نصب امضای دیجیتال ندارد، پس ممکن است ویندوز هشدار `SmartScreen` بدهد. روی **More info** و بعد **Run anyway** بزنید.

### برنامه‌ی پیش‌فرض فایل‌های Markdown

روی یک فایل `.md` راست‌کلیک کنید ← **Open with** ← **Choose another app**. بعد **Aram Markdown Reader** را انتخاب کنید و **Always** را بزنید.

</div>
