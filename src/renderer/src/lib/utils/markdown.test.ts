import { describe, expect, it } from 'vitest'
import { annotateDirection, applyBionic, detectDirection, resolveRelativeUrls } from './markdown'

describe('detectDirection', () => {
  it('treats mostly-Persian text as rtl', () => {
    expect(detectDirection('سلام world')).toBe('rtl')
  })

  it('treats mostly-Latin text as ltr', () => {
    expect(detectDirection('Hello there دنیا')).toBe('ltr')
  })

  it('keeps a Persian sentence with long English terms rtl', () => {
    expect(detectDirection('دستور npm run build را اجرا کن')).toBe('rtl')
  })

  it('keeps an English sentence with one Persian word ltr', () => {
    expect(detectDirection('The word سلام means hello')).toBe('ltr')
  })

  it('returns null when there are no letters', () => {
    expect(detectDirection('123 — 456')).toBeNull()
  })
})

describe('annotateDirection', () => {
  it('keeps a Persian paragraph rtl when it starts with inline code', () => {
    const html = annotateDirection('<p><code>npm run build</code> را اجرا کن</p>')
    expect(html).toContain('<p dir="rtl">')
  })

  it('makes an English paragraph ltr', () => {
    expect(annotateDirection('<p>Hello world</p>')).toBe('<p dir="ltr">Hello world</p>')
  })

  it('makes headings and list items follow their own text', () => {
    const html = annotateDirection('<h2>Install</h2><ul><li>نصب</li><li>Run it</li></ul>')
    expect(html).toContain('<h2 dir="ltr">')
    expect(html).toContain('<li dir="rtl">')
    expect(html).toContain('<li dir="ltr">')
  })

  it('gives a Persian cell its own direction inside an English table', () => {
    const html = annotateDirection(
      '<table><tr><th>Name</th><th>Description here</th></tr><tr><td>سلام</td><td>Hello world</td></tr></table>'
    )
    expect(html).toContain('<td dir="rtl">سلام</td>')
  })

  it('never overrides a direction the author set', () => {
    const html = annotateDirection('<div dir="rtl"><p>Hello</p></div><p dir="ltr">سلام</p>')
    expect(html).toBe('<div dir="rtl"><p>Hello</p></div><p dir="ltr">سلام</p>')
  })

  it('leaves blocks without letters alone', () => {
    expect(annotateDirection('<p>1234</p>')).toBe('<p>1234</p>')
  })

  it('keeps content after a stray closing div', () => {
    const html = annotateDirection('<p>Before</p></div><p>After text</p>')
    expect(html).toContain('After text')
  })
})

describe('applyBionic', () => {
  it('keeps content after a stray closing div', () => {
    expect(applyBionic('<p>Before</p></div><p>After</p>')).toContain(
      '<p><b class="bionic">Aft</b>er</p>'
    )
  })
})

describe('resolveRelativeUrls', () => {
  it('turns a relative image path into a file URL next to the document', () => {
    const html = resolveRelativeUrls('<img src="a b/img.png" alt="x">', 'C:\\docs\\notes')
    expect(html).toContain('src="file:///C:/docs/notes/a%20b/img.png"')
  })

  it('handles ./ and ../ paths', () => {
    expect(resolveRelativeUrls('<img src="./x.png">', 'C:\\docs')).toContain(
      'src="file:///C:/docs/x.png"'
    )
    expect(resolveRelativeUrls('<img src="../x.png">', 'C:\\docs\\sub')).toContain(
      'src="file:///C:/docs/x.png"'
    )
  })

  it('points relative links at the document folder', () => {
    expect(resolveRelativeUrls('<a href="other.md">x</a>', 'C:\\docs')).toContain(
      'href="file:///C:/docs/other.md"'
    )
  })

  it('leaves in-page anchors, web, mail and data URLs untouched', () => {
    for (const url of ['#intro', 'https://x.org/y', 'mailto:a@b.c', 'data:image/png;base64,AA']) {
      expect(resolveRelativeUrls(`<a href="${url}">x</a>`, 'C:\\docs')).toContain(`href="${url}"`)
    }
    expect(resolveRelativeUrls('<img src="file:///C:/z.png">', 'C:\\docs')).toContain(
      'src="file:///C:/z.png"'
    )
  })

  it('removes network file URLs that would leak Windows credentials', () => {
    const html = resolveRelativeUrls(
      '<img src="file://evil.example/share/x.png"><img src="\\\\evil\\share\\y.png"><a href="file://evil/s/a.md">x</a>',
      'C:\\docs'
    )
    expect(html).not.toContain('evil')
  })

  it('does not resolve against a network document folder', () => {
    expect(resolveRelativeUrls('<img src="x.png">', '\\\\server\\share')).not.toContain('file:')
  })

  it('does nothing when the document has no folder (dropped from memory)', () => {
    expect(resolveRelativeUrls('<img src="x.png">', '')).toBe('<img src="x.png">')
  })
})
