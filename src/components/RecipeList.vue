<script setup lang="ts">
import type { SavedRecipe } from '@/lib/types'
import { hostOf } from '@/lib/format'

defineProps<{
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
        class="font-mono text-xs text-ink/60 underline decoration-2 underline-offset-2 hover:text-tomato"
        @click="emit('clear')"
      >
        {{ clearLabel ?? 'Clear all' }}
      </button>
    </div>

    <ul class="flex flex-col gap-2">
      <li
        v-for="item in items"
        :key="item.recipe.sourceUrl"
        class="press flex items-center gap-3 rounded-card border-2 border-ink bg-paper px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-(--shadow-hard-sm)"
      >
        <button
          type="button"
          class="flex-1 text-left"
          @click="emit('open', item.recipe.sourceUrl)"
        >
          <span class="block truncate font-sans font-medium text-ink">
            {{ item.recipe.title }}
          </span>
          <span class="block font-mono text-xs text-ink/50">
            {{ hostOf(item.recipe.sourceUrl) }}
          </span>
        </button>
        <button
          type="button"
          :aria-label="`Remove ${item.recipe.title}`"
          class="shrink-0 rounded-sm border-2 border-ink px-2 py-0.5 font-mono text-xs hover:bg-tomato hover:text-paper"
          @click="emit('remove', item.recipe.sourceUrl)"
        >
          ✕
        </button>
      </li>
    </ul>
  </section>
</template>
