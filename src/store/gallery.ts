import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Drawing } from '@/types/Drawing'

export const useGalleryStore = defineStore('gallery', () => {
  const drawings = ref<Drawing[]>([])

  const setDrawings = (allDrawings: Drawing[]) => {
    drawings.value = allDrawings
  }

  return {
    drawings,
    setDrawings,
  }
})
