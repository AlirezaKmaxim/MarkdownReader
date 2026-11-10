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

export function applyBionic(html: string): string {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild
  if (!root) return html

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

export function countWords(source: string): number {
  return source.split(/\s+/).filter(Boolean).length
}
