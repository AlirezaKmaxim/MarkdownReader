<script lang="ts">
  import type { Snippet } from 'svelte'
  import { cn } from '$lib/utils'

  type Variant = 'default' | 'ghost' | 'outline' | 'secondary'
  type Size = 'default' | 'sm' | 'icon'

  let {
    class: className = '',
    variant = 'default',
    size = 'default',
    type = 'button',
    disabled = false,
    onclick,
    children,
    title,
    'aria-label': ariaLabel
  }: {
    class?: string
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    onclick?: (event: MouseEvent) => void
    children?: Snippet
    title?: string
    'aria-label'?: string
  } = $props()

  const variants: Record<Variant, string> = {
    default:
      'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:opacity-90 shadow-sm',
    ghost: 'hover:bg-[var(--color-muted)] text-[var(--color-foreground)]',
    outline:
      'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)] text-[var(--color-foreground)]',
    secondary: 'bg-[var(--color-muted)] text-[var(--color-foreground)] hover:opacity-90'
  }

  const sizes: Record<Size, string> = {
    default: 'h-9 px-3 text-sm gap-2',
    sm: 'h-8 px-2.5 text-xs gap-1.5',
    icon: 'h-9 w-9'
  }
</script>

<button
  {type}
  {disabled}
  {title}
  aria-label={ariaLabel}
  {onclick}
  class={cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  )}
>
  {#if children}
    {@render children()}
  {/if}
</button>
