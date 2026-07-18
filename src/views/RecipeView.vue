<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import RecipeCard from '@/components/RecipeCard.vue'
import LoadingCard from '@/components/LoadingCard.vue'
import { useRecipeStore } from '@/stores/recipes'
import { hostOf } from '@/lib/format'

const route = useRoute()
const router = useRouter()
const store = useRecipeStore()
const { current, status, error } = storeToRefs(store)

const url = computed(() => String(route.query.url ?? ''))

watch(
  url,
  (next) => {
    if (next) store.load(next)
    else router.replace({ name: 'home' })
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <RouterLink
      to="/"
      class="no-print press inline-flex w-fit items-center gap-1.5 font-mono text-sm text-ink/70 hover:-translate-x-0.5 hover:text-ink"
    >
      ← New recipe
    </RouterLink>

    <LoadingCard v-if="status === 'loading'" :host="hostOf(url)" />

    <div
      v-else-if="status === 'error'"
      class="card-hard flex flex-col gap-4 p-6"
      role="alert"
    >
      <h2 class="font-display text-2xl tracking-tight text-danger">
        No recipe here
      </h2>
      <p class="font-sans text-ink/70">{{ error }}</p>
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="focus-ring rounded-md border-2 border-ink bg-primary px-4 py-2 font-display tracking-tight text-on-primary shadow-[var(--shadow-hard-sm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hard)] active:translate-y-0 active:shadow-[var(--shadow-hard-sm)]"
          @click="store.load(url)"
        >
          Try again
        </button>
        <a
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="focus-ring rounded-md border-2 border-ink bg-paper px-4 py-2 font-display tracking-tight shadow-[var(--shadow-hard-sm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hard)] active:translate-y-0 active:shadow-[var(--shadow-hard-sm)]"
        >
          Open original ↗
        </a>
      </div>
    </div>

    <RecipeCard v-else-if="status === 'ready' && current" :recipe="current" />
  </div>
</template>
