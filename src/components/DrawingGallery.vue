<script setup lang="ts">
import { ref } from 'vue'

// Тестовые данные
const drawings = ref([
  'https://via.placeholder.com/650',
  'https://via.placeholder.com/650',
  'https://via.placeholder.com/650',
  'https://via.placeholder.com/650',
  'https://via.placeholder.com/650',
  'https://via.placeholder.com/650',
])
</script>

<template>
  <div class="drawing-gallery">
    <div
      class="drawing-gallery__item"
      v-for="(drawing, index) in drawings"
      :key="index"
    >
      <img
        :src="drawing"
        :alt="`${index + 1}`"
        class="drawing-gallery__image"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.drawing-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 80%;
  margin: 0 auto;
  padding: 32px 0;

  &__item {
    width: 100%;
    height: auto;
    border-radius: 10px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
  }
}
</style>
