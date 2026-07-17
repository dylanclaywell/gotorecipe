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
    class="flex flex-col gap-3 sm:flex-row"
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
        class="card-hard w-full py-3.5 pl-4 pr-24 font-mono text-base text-ink placeholder:text-ink/40 focus:shadow-[var(--shadow-hard-lg)] focus:outline-none"
      />
      <button
        type="button"
        class="press absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border-2 border-ink bg-smoke px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide hover:-translate-y-[calc(50%+2px)] hover:shadow-[var(--shadow-hard-sm)] active:-translate-y-1/2 active:shadow-none"
        @click="paste"
      >
        Paste
      </button>
    </div>

    <button
      type="submit"
      class="press flex items-center justify-center gap-2 rounded-md border-2 border-ink bg-yolk px-6 py-3.5 font-display text-lg tracking-tight text-ink shadow-[var(--shadow-hard)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hard-lg)] active:translate-y-0 active:shadow-[var(--shadow-hard-sm)]"
    >
      Go
    </button>
  </form>
</template>
