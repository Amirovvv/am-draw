// Single source of truth for HTTP security headers.
// Used by `vite preview` (so e2e runs under the real CSP) and emitted as Netlify `_headers` on build.

const SUPABASE = 'https://*.supabase.co'
const SUPABASE_REALTIME = 'wss://*.supabase.co'

const contentSecurityPolicy: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'"],
  'img-src': ["'self'", 'data:', 'blob:', SUPABASE],
  'font-src': ["'self'"],
  'connect-src': ["'self'", SUPABASE, SUPABASE_REALTIME],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  'media-src': ["'self'"],
  'frame-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
}

export const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': Object.entries(contentSecurityPolicy)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

const immutableAssetHeaders: Record<string, string> = {
  'Cache-Control': 'public, max-age=31536000, immutable',
}

function renderBlock(path: string, headers: Record<string, string>): string {
  const lines = Object.entries(headers).map(([name, value]) => `  ${name}: ${value}`)
  return [path, ...lines].join('\n')
}

export function renderNetlifyHeaders(): string {
  return `${[
    renderBlock('/*', securityHeaders),
    renderBlock('/assets/*', immutableAssetHeaders),
  ].join('\n\n')}\n`
}
