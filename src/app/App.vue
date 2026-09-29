<template>
  <header class="app-header">
    <RouterLink :to="{ name: 'feed' }" class="brand">{{ t('app.name') }}</RouterLink>
    <nav :aria-label="t('nav.label')" class="app-nav">
      <RouterLink :to="{ name: 'feed' }">{{ t('nav.feed') }}</RouterLink>
      <RouterLink :to="{ name: 'draw' }">{{ t('nav.draw') }}</RouterLink>
      <RouterLink :to="{ name: 'profile' }">{{ t('nav.profile') }}</RouterLink>
    </nav>
    <LocaleSwitcher />
  </header>
  <main class="app-main">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import LocaleSwitcher from '@/app/components/LocaleSwitcher.vue'

const { t } = useI18n()
const route = useRoute()

watchEffect(() => {
  const appName = t('app.name')
  const { titleKey } = route.meta
  document.title = titleKey ? `${t(titleKey)} · ${appName}` : appName
})
</script>
