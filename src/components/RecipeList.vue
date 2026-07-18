<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SavedRecipe } from '@/lib/types'
import { hostOf } from '@/lib/format'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const props = defineProps<{
  title: string
  items: SavedRecipe[]
  icon?: string
  clearLabel?: string
}>()

const emit = defineEmits<{
  open: [url: string]
  remove: [url: string]
  clear: []
}>()

// A pending destructive action awaiting confirmation.
type Pending = { type: 'remove'; url: string } | { type: 'clear' }
const pending = ref<Pending | null>(null)

const confirmMessage = computed(() => {
  const p = pending.value
  if (!p) return ''
  if (p.type === 'clear') {
    return `Clear all ${props.title.toLowerCase()} recipes? This can't be undone.`
  }
  const match = props.items.find((i) => i.recipe.sourceUrl === p.url)
  return `Remove “${match?.recipe.title ?? 'this recipe'}”?`
})

const confirmLabel = computed(() =>
  pending.value?.type === 'clear' ? 'Clear' : 'Remove',
)

function onConfirm() {
  const p = pending.value
  pending.value = null
  if (!p) return
  if (p.type === 'clear') emit('clear')
  else emit('remove', p.url)
}
</script>

<template>
  <section class="flex flex-col gap-3">
    <div
      class="flex items-baseline justify-between border-b-2 border-ink pb-1.5"
    >
      <h2 class="font-display text-sm uppercase tracking-wide">
        <span v-if="icon" aria-hidden="true">{{ icon }}</span>
        {{ title }}
      </h2>
      <button
        v-if="items.length"
        type="button"
        class="font-mono text-xs text-ink/70 underline decoration-2 underline-offset-2 hover:text-danger"
        @click="pending = { type: 'clear' }"
      >
        {{ clearLabel ?? 'Clear all' }}
      </button>
    </div>

    <ul class="flex flex-col gap-2">
      <li
        v-for="item in items"
        :key="item.recipe.sourceUrl"
        class="flex items-center gap-3 rounded-card border-2 border-ink bg-paper px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-(--shadow-hard-sm)"
      >
        <button
          type="button"
          class="flex-1 text-left"
          @click="emit('open', item.recipe.sourceUrl)"
        >
          <span class="block truncate font-sans font-medium text-ink">
            {{ item.recipe.title }}
          </span>
          <span class="block font-mono text-xs text-ink/70">
            {{ hostOf(item.recipe.sourceUrl) }}
          </span>
        </button>
        <button
          type="button"
          :aria-label="`Remove ${item.recipe.title}`"
          class="shrink-0 rounded-sm border-2 border-ink px-2 py-0.5 font-mono text-xs hover:bg-danger hover:text-on-primary"
          @click="pending = { type: 'remove', url: item.recipe.sourceUrl }"
        >
          ✕
        </button>
      </li>
    </ul>

    <ConfirmDialog
      :open="pending !== null"
      :message="confirmMessage"
      :confirm-label="confirmLabel"
      @confirm="onConfirm"
      @cancel="pending = null"
    />
  </section>
</template>
