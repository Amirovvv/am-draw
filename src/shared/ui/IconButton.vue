<template>
  <button
    :type="type"
    class="icon-button"
    :class="[`icon-button--${variant}`, `icon-button--${size}`]"
    :aria-label="label"
    :aria-pressed="pressed"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <span class="icon-button__icon" aria-hidden="true">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
const {
  variant = 'ghost',
  size = 'md',
  type = 'button',
  // Explicit default stops Vue's boolean casting (absent → false), which would add aria-pressed to every button.
  pressed = undefined,
  disabled = false,
} = defineProps<{
  /** Accessible name: an icon-only button must always have one. */
  label: string
  variant?: 'ghost' | 'secondary' | 'primary'
  /** Visual size; the tap target never gets smaller than 44px. */
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  /** Makes it a toggle button (e.g. a selected tool). */
  pressed?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>

<style scoped>
.icon-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition:
    background-color var(--duration-normal) var(--ease-out),
    border-color var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out),
    color var(--duration-normal) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

/* Expands the tap target to 44px for the small visual size. */
.icon-button::before {
  content: '';
  position: absolute;
  inset: 50% auto auto 50%;
  width: max(100%, var(--tap-target));
  height: max(100%, var(--tap-target));
  transform: translate(-50%, -50%);
}

.icon-button:active:not(:disabled) {
  transform: scale(0.92);
}

.icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-button--sm {
  width: 32px;
  height: 32px;
  font-size: 18px;
}

.icon-button--md {
  width: var(--tap-target);
  height: var(--tap-target);
  font-size: 22px;
}

.icon-button--lg {
  width: 56px;
  height: 56px;
  font-size: 26px;
}

.icon-button--secondary {
  background: var(--color-surface-raised);
  border-color: var(--color-border);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
}

.icon-button--primary {
  background: linear-gradient(180deg, var(--color-accent-hover), var(--color-accent));
  color: var(--color-on-accent);
  box-shadow: var(--shadow-highlight), var(--glow-accent);
}

.icon-button[aria-pressed='true'] {
  background: var(--color-text);
  border-color: var(--color-text);
  color: var(--color-bg);
  box-shadow: 0 0 0 3px rgb(255 255 247 / 15%);
}

@media (hover: hover) {
  .icon-button--ghost:hover:not(:disabled, [aria-pressed='true']),
  .icon-button--secondary:hover:not(:disabled, [aria-pressed='true']) {
    background: var(--color-surface-hover);
  }

  .icon-button--primary:hover:not(:disabled, [aria-pressed='true']) {
    background: var(--color-accent-hover);
  }
}

.icon-button__icon {
  display: inline-flex;
}
</style>
