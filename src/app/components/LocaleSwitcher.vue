<template>
  <label class="locale-switcher">
    <span class="visually-hidden">{{ t('locale.label') }}</span>
    <select :value="locale" data-testid="locale-switcher" @change="onChange">
      <option v-for="option in SUPPORTED_LOCALES" :key="option" :value="option">
        {{ t(`locale.${option}`) }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { setLocale } from '@/app/i18n'
import { SUPPORTED_LOCALES, isLocale } from '@/app/i18n/locale'

const { t, locale } = useI18n()

function onChange(event: Event): void {
  const { value } = event.target as HTMLSelectElement
  if (isLocale(value)) setLocale(value)
}
</script>
