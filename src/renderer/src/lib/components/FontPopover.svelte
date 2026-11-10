<script lang="ts">
  import { settings, type FontWeight } from '$lib/stores/settings'
  import Slider from '$lib/components/ui/slider.svelte'
  import Button from '$lib/components/ui/button.svelte'
  import { cn } from '$lib/utils'

  const weights: { value: FontWeight; label: string }[] = [
    { value: 300, label: 'سبک' },
    { value: 400, label: 'معمولی' },
    { value: 500, label: 'متوسط' },
    { value: 700, label: 'ضخیم' }
  ]

  let fontSize = $state($settings.fontSize)

  function onSliderInput(event: Event): void {
    const value = Number((event.currentTarget as HTMLInputElement).value)
    fontSize = value
    settings.setFontSize(value)
  }
</script>

<div class="space-y-4" dir="rtl">
  <div class="space-y-2">
    <div class="flex items-center justify-between text-sm">
      <span class="text-[var(--color-muted-foreground)]">سایز فونت</span>
      <span class="font-medium tabular-nums">{fontSize}px</span>
    </div>
    <Slider
      value={fontSize}
      min={14}
      max={24}
      step={1}
      aria-label="سایز فونت"
      oninput={onSliderInput}
    />
  </div>

  <div class="space-y-2">
    <span class="text-sm text-[var(--color-muted-foreground)]">وزن فونت</span>
    <div class="grid grid-cols-4 gap-1.5">
      {#each weights as weight (weight.value)}
        <Button
          size="sm"
          variant={$settings.fontWeight === weight.value ? 'default' : 'outline'}
          class={cn('px-1')}
          onclick={() => settings.setFontWeight(weight.value)}
        >
          {weight.label}
        </Button>
      {/each}
    </div>
  </div>
</div>
