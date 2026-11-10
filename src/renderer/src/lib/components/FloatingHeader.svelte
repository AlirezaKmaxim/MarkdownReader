<script lang="ts">
  import FileText from 'lucide-svelte/icons/file-text'
  import Focus from 'lucide-svelte/icons/focus'
  import Palette from 'lucide-svelte/icons/palette'
  import Glasses from 'lucide-svelte/icons/glasses'
  import Type from 'lucide-svelte/icons/type'
  import Button from '$lib/components/ui/button.svelte'
  import Popover from '$lib/components/ui/popover.svelte'
  import FontPopover from '$lib/components/FontPopover.svelte'
  import ThemePopover from '$lib/components/ThemePopover.svelte'
  import ReadingAidsPopover from '$lib/components/ReadingAidsPopover.svelte'

  let {
    onOpenFile,
    onToggleFocus
  }: {
    onOpenFile: () => void
    onToggleFocus: () => void
  } = $props()

  let fontOpen = $state(false)
  let themeOpen = $state(false)
  let aidsOpen = $state(false)
</script>

<header
  class="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
  dir="rtl"
>
  <div
    class="pointer-events-auto flex items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-1.5 shadow-lg backdrop-blur-md"
  >
    <Button
      variant="ghost"
      onclick={onOpenFile}
      aria-label="باز کردن فایل"
      title="باز کردن فایل (Ctrl+O)"
    >
      <FileText class="h-4 w-4" />
      <span>باز کردن فایل</span>
    </Button>

    <div class="mx-1 h-5 w-px bg-[var(--color-border)]"></div>

    <Popover bind:open={fontOpen}>
      {#snippet trigger()}
        <Button variant="ghost" size="icon" aria-label="تنظیمات فونت" title="تنظیمات فونت">
          <Type class="h-4 w-4" />
        </Button>
      {/snippet}
      {#snippet content()}
        <FontPopover />
      {/snippet}
    </Popover>

    <Popover bind:open={themeOpen}>
      {#snippet trigger()}
        <Button variant="ghost" size="icon" aria-label="انتخاب تم" title="انتخاب تم (T)">
          <Palette class="h-4 w-4" />
        </Button>
      {/snippet}
      {#snippet content()}
        <ThemePopover />
      {/snippet}
    </Popover>

    <Popover bind:open={aidsOpen}>
      {#snippet trigger()}
        <Button
          variant="ghost"
          size="icon"
          aria-label="ابزارهای تمرکز"
          title="ابزارهای تمرکز و خوانایی"
        >
          <Glasses class="h-4 w-4" />
        </Button>
      {/snippet}
      {#snippet content()}
        <ReadingAidsPopover />
      {/snippet}
    </Popover>

    <Button
      variant="ghost"
      size="icon"
      aria-label="حالت تمرکز"
      title="حالت تمرکز (F11)"
      onclick={onToggleFocus}
    >
      <Focus class="h-4 w-4" />
    </Button>
  </div>
</header>
