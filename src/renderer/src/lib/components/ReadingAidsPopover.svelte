<script lang="ts">
  import Sparkles from 'lucide-svelte/icons/sparkles'
  import { settings, t, type ContentWidth } from '$lib/stores/settings'
  import type { MessageKey } from '$lib/i18n'
  import Slider from '$lib/components/ui/slider.svelte'
  import Button from '$lib/components/ui/button.svelte'

  type ToggleKey = 'ruler' | 'spotlight' | 'bionic' | 'wordSpacing'

  const toggles: { key: ToggleKey; shortcut?: string }[] = [
    { key: 'ruler', shortcut: 'R' },
    { key: 'spotlight', shortcut: 'P' },
    { key: 'bionic', shortcut: 'B' },
    { key: 'wordSpacing' }
  ]

  const widths: ContentWidth[] = ['narrow', 'medium', 'wide']

  let lineHeight = $state($settings.lineHeight)

  function onLineHeightInput(event: Event): void {
    lineHeight = Number((event.currentTarget as HTMLInputElement).value)
    settings.setLineHeight(lineHeight)
  }
</script>

<div class="w-72 space-y-4">
  <Button class="w-full" onclick={() => settings.applyAdhdPreset()}>
    <Sparkles class="h-4 w-4" />
    <span>{$t('aids.adhdPreset')}</span>
  </Button>
  <p class="-mt-2 text-[11px] leading-5 text-[var(--color-muted-foreground)]">
    {$t('aids.adhdHint')}
  </p>

  <div class="space-y-1">
    {#each toggles as toggle (toggle.key)}
      <button
        type="button"
        role="switch"
        aria-checked={$settings[toggle.key]}
        class="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-[var(--color-muted)]"
        onclick={() => settings.toggle(toggle.key)}
      >
        <span class="min-w-0 flex-1">
          <span class="flex items-center gap-1.5 text-sm">
            {$t(`aids.${toggle.key}` as MessageKey)}
            {#if toggle.shortcut}
              <kbd class="rounded border border-[var(--color-border)] px-1 text-[10px]"
                >{toggle.shortcut}</kbd
              >
            {/if}
          </span>
          <span class="block text-[11px] text-[var(--color-muted-foreground)]"
            >{$t(`aids.${toggle.key}Hint` as MessageKey)}</span
          >
        </span>
        <span
          class="relative h-5 w-9 shrink-0 rounded-full transition-colors {$settings[toggle.key]
            ? 'bg-[var(--color-accent)]'
            : 'bg-[var(--color-border)]'}"
        >
          <span
            class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all {$settings[
              toggle.key
            ]
              ? 'start-[1.125rem]'
              : 'start-0.5'}"
          ></span>
        </span>
      </button>
    {/each}
  </div>

  <div class="space-y-2">
    <div class="flex items-center justify-between text-sm">
      <span class="text-[var(--color-muted-foreground)]">{$t('aids.lineHeight')}</span>
      <span class="font-medium tabular-nums">{lineHeight.toFixed(2)}</span>
    </div>
    <Slider
      value={lineHeight}
      min={1.5}
      max={2.4}
      step={0.05}
      aria-label={$t('aids.lineHeight')}
      oninput={onLineHeightInput}
    />
  </div>

  <div class="space-y-2">
    <span class="text-sm text-[var(--color-muted-foreground)]">{$t('aids.contentWidth')}</span>
    <div class="grid grid-cols-3 gap-1.5">
      {#each widths as width (width)}
        <Button
          size="sm"
          variant={$settings.contentWidth === width ? 'default' : 'outline'}
          onclick={() => settings.patch({ contentWidth: width })}
        >
          {$t(`aids.width.${width}`)}
        </Button>
      {/each}
    </div>
  </div>

  <button
    type="button"
    class="w-full text-center text-[11px] text-[var(--color-muted-foreground)] underline-offset-4 hover:underline"
    onclick={() => {
      settings.reset()
      lineHeight = $settings.lineHeight
    }}
  >
    {$t('aids.reset')}
  </button>
</div>
