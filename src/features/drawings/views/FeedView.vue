<template>
  <section class="page">
    <h1>{{ t('feed.title') }}</h1>
    <EmptyState :title="t('feed.emptyTitle')" :description="t('feed.emptyDescription')">
      <template #icon><IconImages /></template>
      <template #actions>
        <AppButton :to="{ name: 'draw' }">{{ t('feed.drawFirst') }}</AppButton>
      </template>
    </EmptyState>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppButton from '@/shared/ui/AppButton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import IconImages from '~icons/lucide/images'

const { t } = useI18n()
</script>
