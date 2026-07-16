import { recipeFromJsonLd } from '../../src/lib/jsonld'
import type { ExtractResult } from '../../src/lib/types'

/* Cloudflare Pages Function: GET /api/extract?url=<recipe page url>
   Fetches the page server-side (avoids browser CORS), extracts the
   schema.org Recipe from its JSON-LD, and returns clean JSON. */

const FETCH_TIMEOUT_MS = 8000
const MAX_BYTES = 3_000_000 // don't ingest huge pages

function json(body: ExtractResult, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Same-origin app; cache successful extractions at the edge briefly.
      'cache-control': body.ok ? 'public, max-age=3600' : 'no-store',
    },
  })
}

function validTarget(raw: string | null): URL | null {
  if (!raw) return null
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  // Block obvious SSRF targets (localhost / private ranges).
  const host = u.hostname
  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return null
  }
  return u
}

/** Collect the bodies of every <script type="application/ld+json">. */
async function collectJsonLd(res: Response): Promise<string[]> {
  const scripts: string[] = []
  let buffer = ''

  const rewriter = new HTMLRewriter().on('script[type="application/ld+json"]', {
    text(chunk) {
      buffer += chunk.text
      if (chunk.lastInTextNode) {
        scripts.push(buffer)
        buffer = ''
      }
    },
  })

  // Cap bytes read so a pathological page can't exhaust the worker.
  const limited = new Response(
    res.body?.pipeThrough(byteLimiter(MAX_BYTES)) ?? null,
  )
  await rewriter.transform(limited).arrayBuffer()
  return scripts
}

function byteLimiter(max: number): TransformStream<Uint8Array, Uint8Array> {
  let total = 0
  return new TransformStream({
    transform(chunk, controller) {
      total += chunk.byteLength
      if (total > max) {
        controller.terminate()
        return
      }
      controller.enqueue(chunk)
    },
  })
}

export const onRequestGet: PagesFunction = async (context) => {
  const target = validTarget(
    new URL(context.request.url).searchParams.get('url'),
  )
  if (!target) {
    return json(
      { ok: false, error: 'Provide a valid http(s) recipe URL.' },
      400,
    )
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let page: Response
  try {
    page = await fetch(target.toString(), {
      signal: controller.signal,
      headers: {
        // Some sites gate JSON-LD behind a real browser UA.
        'user-agent':
          'Mozilla/5.0 (compatible; GoToRecipeBot/1.0; +https://gotorecipe.pages.dev)',
        accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })
  } catch {
    clearTimeout(timer)
    return json(
      { ok: false, error: "Couldn't reach that page. Try again." },
      502,
    )
  }
  clearTimeout(timer)

  if (!page.ok) {
    return json({ ok: false, error: `That page returned ${page.status}.` }, 502)
  }

  const contentType = page.headers.get('content-type') ?? ''
  if (!contentType.includes('html')) {
    return json({ ok: false, error: 'That link is not a web page.' }, 415)
  }

  const scripts = await collectJsonLd(page)
  for (const raw of scripts) {
    const recipe = recipeFromJsonLd(raw, target.toString())
    if (recipe && (recipe.ingredients.length || recipe.instructions.length)) {
      return json({ ok: true, recipe })
    }
  }

  return json(
    {
      ok: false,
      error:
        'No recipe found on that page. It may not publish structured data.',
    },
    404,
  )
}
