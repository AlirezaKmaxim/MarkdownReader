<script lang="ts">
  import { settings } from '$lib/stores/settings'

  let y = $state(typeof window !== 'undefined' ? window.innerHeight / 2 : 300)

  // Band spans roughly four lines of text so the eye keeps its place
  const bandHeight = $derived(Math.round($settings.fontSize * $settings.lineHeight * 4))
  const top = $derived(Math.max(0, y - bandHeight / 2))
</script>

<svelte:window onmousemove={(event) => (y = event.clientY)} />

<div class="pointer-events-none fixed inset-0 z-30" aria-hidden="true">
  <div class="ruler-shade absolute inset-x-0 top-0" style:height="{top}px"></div>
  <div
    class="ruler-band absolute inset-x-0"
    style:top="{top}px"
    style:height="{bandHeight}px"
  ></div>
  <div class="ruler-shade absolute inset-x-0 bottom-0" style:top="{top + bandHeight}px"></div>
</div>

<style>
  .ruler-shade {
    background: color-mix(in srgb, var(--color-background) 72%, transparent);
  }

  .ruler-band {
    background: color-mix(in srgb, var(--color-accent) 7%, transparent);
    border-block: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
  }
</style>
