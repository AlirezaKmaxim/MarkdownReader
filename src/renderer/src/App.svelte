<script lang="ts">
  import { onMount } from 'svelte'
  import FloatingHeader from '$lib/components/FloatingHeader.svelte'
  import DropZone from '$lib/components/DropZone.svelte'
  import MarkdownView from '$lib/components/MarkdownView.svelte'
  import ReadingRuler from '$lib/components/ReadingRuler.svelte'
  import { settings, t } from '$lib/stores/settings'
  import { formatNumber } from '$lib/i18n'
  import { countWords } from '$lib/utils/markdown'

  type OpenedFile = Awaited<ReturnType<typeof window.api.readFilePath>>

  const WORDS_PER_MINUTE = 200

  let markdown = $state('')
  let fileName = $state('')
  let filePath = $state('')
  let error = $state('')
  let focusMode = $state(false)
  let progress = $state(0)
  let mainEl: HTMLElement | undefined = $state()

  const hasContent = $derived(markdown.length > 0)
  const totalWords = $derived(countWords(markdown))
  const minutesLeft = $derived(Math.ceil((totalWords * (1 - progress)) / WORDS_PER_MINUTE))

  function showFile(file: OpenedFile): void {
    error = ''
    markdown = file.content
    fileName = file.name
    filePath = file.path
    if (mainEl) mainEl.scrollTop = 0
    progress = 0
  }

  onMount(() => {
    window.api
      .getInitialFile()
      .then((file) => file && showFile(file))
      .catch((err) => (error = err instanceof Error ? err.message : $t('error.open')))

    const unsubscribers = [
      window.api.onFileOpened(showFile),
      // Live reload keeps the reader's scroll position
      window.api.onFileChanged((file) => {
        if (file.path === filePath) markdown = file.content
      }),
      window.api.onFileError((message) => (error = message))
    ]
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
  })

  async function openFile(): Promise<void> {
    try {
      error = ''
      const file = await window.api.openFile()
      if (file) showFile(file)
    } catch (err) {
      error = err instanceof Error ? err.message : $t('error.open')
    }
  }

  async function handleDroppedFiles(files: FileList): Promise<void> {
    const file = Array.from(files).find((item) => /\.(md|markdown|txt)$/i.test(item.name))
    if (!file) {
      error = $t('error.unsupported')
      return
    }

    try {
      error = ''
      const path = window.api.getPathForFile(file)
      if (path) {
        showFile(await window.api.readFilePath(path))
        return
      }

      showFile({ content: await file.text(), name: file.name, path: '' })
      await window.api.setTitle(`${file.name} — ${$t('app.title')}`)
    } catch (err) {
      error = err instanceof Error ? err.message : $t('error.read')
    }
  }

  function toggleFocus(): void {
    focusMode = !focusMode
  }

  function onScroll(): void {
    if (!mainEl) return
    const max = mainEl.scrollHeight - mainEl.clientHeight
    progress = max > 0 ? Math.min(1, mainEl.scrollTop / max) : 1
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'F11') {
      event.preventDefault()
      toggleFocus()
      return
    }
    if (event.key === 'Escape' && focusMode) {
      event.preventDefault()
      focusMode = false
      return
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'o') {
      event.preventDefault()
      openFile()
      return
    }

    if (event.ctrlKey || event.altKey || event.metaKey) return
    if (
      event.target instanceof Element &&
      event.target.closest('input, textarea, [contenteditable]')
    )
      return
    // event.code keeps shortcuts working with a Persian keyboard layout
    const shortcuts: Record<string, () => void> = {
      KeyR: () => settings.toggle('ruler'),
      KeyP: () => settings.toggle('spotlight'),
      KeyB: () => settings.toggle('bionic'),
      KeyT: () => settings.cycleTheme()
    }
    const action = shortcuts[event.code]
    if (action) {
      event.preventDefault()
      action()
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div
  class="relative h-full bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300"
  role="application"
  ondragover={(e) => e.preventDefault()}
  ondrop={(e) => {
    e.preventDefault()
    if (e.dataTransfer?.files?.length) {
      handleDroppedFiles(e.dataTransfer.files)
    }
  }}
>
  {#if hasContent}
    <div class="fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden="true">
      <div
        class="h-full bg-[var(--color-accent)] transition-[width] duration-150"
        style:width="{progress * 100}%"
      ></div>
    </div>
  {/if}

  {#if !focusMode}
    <FloatingHeader onOpenFile={openFile} onToggleFocus={toggleFocus} />
  {/if}

  <main class="h-full overflow-y-auto" bind:this={mainEl} onscroll={onScroll}>
    {#if error}
      <div
        class="mx-auto mt-24 max-w-xl rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
      >
        {error}
      </div>
    {/if}

    {#if hasContent}
      <MarkdownView content={markdown} />
    {:else}
      <DropZone active={true} onDropFiles={handleDroppedFiles} />
    {/if}
  </main>

  {#if hasContent && $settings.ruler}
    <ReadingRuler />
  {/if}

  {#if focusMode}
    <button
      type="button"
      class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-xs text-[var(--color-muted-foreground)] opacity-40 backdrop-blur transition hover:opacity-100"
      onclick={toggleFocus}
    >
      {$t('focus.exit')}
    </button>
  {/if}

  {#if hasContent && !focusMode}
    <div
      class="pointer-events-none fixed bottom-3 inset-x-4 z-40 flex items-center justify-between text-xs text-[var(--color-muted-foreground)]"
    >
      <span>{fileName}</span>
      <span class="tabular-nums">
        {#if minutesLeft > 0}
          {$t('status.minutesLeft', {
            minutes: formatNumber($settings.locale, minutesLeft),
            percent: formatNumber($settings.locale, Math.round(progress * 100))
          })}
        {:else}
          {$t('status.done')}
        {/if}
      </span>
    </div>
  {/if}
</div>
