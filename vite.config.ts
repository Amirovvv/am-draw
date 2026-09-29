import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

import { renderNetlifyHeaders, securityHeaders } from './config/security-headers.ts'

function netlifyHeaders(): Plugin {
  return {
    name: 'amdraw:netlify-headers',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '_headers', source: renderNetlifyHeaders() })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), netlifyHeaders()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    headers: securityHeaders,
  },
})
