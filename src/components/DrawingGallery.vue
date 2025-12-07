<script setup lang="ts">
import DrawingCard from '@/components/DrawingCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import type { Drawing } from '@/types/Drawing'

defineProps<{
  drawings: Drawing[]
}>()
</script>

<template>
  <div class="drawing">
    <template v-if="drawings.length > 0">
      <DrawingCard
        v-for="(drawing, index) in drawings"
        :key="index"
        :drawing="drawing"
      />
    </template>

    <template v-else>
      <SkeletonCard v-for="n in 8" :key="n" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.drawing {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 0;
  justify-items: center;
}
</style>
