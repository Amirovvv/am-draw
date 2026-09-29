<template>
  <section class="page">
    <h1>{{ t('notFound.title') }}</h1>
    <p class="placeholder">{{ t('notFound.description') }}</p>
    <RouterLink :to="{ name: 'feed' }">{{ t('notFound.home') }}</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
