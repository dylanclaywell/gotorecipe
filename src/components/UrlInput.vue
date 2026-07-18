<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{ autofocus?: boolean }>(), { autofocus: false })

const emit = defineEmits<{ submit: [url: string] }>()

const url = ref('')
const input = ref<HTMLInputElement | null>(null)

function onSubmit() {
  const trimmed = url.value.trim()
  if (trimmed) emit('submit', trimmed)
}

async function paste() {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      url.value = text.trim()
      input.value?.focus()
    }
  } catch {
    // Clipboard blocked — user can paste manually.
    input.value?.focus()
  }
}
</script>

<template>
  <form
    class="flex flex-col gap-3 sm:flex-row sm:items-start"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="relative flex-1">
      <input
        ref="input"
        v-model="url"
        type="url"
        inputmode="url"
        :autofocus="autofocus"
        placeholder="Paste a recipe link…"
        aria-label="Recipe URL"
        class="focus-ring h-16 w-full rounded-card border-2 border-ink bg-paper pl-4 pr-24 font-mono text-base text-ink placeholder:text-ink/40"
      />
      <button
        type="button"
        class="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border-2 border-ink bg-muted px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide hover:-translate-y-[calc(50%+2px)] hover:shadow-(--shadow-hard-sm) active:-translate-y-1/2 active:shadow-none"
        @click="paste"
      >
        Paste
      </button>
    </div>

    <button
      type="submit"
      class="focus-ring flex items-center justify-center gap-2 rounded-md border-2 border-ink bg-primary hover:bg-primary-hover px-6 py-3.5 font-display text-lg tracking-tight text-on-primary shadow-(--shadow-hard) active:translate-y-1 active:translate-x-1 active:shadow-none"
    >
      Go
    </button>
  </form>
</template>
