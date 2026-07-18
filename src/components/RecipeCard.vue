<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Recipe } from '@/lib/types'
import { formatDuration, hostOf } from '@/lib/format'
import { useRecipeStore } from '@/stores/recipes'

const props = defineProps<{ recipe: Recipe }>()

const store = useRecipeStore()

// Cooking helper: tap an ingredient or step to cross it off. Purely local.
function useChecklist() {
  const done = ref<Set<number>>(new Set())
  function toggle(i: number) {
    const next = new Set(done.value)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    done.value = next
  }
  return reactive({ done, toggle })
}
const ingredients = useChecklist()
const steps = useChecklist()

const meta = [
  { label: 'Prep', value: formatDuration(props.recipe.prepTime) },
  { label: 'Cook', value: formatDuration(props.recipe.cookTime) },
  { label: 'Total', value: formatDuration(props.recipe.totalTime) },
  { label: 'Serves', value: props.recipe.yield },
].filter((m) => m.value)

function print() {
  window.print()
}
</script>

<template>
  <article class="recipe card-hard shadow-(--shadow-hard-lg)">
    <!-- Header -->
    <header
      class="flex flex-col gap-3 border-b-2 border-ink bg-primary p-6 sm:flex-row sm:items-start sm:justify-between"
    >
      <div class="flex flex-col gap-1.5">
        <h1
          class="font-display text-3xl leading-tight tracking-tight text-on-primary sm:text-4xl"
        >
          {{ recipe.title }}
        </h1>
        <a
          :href="recipe.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-fit font-mono text-sm text-on-primary/75 underline decoration-2 underline-offset-2 hover:text-on-primary"
        >
          {{ hostOf(recipe.sourceUrl) }} ↗
        </a>
      </div>
      <div class="no-print flex shrink-0 gap-2">
        <button
          type="button"
          :aria-pressed="store.isSaved(recipe.sourceUrl)"
          :class="
            store.isSaved(recipe.sourceUrl)
              ? 'bg-accent hover:bg-accent-hover text-on-accent'
              : 'bg-paper hover:bg-paper-hover text-ink'
          "
          class="focus-ring rounded-md border-2 border-ink px-4 py-2 font-display text-sm tracking-tight shadow-(--shadow-hard) active:translate-y-1 active:translate-x-1 active:shadow-none"
          @click="store.toggleSave(recipe)"
        >
          {{ store.isSaved(recipe.sourceUrl) ? '★ Saved' : '☆ Save' }}
        </button>
        <button
          type="button"
          class="focus-ring rounded-md border-2 border-ink bg-paper hover:bg-paper-hover px-4 py-2 font-display text-sm tracking-tight text-ink shadow-(--shadow-hard) active:translate-y-1 active:translate-x-1 active:shadow-none"
          @click="print"
        >
          Print
        </button>
      </div>
    </header>

    <!-- Dish photo -->
    <img
      v-if="recipe.image"
      :src="recipe.image"
      :alt="recipe.title"
      loading="lazy"
      class="recipe-photo aspect-video w-full border-b-2 border-ink object-cover"
    />

    <!-- Meta strip -->
    <dl
      v-if="meta.length"
      class="flex flex-wrap gap-x-8 gap-y-3 border-b-2 border-ink px-6 py-4"
    >
      <div v-for="m in meta" :key="m.label" class="flex flex-col">
        <dt
          class="font-mono text-[0.68rem] uppercase tracking-widest text-ink/50"
        >
          {{ m.label }}
        </dt>
        <dd class="font-mono text-base font-bold text-ink">{{ m.value }}</dd>
      </div>
    </dl>

    <div class="recipe-body grid gap-8 p-6 sm:grid-cols-[minmax(0,1fr)_1.4fr]">
      <!-- Ingredients -->
      <section aria-labelledby="ing-heading" class="flex flex-col gap-3">
        <h2
          id="ing-heading"
          class="font-display text-lg uppercase tracking-wide text-ink"
        >
          Ingredients
        </h2>
        <ul class="flex flex-col">
          <li
            v-for="(item, i) in recipe.ingredients"
            :key="i"
            class="border-b border-dashed border-ink/25 last:border-0"
          >
            <button
              type="button"
              class="flex w-full items-start gap-2.5 py-2 text-left"
              :aria-pressed="ingredients.done.has(i)"
              @click="ingredients.toggle(i)"
            >
              <span
                class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border-2 border-ink text-[0.6rem] leading-none"
                :class="
                  ingredients.done.has(i)
                    ? 'bg-accent text-on-accent'
                    : 'bg-paper'
                "
                aria-hidden="true"
              >
                {{ ingredients.done.has(i) ? '✓' : '' }}
              </span>
              <span
                class="font-mono text-sm leading-snug"
                :class="
                  ingredients.done.has(i)
                    ? 'text-ink/40 line-through'
                    : 'text-ink'
                "
              >
                {{ item }}
              </span>
            </button>
          </li>
        </ul>
      </section>

      <!-- Steps -->
      <section aria-labelledby="steps-heading" class="flex flex-col gap-3">
        <h2
          id="steps-heading"
          class="font-display text-lg uppercase tracking-wide text-ink"
        >
          Steps
        </h2>
        <ol class="flex flex-col gap-4">
          <li v-for="(step, i) in recipe.instructions" :key="i">
            <button
              type="button"
              class="flex w-full gap-3.5 text-left"
              :aria-pressed="steps.done.has(i)"
              @click="steps.toggle(i)"
            >
              <span
                class="grid h-8 w-8 shrink-0 place-items-center rounded-md border-2 border-ink font-display text-sm text-on-primary shadow-[var(--shadow-hard-sm)]"
                :class="steps.done.has(i) ? 'bg-accent' : 'bg-primary'"
                aria-hidden="true"
              >
                {{ steps.done.has(i) ? '✓' : i + 1 }}
              </span>
              <p
                class="pt-0.5 font-sans leading-relaxed"
                :class="
                  steps.done.has(i) ? 'text-ink/40 line-through' : 'text-ink'
                "
              >
                {{ step }}
              </p>
            </button>
          </li>
        </ol>
      </section>
    </div>
  </article>
</template>

<style scoped>
@media print {
  /* Flatten the card: no shadow, thin border, no ink-heavy fills. */
  .recipe {
    box-shadow: none;
    border: 1.5px solid #000;
  }
  .recipe header {
    background: transparent !important;
  }
  /* Focused printout — drop the photo. */
  .recipe-photo {
    display: none;
  }
  /* Stack ingredients + steps into one column that paginates cleanly. */
  .recipe-body {
    display: block !important;
  }
  .recipe-body section:first-child {
    margin-bottom: 1.5rem;
  }
  /* Keep a heading with its list, and never split an item across pages. */
  h2 {
    break-after: avoid;
  }
  li {
    break-inside: avoid;
  }
}
</style>
