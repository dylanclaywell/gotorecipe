<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    message: string
    confirmLabel?: string
  }>(),
  { confirmLabel: 'Delete' },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)

// Drive the native <dialog> imperatively from the `open` prop.
watch(
  () => props.open,
  (isOpen) => {
    const el = dialog.value
    if (!el) return
    if (isOpen && !el.open) el.showModal()
    else if (!isOpen && el.open) el.close()
  },
)

// Treat Esc and backdrop clicks as cancel.
function onCancelEvent(e: Event) {
  e.preventDefault()
  emit('cancel')
}
function onBackdropClick(e: MouseEvent) {
  if (e.target === dialog.value) emit('cancel')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="confirm card-hard m-auto p-6"
    @cancel="onCancelEvent"
    @click="onBackdropClick"
  >
    <p class="font-sans text-lg text-ink">{{ message }}</p>
    <div class="mt-5 flex justify-end gap-3">
      <button
        type="button"
        class="press rounded-md border-2 border-ink bg-paper px-4 py-2 font-display text-sm tracking-tight text-ink shadow-[var(--shadow-hard-sm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hard)]"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="button"
        class="press rounded-md border-2 border-ink bg-tomato px-4 py-2 font-display text-sm tracking-tight text-paper shadow-[var(--shadow-hard-sm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hard)]"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.confirm {
  width: min(24rem, calc(100vw - 2rem));
}
.confirm::backdrop {
  background: rgb(26 23 18 / 0.55); /* --color-ink, translucent */
}
</style>
