import type { Recipe } from './types'

/* Pure JSON-LD → Recipe normalization. Shared by the Cloudflare Pages
   Function and any client-side parsing. No DOM, no network. */

type Json = unknown
type JsonObject = Record<string, Json>

function isObject(v: Json): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asArray<T = Json>(v: Json): T[] {
  if (v == null) return []
  return (Array.isArray(v) ? v : [v]) as T[]
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  '#39': "'",
  '#x27': "'",
}

/** Strip HTML tags and decode common entities. JSON-LD text often carries
    both (no DOM available in the Worker, so this is done by hand). */
function clean(s: string): string {
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, code: string) => {
      const key = code.toLowerCase()
      if (key in NAMED_ENTITIES) return NAMED_ENTITIES[key]
      if (key.startsWith('#x')) {
        return String.fromCodePoint(parseInt(key.slice(2), 16))
      }
      if (key.startsWith('#')) {
        return String.fromCodePoint(parseInt(key.slice(1), 10))
      }
      return whole
    })
    .replace(/\s+/g, ' ')
    .trim()
}

/** schema.org @type can be a string or string[]; match case-insensitively. */
function typeMatches(node: JsonObject, target: string): boolean {
  return asArray<string>(node['@type']).some(
    (t) => typeof t === 'string' && t.toLowerCase() === target.toLowerCase(),
  )
}

/** Walk arbitrary JSON-LD (object, array, or { @graph }) for the first Recipe. */
export function findRecipeNode(data: Json): JsonObject | null {
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeNode(item)
      if (found) return found
    }
  } else if (isObject(data)) {
    if (typeMatches(data, 'Recipe')) return data
    if (data['@graph']) return findRecipeNode(data['@graph'])
  }
  return null
}

/** Pull display text from a value that may be a string or a typed node. */
function textOf(v: Json): string | undefined {
  if (typeof v === 'string') return clean(v) || undefined
  if (isObject(v)) {
    const t = v.text ?? v.name
    if (typeof t === 'string') return clean(t) || undefined
  }
  return undefined
}

function firstImage(v: Json): string | undefined {
  for (const item of asArray(v)) {
    if (typeof item === 'string') return item
    if (isObject(item) && typeof item.url === 'string') return item.url
  }
  return undefined
}

/** Flatten recipeInstructions: strings, HowToStep, and HowToSection. */
function instructionList(v: Json): string[] {
  const out: string[] = []
  for (const item of asArray(v)) {
    if (typeof item === 'string') {
      const s = clean(item)
      if (s) out.push(s)
    } else if (isObject(item)) {
      if (typeMatches(item, 'HowToSection') && item.itemListElement) {
        out.push(...instructionList(item.itemListElement))
      } else {
        const t = textOf(item)
        if (t) out.push(t)
      }
    }
  }
  return out
}

function ingredientList(v: Json): string[] {
  return asArray(v)
    .map((i) => (typeof i === 'string' ? clean(i) : ''))
    .filter(Boolean)
}

export function normalizeRecipe(node: JsonObject, sourceUrl: string): Recipe {
  return {
    title: textOf(node.name) ?? 'Untitled recipe',
    image: firstImage(node.image),
    sourceUrl,
    yield: textOf(asArray(node.recipeYield)[0]) ?? textOf(node.recipeYield),
    prepTime: typeof node.prepTime === 'string' ? node.prepTime : undefined,
    cookTime: typeof node.cookTime === 'string' ? node.cookTime : undefined,
    totalTime: typeof node.totalTime === 'string' ? node.totalTime : undefined,
    ingredients: ingredientList(node.recipeIngredient),
    instructions: instructionList(node.recipeInstructions),
  }
}

/** Parse a raw JSON-LD string and normalize the first Recipe found. */
export function recipeFromJsonLd(
  raw: string,
  sourceUrl: string,
): Recipe | null {
  let data: Json
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  const node = findRecipeNode(data)
  return node ? normalizeRecipe(node, sourceUrl) : null
}
