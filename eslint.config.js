import { defineConfig } from 'eslint-define-config'
import vue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import vueParser from 'vue-eslint-parser'
import babelParser from '@babel/eslint-parser'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'

export default defineConfig([
  {
    files: ['**/*.vue', '**/*.js', '**/*.ts'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        parser: {
          js: babelParser,
          vue: typescriptParser,
          ts: typescriptParser,
        },
        requireConfigFile: false,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue,
      prettier: prettierPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
    },
  },
])
