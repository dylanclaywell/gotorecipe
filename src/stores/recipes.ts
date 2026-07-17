import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Recipe, SavedRecipe } from '@/lib/types'
import { extractRecipe } from '@/lib/api'

const HISTORY_KEY = 'gotorecipe:history'
const HISTORY_MAX = 25

type Status = 'idle' | 'loading' | 'ready' | 'error'

function loadHistory(): SavedRecipe[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as SavedRecipe[]) : []
  } catch {
    return []
  }
}

function persist(history: SavedRecipe[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // Storage full or unavailable — history is a nicety, not required.
  }
}

export const useRecipeStore = defineStore('recipes', () => {
  const current = ref<Recipe | null>(null)
  const status = ref<Status>('idle')
  const error = ref<string | null>(null)
  const history = ref<SavedRecipe[]>(loadHistory())

  async function load(url: string): Promise<void> {
    status.value = 'loading'
    error.value = null
    current.value = null

    const result = await extractRecipe(url)
    if (result.ok) {
      current.value = result.recipe
      status.value = 'ready'
      remember(result.recipe)
    } else {
      error.value = result.error
      status.value = 'error'
    }
  }

  function remember(recipe: Recipe): void {
    const deduped = history.value.filter(
      (h) => h.recipe.sourceUrl !== recipe.sourceUrl,
    )
    deduped.unshift({ recipe, savedAt: Date.now() })
    history.value = deduped.slice(0, HISTORY_MAX)
    persist(history.value)
  }

  function forget(sourceUrl: string): void {
    history.value = history.value.filter(
      (h) => h.recipe.sourceUrl !== sourceUrl,
    )
    persist(history.value)
  }

  function clearHistory(): void {
    history.value = []
    persist(history.value)
  }

  return {
    current,
    status,
    error,
    history,
    load,
    forget,
    clearHistory,
  }
})
