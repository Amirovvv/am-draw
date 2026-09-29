<template>
  <section class="page">
    <h1>{{ t('draw.title') }}</h1>
    <p class="placeholder">{{ t('draw.placeholder') }}</p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
