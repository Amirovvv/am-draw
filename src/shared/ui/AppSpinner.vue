<template>
  <span class="spinner" :class="`spinner--${size}`" role="status">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle class="spinner__track" cx="12" cy="12" r="9" />
      <path class="spinner__arc" d="M21 12a9 9 0 0 0-9-9" />
    </svg>
    <span class="visually-hidden">{{ label ?? t('common.loading') }}</span>
  </span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { size = 'md' } = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  /** Announced to screen readers; defaults to "Loading". */
  label?: string
}>()

const { t } = useI18n()
</script>

<style scoped>
.spinner {
  display: inline-flex;
  flex-shrink: 0;
  color: currentcolor;
}

.spinner--sm {
  width: 16px;
  height: 16px;
}

.spinner--md {
  width: 24px;
  height: 24px;
}

.spinner--lg {
  width: 40px;
  height: 40px;
}

svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentcolor;
  stroke-width: 2.5;
  stroke-linecap: round;
  animation: spin 0.8s linear infinite;
}

.spinner__track {
  opacity: 0.25;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  svg {
    animation-duration: 2.4s;
  }
}
</style>
