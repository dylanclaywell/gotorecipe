<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import UrlInput from '@/components/UrlInput.vue'
import RecipeList from '@/components/RecipeList.vue'
import { useRecipeStore } from '@/stores/recipes'

const router = useRouter()
const store = useRecipeStore()
const { history, saved } = storeToRefs(store)

function go(url: string) {
  router.push({ name: 'recipe', query: { url } })
}
</script>

<template>
  <section class="flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <h1
        class="font-display text-4xl leading-[1.15] tracking-tight text-ink sm:text-6xl"
      >
        Skip the story.<br />
        <span class="box-decoration-clone bg-primary px-2 text-on-primary">
          Get the recipe.
        </span>
      </h1>
      <p class="max-w-xl font-sans text-lg text-ink/70">
        Paste any recipe link. GoToRecipe strips the ads, pop-ups, and
        1,200-word backstory, then hands you the ingredients and steps.
      </p>
    </div>

    <UrlInput autofocus @submit="go" />

    <ul
      class="flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-wide text-ink/70"
    >
      <li>→ No account</li>
      <li>→ No tracking</li>
      <li>→ Installable app</li>
    </ul>

    <RecipeList
      v-if="saved.length"
      title="Saved"
      icon="★"
      clear-label="Clear saved"
      :items="saved"
      class="mt-4"
      @open="go"
      @remove="store.unsave"
      @clear="store.clearSaved()"
    />

    <RecipeList
      v-if="history.length"
      title="Recent"
      icon="🕘"
      :items="history"
      @open="go"
      @remove="store.forget"
      @clear="store.clearHistory()"
    />
  </section>
</template>
