import type { ExtractResult } from './types'

/** Call the Cloudflare Pages Function that fetches + parses a recipe URL. */
export async function extractRecipe(url: string): Promise<ExtractResult> {
  const endpoint = `/api/extract?url=${encodeURIComponent(url)}`
  try {
    const res = await fetch(endpoint)
    const body = (await res.json()) as ExtractResult
    return body
  } catch {
    return {
      ok: false,
      error: 'Network error. Check your connection and retry.',
    }
  }
}
