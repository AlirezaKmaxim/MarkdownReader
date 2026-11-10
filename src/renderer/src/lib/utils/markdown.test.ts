import { describe, expect, it } from 'vitest'
import { annotateDirection, detectDirection, resolveImageSources } from './markdown'

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

  it('never overrides a direction the author set', () => {
    const html = annotateDirection('<div dir="rtl"><p>Hello</p></div><p dir="ltr">سلام</p>')
    expect(html).toBe('<div dir="rtl"><p>Hello</p></div><p dir="ltr">سلام</p>')
  })

  it('leaves blocks without letters alone', () => {
    expect(annotateDirection('<p>1234</p>')).toBe('<p>1234</p>')
  })
})

describe('resolveImageSources', () => {
  it('turns a relative image path into a file URL next to the document', () => {
    const html = resolveImageSources('<img src="a b/img.png" alt="x">', 'C:\\docs\\notes')
    expect(html).toContain('src="file:///C:/docs/notes/a%20b/img.png"')
  })

  it('handles ./ and ../ paths', () => {
    expect(resolveImageSources('<img src="./x.png">', 'C:\\docs')).toContain(
      'src="file:///C:/docs/x.png"'
    )
    expect(resolveImageSources('<img src="../x.png">', 'C:\\docs\\sub')).toContain(
      'src="file:///C:/docs/x.png"'
    )
  })

  it('leaves web, data and absolute file URLs untouched', () => {
    for (const src of ['https://x.org/y.png', 'data:image/png;base64,AA', 'file:///C:/z.png']) {
      expect(resolveImageSources(`<img src="${src}">`, 'C:\\docs')).toContain(`src="${src}"`)
    }
  })

  it('does nothing when the document has no folder (dropped from memory)', () => {
    expect(resolveImageSources('<img src="x.png">', '')).toBe('<img src="x.png">')
  })
})
