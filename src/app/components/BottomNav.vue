<template>
  <nav :aria-label="t('nav.label')" class="bottom-nav">
    <RouterLink
      v-for="item in NAV_ITEMS"
      :key="item.name"
      :to="{ name: item.name }"
      class="bottom-nav__link"
      :class="{ 'bottom-nav__link--primary': item.primary }"
    >
      <span class="bottom-nav__icon" aria-hidden="true">
        <component :is="item.icon" />
      </span>
      <span class="bottom-nav__label">{{ t(item.labelKey) }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { NAV_ITEMS } from '@/app/navigation'

const { t } = useI18n()
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-bar);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: calc(var(--bottom-nav-height) + var(--safe-bottom));
  padding: 0 var(--safe-right) var(--safe-bottom) var(--safe-left);
  border-top: 1px solid var(--color-surface-raised);
  background: rgb(14 14 16 / 88%);
  backdrop-filter: blur(var(--blur-bar)) saturate(140%);
  -webkit-backdrop-filter: blur(var(--blur-bar)) saturate(140%);
}

.bottom-nav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: color var(--duration-normal) var(--ease-out);
}

.bottom-nav__link[aria-current='page'] {
  color: var(--color-text);
  font-weight: var(--weight-semibold);
}

.bottom-nav__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 30px;
  font-size: 22px;
  isolation: isolate;
  transition: transform var(--duration-fast) var(--ease-out);
}

/* Active pill grows out of the icon, Material 3 style. */
.bottom-nav__icon::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: var(--radius-full);
  background: var(--color-surface-hover);
  opacity: 0;
  transform: scaleX(0.4);
  transition:
    opacity var(--duration-normal) var(--ease-out),
    transform var(--duration-slow) var(--ease-spring);
}

.bottom-nav__link[aria-current='page'] .bottom-nav__icon::before {
  opacity: 1;
  transform: scaleX(1);
}

.bottom-nav__icon :deep(svg *) {
  transition: stroke-width var(--duration-normal) var(--ease-out);
}

.bottom-nav__link[aria-current='page'] .bottom-nav__icon :deep(svg *) {
  stroke-width: 2.5;
}

.bottom-nav__link:active .bottom-nav__icon {
  transform: scale(0.9);
}

/* The main action is always highlighted. */
.bottom-nav__link--primary .bottom-nav__icon {
  color: var(--color-on-accent);
}

.bottom-nav__link--primary .bottom-nav__icon::before {
  background: linear-gradient(180deg, var(--color-accent-hover), var(--color-accent));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 25%),
    var(--glow-accent);
  opacity: 1;
  transform: none;
}

.bottom-nav__link--primary[aria-current='page'] .bottom-nav__icon::before {
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 25%),
    0 0 0 3px var(--color-accent-soft),
    var(--glow-accent);
}

.bottom-nav__label {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
</style>
