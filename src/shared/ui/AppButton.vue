<template>
  <component
    :is="tag"
    v-bind="tagAttrs"
    class="button"
    :class="[`button--${variant}`, `button--${size}`, { 'button--block': block }]"
    :aria-busy="loading || undefined"
    :aria-disabled="isLink && isInert ? true : undefined"
    @click="onClick"
  >
    <AppSpinner v-if="loading" size="sm" class="button__spinner" />
    <span v-else-if="$slots.icon" class="button__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="button__label"><slot /></span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

import AppSpinner from '@/shared/ui/AppSpinner.vue'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const {
  variant = 'primary',
  size = 'md',
  type = 'button',
  to,
  href,
  disabled = false,
  loading = false,
  block = false,
} = defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  /** Renders a RouterLink. */
  to?: RouteLocationRaw
  /** Renders an external link. */
  href?: string
  disabled?: boolean
  loading?: boolean
  block?: boolean
}>()

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const isLink = computed(() => to !== undefined || href !== undefined)
const isInert = computed(() => disabled || loading)

// An inert link renders as <a> without href/to, so neither RouterLink nor the browser navigates.
const tag = computed(() => {
  if (to !== undefined && !isInert.value) return RouterLink
  if (isLink.value) return 'a'
  return 'button'
})

const tagAttrs = computed(() => {
  if (isLink.value) {
    if (isInert.value) return { role: 'link' }
    return to !== undefined ? { to } : { href, rel: 'noopener noreferrer' }
  }
  return { type, disabled: isInert.value }
})

function onClick(event: MouseEvent): void {
  if (isInert.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--tap-target);
  padding: 0 var(--space-5);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
  line-height: 1;
  letter-spacing: 0.005em;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition:
    background var(--duration-normal) var(--ease-out),
    border-color var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out),
    filter var(--duration-normal) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.button:active:not(:disabled, [aria-disabled='true']) {
  transform: scale(0.97);
}

.button:disabled,
.button[aria-disabled='true'] {
  opacity: 0.45;
  box-shadow: none;
  cursor: not-allowed;
}

.button[aria-busy='true'] {
  opacity: 0.85;
  cursor: progress;
}

.button--sm {
  min-height: 36px;
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
}

.button--lg {
  min-height: 52px;
  padding: 0 var(--space-6);
  font-size: var(--text-lg);
  border-radius: var(--radius-lg);
}

.button--block {
  display: flex;
  width: 100%;
}

.button--primary {
  background: linear-gradient(180deg, var(--color-accent-hover), var(--color-accent));
  color: var(--color-on-accent);
  box-shadow: var(--shadow-highlight), var(--glow-accent);
}

.button--secondary {
  background: var(--color-surface-raised);
  border-color: var(--color-border);
  color: var(--color-text);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
}

.button--ghost {
  background: transparent;
  color: var(--color-text);
}

.button--danger {
  background: linear-gradient(180deg, var(--color-danger-hover), var(--color-danger));
  color: var(--color-on-danger);
  box-shadow: var(--shadow-highlight), var(--glow-danger);
}

@media (hover: hover) {
  .button--primary:hover:not(:disabled, [aria-disabled='true']),
  .button--danger:hover:not(:disabled, [aria-disabled='true']) {
    transform: translateY(-1px);
    filter: brightness(1.06);
  }

  .button--secondary:hover:not(:disabled, [aria-disabled='true']) {
    background: var(--color-surface-hover);
    border-color: var(--color-border-strong);
  }

  .button--ghost:hover:not(:disabled, [aria-disabled='true']) {
    background: var(--color-surface-raised);
  }

  .button:hover:active:not(:disabled, [aria-disabled='true']) {
    transform: scale(0.97);
  }
}

.button__icon {
  display: inline-flex;
  font-size: 1.25em;
}
</style>
