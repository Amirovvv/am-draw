<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGallery } from '@/composables/useGallery'

const router = useRouter()
const { addDrawing } = useGallery()

const canvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref<boolean>(false)
const color = ref<string>('#000000')
const lineWidth = ref<number>(5)
const ctx = ref<CanvasRenderingContext2D | null>(null)

onMounted(() => {
  if (canvas.value) {
    const dpr = window.devicePixelRatio || 1

    const width = 460
    const height = 460

    canvas.value.width = width * dpr
    canvas.value.height = height * dpr

    canvas.value.style.width = `${width}px`
    canvas.value.style.height = `${height}px`

    ctx.value = canvas.value.getContext('2d')
    if (ctx.value) {
      ctx.value.scale(dpr, dpr)
    }
  }
})

const startDrawing = (event: MouseEvent) => {
  if (!ctx.value) return
  isDrawing.value = true
  ctx.value.strokeStyle = color.value
  ctx.value.lineWidth = lineWidth.value

  ctx.value.lineCap = 'round'
  ctx.value.lineJoin = 'round'
  ctx.value.shadowColor = color.value
  ctx.value.shadowBlur = 2

  ctx.value.beginPath()
  ctx.value.moveTo(event.offsetX, event.offsetY)
}

const draw = (event: MouseEvent) => {
  if (!isDrawing.value || !ctx.value) return
  ctx.value.lineTo(event.offsetX, event.offsetY)
  ctx.value.stroke()
}

const stopDrawing = () => {
  if (isDrawing.value && ctx.value) {
    ctx.value.closePath()
  }
  isDrawing.value = false
}

const saveDrawing = () => {
  if (!canvas.value) return
  const dataURL = canvas.value.toDataURL()
  addDrawing(dataURL)
  router.push('/')
}
</script>

<template>
  <div class="drawing-canvas">
    <canvas
      ref="canvas"
      class="drawing-canvas__canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
    ></canvas>

    <div class="drawing-canvas__controls">
      <label class="color-picker">
        <span class="color-picker__label">Color:</span>
        <input type="color" v-model="color" class="color-picker__input" />
      </label>
      <label>
        Line Width:
        <input type="range" v-model="lineWidth" min="1" max="10" />
      </label>
      <button @click="saveDrawing">Save</button>
    </div>
  </div>
</template>

<style scoped>
.drawing-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.drawing-canvas__canvas {
  border: 2px solid #333;
  margin-bottom: 10px;
  border-radius: 8px;
  filter: contrast(1.2);
  background-color: #f0f0f0;
}

.drawing-canvas__controls {
  display: flex;
  gap: 10px;
}
</style>
