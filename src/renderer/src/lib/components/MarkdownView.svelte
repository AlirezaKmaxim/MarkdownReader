<script lang="ts">
  import { applyBionic, renderMarkdown } from '$lib/utils/markdown'
  import { settings } from '$lib/stores/settings'

  let {
    content
  }: {
    content: string
  } = $props()

  const WIDTHS = { narrow: '44rem', medium: '58rem', wide: '78rem' } as const
  // Blocks that the paragraph spotlight steps through; list items count individually
  const UNIT_SELECTOR = ':scope > :not(ul, ol), :scope > ul > li, :scope > ol > li'

  let articleEl: HTMLElement | undefined = $state()
  let units: HTMLElement[] = []
  let activeIndex = -1

  let html = $derived.by(() => {
    const rendered = renderMarkdown(content)
    return $settings.bionic ? applyBionic(rendered) : rendered
  })

  function setActive(index: number, scroll: boolean): void {
    if (index < 0 || index >= units.length) return
    units[activeIndex]?.classList.remove('is-active')
    activeIndex = index
    const unit = units[index]
    unit.classList.add('is-active')
    if (scroll) unit.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  // Re-tag blocks whenever the rendered HTML changes
  $effect(() => {
    void html
    if (!articleEl) return
    units = Array.from(articleEl.querySelectorAll<HTMLElement>(UNIT_SELECTOR))
    units.forEach((unit) => unit.classList.add('focus-unit'))
    const previous = activeIndex
    activeIndex = -1
    setActive(Math.min(Math.max(previous, 0), units.length - 1), false)
  })

  function onMouseOver(event: MouseEvent): void {
    if (!$settings.spotlight) return
    const target = event.target as HTMLElement
    const index = units.findIndex((unit) => unit.contains(target))
    if (index !== -1 && index !== activeIndex) setActive(index, false)
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!$settings.spotlight || event.ctrlKey || event.altKey || event.metaKey) return
    if (
      event.target instanceof Element &&
      event.target.closest('input, textarea, [contenteditable]')
    )
      return
    if (event.key === 'ArrowDown' || event.key === 'j' || event.key === 'J') {
      event.preventDefault()
      setActive(activeIndex + 1, true)
    } else if (event.key === 'ArrowUp' || event.key === 'k' || event.key === 'K') {
      event.preventDefault()
      setActive(activeIndex - 1, true)
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<article
  bind:this={articleEl}
  class="markdown-body mx-auto px-6 pb-24 pt-24"
  class:spotlight={$settings.spotlight}
  dir="rtl"
  style:max-width={WIDTHS[$settings.contentWidth]}
  style:--reader-font-size="{$settings.fontSize}px"
  style:--reader-font-weight={$settings.fontWeight}
  style:--reader-line-height={$settings.lineHeight}
  style:--reader-word-spacing={$settings.wordSpacing ? '0.18em' : 'normal'}
  onmouseover={onMouseOver}
>
  {@html html}
</article>
