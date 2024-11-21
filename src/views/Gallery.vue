<script setup lang="ts">
import { onMounted } from 'vue'
import { useGalleryStore } from '@/store/gallery'
import { useGallery } from '@/composables/useGallery.ts'
import DrawingGallery from '@/components/DrawingGallery.vue'

const { fetchDrawings } = useGallery()
const store = useGalleryStore()

onMounted(() => {
  fetchDrawings()
})
</script>

<template>
  <div class="gallery">
    <DrawingGallery :if="store.drawings > 0" :drawings="store.drawings" />
  </div>
</template>

<style scoped></style>
