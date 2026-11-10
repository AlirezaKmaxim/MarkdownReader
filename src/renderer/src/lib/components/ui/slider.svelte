<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className = '',
    value = $bindable(16),
    min = 14,
    max = 24,
    step = 1,
    id,
    'aria-label': ariaLabel,
    oninput
  }: {
    class?: string
    value?: number
    min?: number
    max?: number
    step?: number
    id?: string
    'aria-label'?: string
    oninput?: (event: Event) => void
  } = $props()
</script>

<input
  type="range"
  {id}
  {min}
  {max}
  {step}
  {value}
  aria-label={ariaLabel}
  {oninput}
  class={cn(
    'h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-muted)] accent-[var(--color-accent)]',
    className
  )}
/>
