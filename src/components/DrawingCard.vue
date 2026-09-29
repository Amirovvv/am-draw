<script setup lang="ts">
import type { Drawing } from '@/types/Drawing'
import { computed, ref } from 'vue'

const props = defineProps<{
  drawing: Drawing
}>()

const altText = computed(() => `Drawing by ${props.drawing.author}`)

const isHovered = ref(false)

const displayedImage = computed<string | undefined>(() => {
  if (isHovered.value && props.drawing.aiUrl) return props.drawing.aiUrl
  return props.drawing.url || undefined
})
</script>

<template>
  <div class="drawing-card">
    <div class="drawing-card__info">
      <div class="drawing-card__author">
        <img :src="drawing.photoURL" class="drawing-card__author-photo" />
        <span class="drawing-card__author-name">{{ drawing.author }}</span>
      </div>
      <div class="drawing-card__date">{{ drawing.date }}</div>
    </div>

    <div
      class="drawing-card__image"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <img :src="displayedImage" :alt="altText" draggable="false" />
    </div>
  </div>
</template>

<style lang="scss">
.drawing-card {
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 4px;

    &-photo {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      user-select: none;
    }

    &-name {
      font-size: 14px;
    }
  }

  &__date {
    font-size: 14px;
    color: #737373;
  }

  &__image {
    width: 280px;
    height: 280px;
    border-radius: 10px;
    overflow: hidden;
    user-select: none;

    img {
      width: 100%;
      height: 100%;
      background: #f0f0f0;
    }
  }
}
</style>
