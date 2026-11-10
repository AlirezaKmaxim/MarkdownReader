<script lang="ts">
  import type { Snippet } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    open = $bindable(false),
    class: className = '',
    trigger,
    content
  }: {
    open?: boolean
    class?: string
    trigger: Snippet
    content: Snippet
  } = $props()

  let rootEl: HTMLDivElement | undefined = $state()

  function onWindowClick(event: MouseEvent): void {
    if (!open || !rootEl) return
    if (!rootEl.contains(event.target as Node)) {
      open = false
    }
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && open) {
      open = false
    }
  }
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKeydown} />

<div class={cn('relative inline-flex', className)} bind:this={rootEl}>
  <div
    role="button"
    tabindex="-1"
    onclick={() => (open = !open)}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        open = !open
      }
    }}
  >
    {@render trigger()}
  </div>

  {#if open}
    <div
      class="absolute end-0 top-full z-50 mt-2 min-w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-popover)] p-4 text-[var(--color-foreground)] shadow-lg backdrop-blur"
      role="dialog"
    >
      {@render content()}
    </div>
  {/if}
</div>
