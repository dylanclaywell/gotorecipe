import { defineStore } from 'pinia'
import { ref } from 'vue'
import localforage from 'localforage'
import type { Recipe, SavedRecipe } from '@/lib/types'
import { extractRecipe } from '@/lib/api'

const HISTORY_KEY = 'history'
const SAVED_KEY = 'saved'
const HISTORY_MAX = 25

type Status = 'idle' | 'loading' | 'ready' | 'error'

// IndexedDB-backed store (localForage falls back to WebSQL/localStorage).
// Roomier than localStorage, so history/saved can grow freely.
const db = localforage.createInstance({
  name: 'gotorecipe',
  storeName: 'recipes',
  description: 'Recent and saved recipes',
})

async function loadList(key: string): Promise<SavedRecipe[]> {
  try {
    return (await db.getItem<SavedRecipe[]>(key)) ?? []
  } catch {
    return []
  }
}

function persist(key: string, list: SavedRecipe[]): void {
  // Snapshot to plain objects — IndexedDB's structured clone chokes on Vue's
  // reactive proxies. These lists are a nicety, so swallow write failures.
  const plain = JSON.parse(JSON.stringify(list)) as SavedRecipe[]
  void db.setItem(key, plain).catch(() => {})
}

export const useRecipeStore = defineStore('recipes', () => {
  const current = ref<Recipe | null>(null)
  const status = ref<Status>('idle')
  const error = ref<string | null>(null)

  // Recent: auto-recorded, capped, decays. Saved: curated, kept until removed.
  const history = ref<SavedRecipe[]>([])
  const saved = ref<SavedRecipe[]>([])

  // Reads are async, so hydrate after creation rather than seeding inline.
  // The IndexedDB read resolves long before any write (which needs a fetch).
  void loadList(HISTORY_KEY).then((list) => {
    history.value = list
  })
  void loadList(SAVED_KEY).then((list) => {
    saved.value = list
  })

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
    persist(HISTORY_KEY, history.value)
  }

  function forget(sourceUrl: string): void {
    history.value = history.value.filter(
      (h) => h.recipe.sourceUrl !== sourceUrl,
    )
    persist(HISTORY_KEY, history.value)
  }

  function clearHistory(): void {
    history.value = []
    persist(HISTORY_KEY, history.value)
  }

  // ── Saved (the curated cookbook) ──────────────────────────────────────
  function isSaved(sourceUrl: string): boolean {
    return saved.value.some((s) => s.recipe.sourceUrl === sourceUrl)
  }

  function save(recipe: Recipe): void {
    if (isSaved(recipe.sourceUrl)) return
    saved.value = [{ recipe, savedAt: Date.now() }, ...saved.value]
    persist(SAVED_KEY, saved.value)
  }

  function unsave(sourceUrl: string): void {
    saved.value = saved.value.filter((s) => s.recipe.sourceUrl !== sourceUrl)
    persist(SAVED_KEY, saved.value)
  }

  function toggleSave(recipe: Recipe): void {
    if (isSaved(recipe.sourceUrl)) unsave(recipe.sourceUrl)
    else save(recipe)
  }

  function clearSaved(): void {
    saved.value = []
    persist(SAVED_KEY, saved.value)
  }

  return {
    current,
    status,
    error,
    history,
    saved,
    load,
    forget,
    clearHistory,
    isSaved,
    save,
    unsave,
    toggleSave,
    clearSaved,
  }
})
