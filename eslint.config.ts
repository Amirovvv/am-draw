import pluginVueI18n from '@intlify/eslint-plugin-vue-i18n'
import pluginVitest from '@vitest/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/playwright-report/**',
    '.netlify/**',
  ]),

  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.strict,

  {
    name: 'app/i18n',
    files: ['src/**/*.vue'],
    plugins: { '@intlify/vue-i18n': pluginVueI18n },
    rules: {
      // All user-facing text must go through translation keys.
      '@intlify/vue-i18n/no-raw-text': 'error',
      '@intlify/vue-i18n/no-v-html': 'error',
    },
  },

  {
    name: 'app/architecture',
    files: ['src/**/*.{vue,ts}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@supabase/supabase-js',
              message: 'Use the Supabase client only inside features/*/api or lib.',
            },
          ],
          patterns: [
            { group: ['../*', './*/../*'], message: 'Use the @/ alias instead of parent imports.' },
            {
              group: ['@/lib/supabase'],
              message: 'Components access Supabase only through features/*/api.',
            },
          ],
        },
      ],
    },
  },

  {
    name: 'app/architecture-api-layer',
    files: ['src/features/*/api/**/*.ts', 'src/lib/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['../*'], message: 'Use the @/ alias instead of parent imports.' }] },
      ],
    },
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
