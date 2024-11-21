import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGalleryStore = defineStore('gallery', () => {
  const drawings = ref()

  const setDrawings = (allDrawings) => {
    drawings.value = allDrawings
  }

  return {
    drawings,
    setDrawings,
  }
})
