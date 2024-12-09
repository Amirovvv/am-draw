<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useGallery } from '@/composables/useGallery'

defineProps({
  drawings: Array,
})

const { toggleLike, isLiked } = useGallery()

const handleLike = (drawingId: string) => {
  toggleLike(drawingId)
}
</script>

<template>
  <div class="drawing">
    <div v-for="(drawing, index) in drawings" :key="index">
      <div class="drawing__info">
        <div class="drawing__info-author">
          <img :src="drawing.photoURL" />
          <span>{{ drawing.author }}</span>
        </div>
        <div class="drawing__info-date">{{ drawing.date }}</div>
      </div>

      <div class="drawing__item">
        <img
          :src="drawing.url"
          :alt="`${index + 1}`"
          draggable="false"
          class="drawing__item-image"
        />
      </div>

      <div
        class="drawing__like"
        :class="{ active: isLiked(drawing) }"
        @click="handleLike(drawing.id)"
      >
        <Icon icon="icon-park-outline:like" class="icon" />
        <span>{{ drawing.likes }}</span>
      </div>
    </div>
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

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;

    &-author {
      display: flex;
      align-items: center;
      gap: 4px;

      span {
        font-size: 14px;
        font-weight: bold;
      }

      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }

    &-date {
      font-size: 12px;
      color: #737373;
    }
  }

  &__like {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;

    .icon {
      transition:
        fill 0.3s,
        stroke 0.3s;
    }
  }

  &__item {
    width: 280px;
    height: 280px;
    border-radius: 10px;
    overflow: hidden;

    &-image {
      width: 100%;
      height: 100%;
      background: #f0f0f0;
    }
  }
}

.icon {
  width: 24px;
  height: 24px;
}

::v-deep(.active path) {
  fill: red;
  stroke-width: 1;
  stroke: red;
}
</style>
