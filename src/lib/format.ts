/** Format an ISO 8601 duration (e.g. "PT1H30M") as "1 hr 30 min".
    Passes through anything that isn't a recognizable duration. */
export function formatDuration(value?: string): string | undefined {
  if (!value) return undefined
  const match = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(value.trim())
  if (!match || (!match[1] && !match[2] && !match[3])) return value

  const [, d, h, m] = match
  const parts: string[] = []
  if (d) parts.push(`${d} day${+d === 1 ? '' : 's'}`)
  if (h) parts.push(`${h} hr`)
  if (m) parts.push(`${m} min`)
  return parts.join(' ') || value
}

/** Shorten a URL to its hostname for source attribution. */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
