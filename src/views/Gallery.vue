<script setup lang="ts">
import { onMounted } from 'vue'
import DrawingGallery from '@/components/DrawingGallery.vue'
import { useGalleryStore } from '@/store/gallery'
import { useGallery } from '@/composables/useGallery.ts'

const { fetchDrawings } = useGallery()
const store = useGalleryStore()

onMounted(() => {
  fetchDrawings()
})
</script>

<template>
  <div class="gallery">
    <DrawingGallery :drawings="store.drawings" />
  </div>
</template>

<style scoped></style>
