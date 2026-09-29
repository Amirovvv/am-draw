<template>
  <div class="empty-state">
    <span v-if="$slots.icon" class="empty-state__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <div v-if="$slots.actions" class="empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-10) var(--space-5);
  border: 1px solid var(--color-surface-raised);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(120% 80% at 50% 0%, rgb(40 167 69 / 7%), transparent 60%), var(--color-surface);
  text-align: center;
  animation: rise var(--duration-slow) var(--ease-out) both;
}

.empty-state__icon {
  display: inline-flex;
  margin-bottom: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, var(--color-surface-hover), var(--color-surface-raised));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 6%),
    0 10px 30px -10px rgb(40 167 69 / 35%);
  color: var(--color-text);
  font-size: 30px;
}

.empty-state__title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
}

.empty-state__description {
  max-width: 36ch;
  color: var(--color-text-muted);
}

.empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .empty-state {
    animation: none;
  }
}
</style>
