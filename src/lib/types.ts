export interface Recipe {
  title: string
  description?: string
  image?: string
  author?: string
  sourceUrl: string
  yield?: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
  ingredients: string[]
  instructions: string[]
}

export interface ExtractSuccess {
  ok: true
  recipe: Recipe
}

export interface ExtractError {
  ok: false
  error: string
}

export type ExtractResult = ExtractSuccess | ExtractError

/** A recipe saved to local history (no account, localStorage only). */
export interface SavedRecipe {
  recipe: Recipe
  savedAt: number
}
