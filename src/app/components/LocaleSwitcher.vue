<template>
  <fieldset class="locale-switcher" data-testid="locale-switcher">
    <legend class="visually-hidden">{{ t('locale.label') }}</legend>
    <span
      class="locale-switcher__thumb"
      :class="`locale-switcher__thumb--${activeIndex}`"
      aria-hidden="true"
    />
    <label v-for="option in SUPPORTED_LOCALES" :key="option" class="locale-switcher__option">
      <input
        type="radio"
        name="locale"
        class="visually-hidden"
        :value="option"
        :checked="locale === option"
        @change="select(option)"
      />
      <span aria-hidden="true">{{ option.toUpperCase() }}</span>
      <span class="visually-hidden">{{ t(`locale.${option}`) }}</span>
    </label>
  </fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { setLocale } from '@/app/i18n'
import { SUPPORTED_LOCALES, type Locale } from '@/app/i18n/locale'

const { t, locale } = useI18n()

// Thumb position is a class, not an inline style: CSP forbids unsafe-inline.
const activeIndex = computed(() =>
  Math.max(
    0,
    SUPPORTED_LOCALES.findIndex((option) => option === locale.value),
  ),
)

function select(option: Locale): void {
  setLocale(option)
}
</script>

<style scoped>
.locale-switcher {
  position: relative;
  display: inline-grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  margin: 0;
  padding: 3px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-surface-raised);
  isolation: isolate;
}

.locale-switcher__thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  z-index: -1;
  /* Two locales; add a width and a --N modifier when a third appears. */
  width: calc((100% - 6px) / 2);
  border-radius: var(--radius-full);
  background: var(--color-text);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-slow) var(--ease-spring);
}

.locale-switcher__thumb--1 {
  transform: translateX(100%);
}

.locale-switcher__option {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 34px;
  padding: 0 var(--space-3);
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: color var(--duration-normal) var(--ease-out);
  user-select: none;
}

/* Extends the tap target to 44px without growing the header. */
.locale-switcher__option::after {
  content: '';
  position: absolute;
  inset: -5px 0;
}

.locale-switcher__option:has(input:checked) {
  color: var(--color-bg);
}

@media (hover: hover) {
  .locale-switcher__option:not(:has(input:checked)):hover {
    color: var(--color-text);
  }
}

.locale-switcher__option:has(input:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
</style>
