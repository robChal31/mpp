// lib/utils/text.ts

/**
 * Decode common HTML entities (numeric + named) without relying on DOM,
 * so it works both on server and client.
 */
function decodeHtmlEntities(input: string): string {
  const named: Record<string, string> = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
    ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’',
    ldquo: '“', rdquo: '”', bull: '•', middot: '·',
  }

  return input
    // numeric decimal: &#38; &#10; &#13;
    .replace(/&#(\d+);?/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
    // numeric hex: &#x26;
    .replace(/&#x([0-9a-fA-F]+);?/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    // named: &amp; &nbsp;
    .replace(/&([a-zA-Z]+);/g, (match, name) => named[name.toLowerCase()] ?? match)
}

/**
 * Clean text coming from external sources (e.g. API descriptions):
 * - decode HTML entities
 * - normalize line endings
 * - strip control chars & zero-width garbage
 * - collapse 3+ blank lines to 2, but KEEP single line breaks & list structure
 */
export function cleanDescription(raw: string | null | undefined): string {
  if (!raw) return ''

  let text = decodeHtmlEntities(raw)

  // Normalize CRLF / CR to LF
  text = text.replace(/\r\n?/g, '\n')

  // Remove zero-width & BOM
  text = text.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')

  // Remove control chars except \n and \t
  text = text.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')

  // Replace non-breaking spaces and other weird whitespace with normal space
  text = text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')

  // Trim each line's trailing whitespace but preserve leading indentation
  text = text.split('\n').map(line => line.replace(/[ \t]+$/g, '')).join('\n')

  // Collapse 3+ consecutive newlines to at most 2 (keeps paragraph breaks but kills garbage)
  text = text.replace(/\n{3,}/g, '\n\n')

  // Trim outer whitespace
  text = text.trim()

  return text
}