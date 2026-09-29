<template>
  <section class="page">
    <h1>{{ t('feed.title') }}</h1>
    <p class="placeholder">{{ t('feed.placeholder') }}</p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
