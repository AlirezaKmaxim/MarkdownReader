<script lang="ts">
  import Check from 'lucide-svelte/icons/check'
  import { settings, t } from '$lib/stores/settings'
  import type { MessageKey } from '$lib/i18n'
  import { THEMES } from '$lib/themes'
  import { cn } from '$lib/utils'
</script>

<div class="w-72 space-y-2">
  <div class="flex items-center justify-between text-sm">
    <span class="text-[var(--color-muted-foreground)]">{$t('theme.heading')}</span>
    <kbd class="rounded border border-[var(--color-border)] px-1.5 text-[10px]">T</kbd>
  </div>
  <div class="grid grid-cols-2 gap-1.5">
    {#each THEMES as theme (theme.id)}
      <button
        type="button"
        class={cn(
          'flex items-center gap-2 rounded-lg border p-2 text-start transition-colors hover:bg-[var(--color-muted)]',
          $settings.theme === theme.id
            ? 'border-[var(--color-accent)]'
            : 'border-[var(--color-border)]'
        )}
        onclick={() => settings.setTheme(theme.id)}
        aria-pressed={$settings.theme === theme.id}
      >
        <span
          class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black/10 text-[11px] font-bold"
          style:background={theme.swatch.bg}
          style:color={theme.swatch.fg}
        >
          {$t('theme.swatch')}
          <span
            class="absolute bottom-1 end-1 h-1.5 w-1.5 rounded-full"
            style:background={theme.swatch.accent}
          ></span>
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-xs font-medium">{$t(`theme.${theme.id}` as MessageKey)}</span>
          <span class="block truncate text-[10px] text-[var(--color-muted-foreground)]"
            >{$t(`theme.${theme.id}.hint` as MessageKey)}</span
          >
        </span>
        {#if $settings.theme === theme.id}
          <Check class="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />
        {/if}
      </button>
    {/each}
  </div>
</div>
