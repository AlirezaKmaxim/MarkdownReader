<script lang="ts">
  import { settings, t, type FontWeight } from '$lib/stores/settings'
  import Slider from '$lib/components/ui/slider.svelte'
  import Button from '$lib/components/ui/button.svelte'
  import { cn } from '$lib/utils'

  const weights: FontWeight[] = [300, 400, 500, 700]

  let fontSize = $state($settings.fontSize)

  function onSliderInput(event: Event): void {
    const value = Number((event.currentTarget as HTMLInputElement).value)
    fontSize = value
    settings.setFontSize(value)
  }
</script>

<div class="space-y-4">
  <div class="space-y-2">
    <div class="flex items-center justify-between text-sm">
      <span class="text-[var(--color-muted-foreground)]">{$t('font.size')}</span>
      <span class="font-medium tabular-nums">{fontSize}px</span>
    </div>
    <Slider
      value={fontSize}
      min={14}
      max={24}
      step={1}
      aria-label={$t('font.size')}
      oninput={onSliderInput}
    />
  </div>

  <div class="space-y-2">
    <span class="text-sm text-[var(--color-muted-foreground)]">{$t('font.weight')}</span>
    <div class="grid grid-cols-4 gap-1.5">
      {#each weights as weight (weight)}
        <Button
          size="sm"
          variant={$settings.fontWeight === weight ? 'default' : 'outline'}
          class={cn('px-1')}
          onclick={() => settings.setFontWeight(weight)}
        >
          {$t(`font.weight.${weight}`)}
        </Button>
      {/each}
    </div>
  </div>
</div>
