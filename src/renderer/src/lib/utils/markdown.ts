import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: true
})

export function renderMarkdown(source: string): string {
  const html = marked.parse(source, { async: false }) as string
  // Wrap tables so wide ones scroll on their own instead of stretching the page
  return html
    .replaceAll('<table>', '<div class="table-wrap"><table>')
    .replaceAll('</table>', '</table></div>')
}

// Only Latin words are emphasised: splitting a Persian word across a
// weight change breaks its cursive letter joins.
const LATIN_WORD = /[A-Za-z][A-Za-z'’]*/g
const HAS_LATIN = /[A-Za-z]/
const SKIP_TAGS = new Set(['CODE', 'PRE', 'KBD', 'SAMP', 'SCRIPT', 'STYLE'])

function bionicStemLength(word: string): number {
  if (word.length <= 3) return 1
  return Math.ceil(word.length * 0.45)
}

// Parsing into <body> directly (not a wrapper <div>) so a stray </div> in the
// document cannot close the wrapper early and drop the rest of the text
function parseFragment(html: string): { doc: Document; root: HTMLElement } {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return { doc, root: doc.body }
}

export function applyBionic(html: string): string {
  const { doc, root } = parseFragment(html)

  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      for (let el = node.parentElement; el && el !== root; el = el.parentElement) {
        if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT
      }
      return HAS_LATIN.test(node.nodeValue ?? '')
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT
    }
  })

  const textNodes: Text[] = []
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text)

  for (const node of textNodes) {
    const text = node.nodeValue ?? ''
    const fragment = doc.createDocumentFragment()
    let last = 0
    for (const match of text.matchAll(LATIN_WORD)) {
      const word = match[0]
      const start = match.index ?? 0
      if (start > last) fragment.append(text.slice(last, start))
      const stem = bionicStemLength(word)
      const bold = doc.createElement('b')
      bold.className = 'bionic'
      bold.textContent = word.slice(0, stem)
      fragment.append(bold, word.slice(stem))
      last = start + word.length
    }
    if (last < text.length) fragment.append(text.slice(last))
    node.replaceWith(fragment)
  }

  return root.innerHTML
}

const RTL_LETTER = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/
const LATIN_LETTER = /[A-Za-z\u00C0-\u024F]/

/**
 * Direction from the majority of words, so a Persian sentence that starts
 * with (or contains long) English terms still reads right-to-left. Words are
 * counted rather than letters because English identifiers are long and
 * Persian words short. A tie goes to rtl.
 */
export function detectDirection(text: string): 'rtl' | 'ltr' | null {
  let rtl = 0
  let latin = 0
  for (const word of text.split(/\s+/)) {
    if (RTL_LETTER.test(word)) rtl++
    else if (LATIN_LETTER.test(word)) latin++
  }
  if (rtl === 0 && latin === 0) return null
  return rtl >= latin ? 'rtl' : 'ltr'
}

const DIRECTION_BLOCKS = 'p, h1, h2, h3, h4, h5, h6, li, ul, ol, blockquote, table, th, td, dt, dd'
const DIRECTION_IGNORED = new Set(['CODE', 'PRE', 'KBD', 'SAMP'])

function proseText(el: Element): string {
  let text = ''
  const walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    let ignored = false
    for (let p = walker.currentNode.parentElement; p && p !== el; p = p.parentElement) {
      if (DIRECTION_IGNORED.has(p.tagName)) {
        ignored = true
        break
      }
    }
    if (!ignored) text += walker.currentNode.nodeValue ?? ''
  }
  return text
}

/** Gives each block its own direction unless the author already chose one. */
export function annotateDirection(html: string): string {
  const { root } = parseFragment(html)

  const authored = new Set(Array.from(root.querySelectorAll('[dir]')))
  const isAuthored = (el: Element): boolean => {
    for (let node: Element | null = el; node && node !== root; node = node.parentElement) {
      if (authored.has(node)) return true
    }
    return false
  }

  for (const el of Array.from(root.querySelectorAll(DIRECTION_BLOCKS))) {
    if (isAuthored(el)) continue
    const dir = detectDirection(proseText(el))
    if (dir) el.setAttribute('dir', dir)
  }
  return root.innerHTML
}

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i
const WINDOWS_ABSOLUTE = /^[a-z]:[\\/]/i
// file://host/..., \\host\..., //host/... all reach out over SMB on Windows,
// which sends the user's NTLM credentials just by rendering an image
const NETWORK_PATH = /^(?:file:\/\/[^/]|\\\\|\/\/)/i

function toFileUrl(path: string): string {
  const parts: string[] = []
  for (const part of path.replace(/\\/g, '/').split('/')) {
    if (part === '' || part === '.') continue
    if (part === '..') parts.pop()
    else parts.push(part)
  }
  const [drive, ...rest] = parts
  return `file:///${drive}/${rest.map((p) => encodeURIComponent(p)).join('/')}`
}

function safeDecode(value: string): string {
  try {
    return decodeURI(value)
  } catch {
    return value
  }
}

const URL_ATTRIBUTES: [selector: string, attribute: string][] = [
  ['img[src]', 'src'],
  ['a[href]', 'href']
]

/**
 * Points relative image and link URLs at the folder of the open document and
 * strips network file paths. Without a local folder, relative URLs are left
 * as they are.
 */
export function resolveRelativeUrls(html: string, fileDir: string): string {
  const { root } = parseFragment(html)
  const canResolve = fileDir !== '' && !NETWORK_PATH.test(fileDir)
  let changed = false

  for (const [selector, attribute] of URL_ATTRIBUTES) {
    for (const el of Array.from(root.querySelectorAll(selector))) {
      const raw = el.getAttribute(attribute) ?? ''
      const url = safeDecode(raw)
      if (NETWORK_PATH.test(url)) {
        el.removeAttribute(attribute)
        changed = true
        continue
      }
      if (!canResolve || !url || url.startsWith('#')) continue
      if (WINDOWS_ABSOLUTE.test(url)) {
        el.setAttribute(attribute, toFileUrl(url))
        changed = true
        continue
      }
      if (HAS_SCHEME.test(url) || url.startsWith('/')) continue
      el.setAttribute(attribute, toFileUrl(`${fileDir}/${url}`))
      changed = true
    }
  }
  return changed ? root.innerHTML : html
}

export function countWords(source: string): number {
  return source.split(/\s+/).filter(Boolean).length
}
