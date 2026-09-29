<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import AppHeader from '@/app/components/AppHeader.vue'
import BottomNav from '@/app/components/BottomNav.vue'

const { t } = useI18n()
const route = useRoute()

watchEffect(() => {
  const appName = t('app.name')
  const { titleKey } = route.meta
  document.title = titleKey ? `${t(titleKey)} · ${appName}` : appName
})
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-6) calc(var(--gutter) + var(--safe-right))
    calc(var(--bottom-nav-height) + var(--safe-bottom) + var(--space-6))
    calc(var(--gutter) + var(--safe-left));
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .app-main {
    padding-bottom: calc(var(--space-10) + var(--safe-bottom));
  }
}
</style>
