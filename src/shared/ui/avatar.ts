export const AVATAR_TONES = 6

/** Up to two uppercase initials; grapheme-aware so emoji and combined letters are not split. */
export function getInitials(name: string): string {
  const words = name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  const firstGrapheme = (word: string): string =>
    segmenter.segment(word)[Symbol.iterator]().next().value?.segment ?? ''

  const letters = words.length > 1 ? [words[0], words.at(-1)] : [words[0]]
  return letters
    .map((word) => (word ? firstGrapheme(word) : ''))
    .join('')
    .toLocaleUpperCase()
}

/** Stable color index for a name, so the same user always gets the same color. */
export function getTone(name: string): number {
  let hash = 0
  for (const char of name) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0
  return hash % AVATAR_TONES
}
