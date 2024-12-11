<script setup lang="ts">
import { useGallery } from '@/composables/useGallery'
import { Icon } from '@iconify/vue'
import type { Drawing } from '@/types/Drawing'

const props = defineProps<{
  drawing: Drawing
}>()

const { toggleLike, isLiked } = useGallery()

const toggleLikeDrawing = () => {
  toggleLike(props.drawing.id)
}
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

    <div class="drawing-card__image">
      <img :src="drawing.url" :alt="`${drawing.author}`" draggable="false" />
    </div>

    <div
      class="drawing-card__like"
      :class="{ 'drawing-card__like--active': isLiked(drawing) }"
      @click="toggleLikeDrawing()"
    >
      <Icon icon="icon-park-outline:like" class="drawing-card__like-icon" />
      <span class="drawing-card__like-count">{{ drawing.likes }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

  &__like {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    user-select: none;

    &-icon {
      transition:
        fill 0.3s,
        stroke 0.3s;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }

    &-count {
      font-size: 16px;
    }
  }
}

::v-deep(.drawing-card__like--active path) {
  fill: red;
  stroke-width: 1;
  stroke: red;
}
</style>
