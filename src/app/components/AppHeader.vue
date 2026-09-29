<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink :to="{ name: 'feed' }" class="app-header__brand">{{ t('app.name') }}</RouterLink>
      <nav :aria-label="t('nav.label')" class="app-header__nav">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.name"
          :to="{ name: item.name }"
          class="app-header__link"
        >
          <component :is="item.icon" aria-hidden="true" />
          <span>{{ t(item.labelKey) }}</span>
        </RouterLink>
      </nav>
      <LocaleSwitcher class="app-header__locale" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import LocaleSwitcher from '@/app/components/LocaleSwitcher.vue'
import { NAV_ITEMS } from '@/app/navigation'

const { t } = useI18n()
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-bar);
  padding-top: var(--safe-top);
  border-bottom: 1px solid var(--color-surface-raised);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  background: rgb(14 14 16 / 85%);
  backdrop-filter: blur(var(--blur-bar));
  -webkit-backdrop-filter: blur(var(--blur-bar));
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  max-width: var(--content-max-width);
  min-height: var(--header-height);
  margin: 0 auto;
  padding: 0 calc(var(--gutter) + var(--safe-right)) 0 calc(var(--gutter) + var(--safe-left));
}

.app-header__brand {
  font-family: var(--font-brand);
  font-size: var(--text-xl);
  line-height: 1;
  text-decoration: none;
}

/* On mobile the bottom navigation takes over. */
.app-header__nav {
  display: none;
}

.app-header__locale {
  margin-left: auto;
}

@media (min-width: 768px) {
  .app-header__nav {
    display: flex;
    gap: var(--space-1);
  }

  .app-header__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    min-height: 40px;
    padding: 0 var(--space-4);
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
    font-weight: var(--weight-medium);
    text-decoration: none;
    isolation: isolate;
    transition: color var(--duration-normal) var(--ease-out);
  }

  /* Active pill scales in behind the link. */
  .app-header__link::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border: 1px solid var(--color-border);
    border-radius: inherit;
    background: var(--color-surface-raised);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
    opacity: 0;
    transform: scale(0.85);
    transition:
      opacity var(--duration-normal) var(--ease-out),
      transform var(--duration-slow) var(--ease-spring);
  }

  .app-header__link svg {
    font-size: 18px;
  }

  .app-header__link:hover {
    color: var(--color-text);
  }

  .app-header__link[aria-current='page'] {
    color: var(--color-text);
  }

  .app-header__link[aria-current='page']::before {
    opacity: 1;
    transform: none;
  }

  .app-header__link[aria-current='page'] svg {
    color: var(--color-accent);
  }
}
</style>
