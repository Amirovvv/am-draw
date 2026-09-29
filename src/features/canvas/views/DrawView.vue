<template>
  <section class="page">
    <h1>{{ t('draw.title') }}</h1>
    <EmptyState :title="t('draw.emptyTitle')" :description="t('draw.emptyDescription')">
      <template #icon><IconPalette /></template>
    </EmptyState>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import EmptyState from '@/shared/ui/EmptyState.vue'
import IconPalette from '~icons/lucide/palette'

const { t } = useI18n()
</script>
