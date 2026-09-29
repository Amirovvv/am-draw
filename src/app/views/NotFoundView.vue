<template>
  <section class="page">
    <h1>{{ t('notFound.title') }}</h1>
    <EmptyState :title="t('notFound.emptyTitle')" :description="t('notFound.emptyDescription')">
      <template #icon><IconMapPinOff /></template>
      <template #actions>
        <AppButton :to="{ name: 'feed' }">{{ t('notFound.home') }}</AppButton>
      </template>
    </EmptyState>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppButton from '@/shared/ui/AppButton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import IconMapPinOff from '~icons/lucide/map-pin-off'

const { t } = useI18n()
</script>
