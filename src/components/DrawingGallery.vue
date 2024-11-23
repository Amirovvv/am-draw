<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps({
  drawings: Array,
})
</script>

<template>
  <div class="drawing-gallery">
    <div
      class="drawing-gallery__item"
      v-for="(drawing, index) in drawings"
      :key="index"
    >
      <img
        :src="drawing.url"
        :alt="`${index + 1}`"
        draggable="false"
        class="drawing-gallery__image"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.drawing-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 0;
  justify-items: center;

  &__item {
    width: 280px;
    height: 280px;
    border-radius: 10px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
  }
}
</style>
