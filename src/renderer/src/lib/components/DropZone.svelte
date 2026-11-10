<script lang="ts">
  import { t } from '$lib/stores/settings'

  let {
    active = false,
    onDropFiles
  }: {
    active?: boolean
    onDropFiles: (files: FileList) => void
  } = $props()

  let dragging = $state(false)

  function hasAllowedFile(files: FileList | null): boolean {
    if (!files || files.length === 0) return false
    return Array.from(files).some((file) => /\.(md|markdown|txt)$/i.test(file.name))
  }

  function onDragOver(event: DragEvent): void {
    event.preventDefault()
    if (
      hasAllowedFile(event.dataTransfer?.files ?? null) ||
      event.dataTransfer?.types.includes('Files')
    ) {
      dragging = true
    }
  }

  function onDragLeave(event: DragEvent): void {
    event.preventDefault()
    dragging = false
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault()
    dragging = false
    if (event.dataTransfer?.files?.length) {
      onDropFiles(event.dataTransfer.files)
    }
  }
</script>

{#if active}
  <div
    class="flex h-full items-center justify-center px-6"
    role="region"
    aria-label={$t('drop.region')}
    ondragover={onDragOver}
    ondragleave={onDragLeave}
    ondrop={onDrop}
  >
    <div
      class="w-full max-w-xl rounded-3xl border-2 border-dashed px-8 py-16 text-center transition-colors {dragging
        ? 'border-[var(--color-accent)] bg-[var(--color-muted)]'
        : 'border-[var(--color-border)] bg-[var(--color-card)]'}"
    >
      <p class="text-xl font-medium text-[var(--color-foreground)]">{$t('drop.title')}</p>
      <p class="mt-3 text-sm text-[var(--color-muted-foreground)]">
        {$t('drop.hint')}
      </p>
      {#if window.api.platform === 'win32'}
        <button
          type="button"
          class="mt-6 text-xs text-[var(--color-accent)] underline underline-offset-4 hover:opacity-80"
          onclick={() => window.api.openDefaultAppsSettings()}
        >
          {$t('drop.setDefault')}
        </button>
      {/if}
    </div>
  </div>
{:else}
  <div
    class="contents"
    role="presentation"
    ondragover={onDragOver}
    ondragleave={onDragLeave}
    ondrop={onDrop}
  ></div>
{/if}
