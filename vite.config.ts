import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
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
  plugins: [
    vue(),
    // Icons are compiled into the bundle: no network requests, strict CSP stays intact.
    Icons({ compiler: 'vue3' }),
    vueDevTools(),
    netlifyHeaders(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    headers: securityHeaders,
  },
})
