<template>
  <section class="page">
    <h1>{{ t('profile.title') }}</h1>
    <EmptyState :title="t('profile.emptyTitle')" :description="t('profile.emptyDescription')">
      <template #icon><IconUserRound /></template>
    </EmptyState>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import EmptyState from '@/shared/ui/EmptyState.vue'
import IconUserRound from '~icons/lucide/user-round'

const { t } = useI18n()
</script>
