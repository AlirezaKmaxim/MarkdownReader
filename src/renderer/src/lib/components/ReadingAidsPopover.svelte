<script lang="ts">
  import Sparkles from 'lucide-svelte/icons/sparkles'
  import { settings, type ContentWidth } from '$lib/stores/settings'
  import Slider from '$lib/components/ui/slider.svelte'
  import Button from '$lib/components/ui/button.svelte'

  type ToggleKey = 'ruler' | 'spotlight' | 'bionic' | 'wordSpacing'

  const toggles: { key: ToggleKey; label: string; hint: string; shortcut?: string }[] = [
    { key: 'ruler', label: 'خط‌کش خواندن', hint: 'نواری که همراه ماوس حرکت می‌کند', shortcut: 'R' },
    {
      key: 'spotlight',
      label: 'تمرکز روی پاراگراف',
      hint: 'بقیه متن کم‌رنگ می‌شود؛ با ↑↓ جابه‌جا شوید',
      shortcut: 'P'
    },
    { key: 'bionic', label: 'خوانش بیونیک', hint: 'پررنگ کردن ابتدای کلمات لاتین', shortcut: 'B' },
    { key: 'wordSpacing', label: 'فاصله بیشتر کلمات', hint: 'جدا کردن واضح‌تر کلمات' }
  ]

  const widths: { value: ContentWidth; label: string }[] = [
    { value: 'narrow', label: 'باریک' },
    { value: 'medium', label: 'متوسط' },
    { value: 'wide', label: 'عریض' }
  ]

  let lineHeight = $state($settings.lineHeight)

  function onLineHeightInput(event: Event): void {
    lineHeight = Number((event.currentTarget as HTMLInputElement).value)
    settings.setLineHeight(lineHeight)
  }
</script>

<div class="w-72 space-y-4" dir="rtl">
  <Button class="w-full" onclick={() => settings.applyAdhdPreset()}>
    <Sparkles class="h-4 w-4" />
    <span>حالت تمرکز ADHD</span>
  </Button>
  <p class="-mt-2 text-[11px] leading-5 text-[var(--color-muted-foreground)]">
    تم زمردی، خطوط کوتاه، فاصله بیشتر و خط‌کش خواندن — یکجا.
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
            {toggle.label}
            {#if toggle.shortcut}
              <kbd class="rounded border border-[var(--color-border)] px-1 text-[10px]"
                >{toggle.shortcut}</kbd
              >
            {/if}
          </span>
          <span class="block text-[11px] text-[var(--color-muted-foreground)]">{toggle.hint}</span>
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
      <span class="text-[var(--color-muted-foreground)]">فاصله خطوط</span>
      <span class="font-medium tabular-nums">{lineHeight.toFixed(2)}</span>
    </div>
    <Slider
      value={lineHeight}
      min={1.5}
      max={2.4}
      step={0.05}
      aria-label="فاصله خطوط"
      oninput={onLineHeightInput}
    />
  </div>

  <div class="space-y-2">
    <span class="text-sm text-[var(--color-muted-foreground)]">عرض متن</span>
    <div class="grid grid-cols-3 gap-1.5">
      {#each widths as width (width.value)}
        <Button
          size="sm"
          variant={$settings.contentWidth === width.value ? 'default' : 'outline'}
          onclick={() => settings.patch({ contentWidth: width.value })}
        >
          {width.label}
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
    بازگشت به تنظیمات پیش‌فرض
  </button>
</div>
