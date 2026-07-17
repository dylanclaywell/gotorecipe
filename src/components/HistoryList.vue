<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { hostOf } from '@/lib/format'
import { useRecipeStore } from '@/stores/recipes'

const emit = defineEmits<{ open: [url: string] }>()

const store = useRecipeStore()
const { history } = storeToRefs(store)
</script>

<template>
  <section aria-labelledby="recent-heading" class="flex flex-col gap-3">
    <div
      class="flex items-baseline justify-between border-b-2 border-ink pb-1.5"
    >
      <h2
        id="recent-heading"
        class="font-display text-sm uppercase tracking-wide"
      >
        Recently decluttered
      </h2>
      <button
        v-if="history.length"
        type="button"
        class="font-mono text-xs text-ink/60 underline decoration-2 underline-offset-2 hover:text-tomato"
        @click="store.clearHistory()"
      >
        Clear all
      </button>
    </div>

    <ul class="flex flex-col gap-2">
      <li
        v-for="item in history"
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
          :aria-label="`Remove ${item.recipe.title} from history`"
          class="shrink-0 rounded-sm border-2 border-ink px-2 py-0.5 font-mono text-xs hover:bg-tomato hover:text-paper"
          @click="store.forget(item.recipe.sourceUrl)"
        >
          ✕
        </button>
      </li>
    </ul>
  </section>
</template>
