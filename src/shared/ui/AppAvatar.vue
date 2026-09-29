<template>
  <span
    class="avatar"
    :class="[`avatar--${size}`, `avatar--tone-${tone}`]"
    role="img"
    :aria-label="name"
  >
    <img
      v-if="src && !failed"
      :src="src"
      alt=""
      loading="lazy"
      decoding="async"
      referrerpolicy="no-referrer"
      @error="failed = true"
    />
    <span v-else class="avatar__initials" aria-hidden="true">{{ initials }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { getInitials, getTone } from '@/shared/ui/avatar'

const {
  src,
  name,
  size = 'md',
} = defineProps<{
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
}>()

const failed = ref(false)
watch(
  () => src,
  () => {
    failed.value = false
  },
)

const initials = computed(() => getInitials(name))
const tone = computed(() => getTone(name))
</script>

<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  color: var(--color-bg);
  font-weight: var(--weight-bold);
  line-height: 1;
  user-select: none;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar--sm {
  width: 28px;
  height: 28px;
  font-size: var(--text-xs);
}

.avatar--md {
  width: 40px;
  height: 40px;
  font-size: var(--text-sm);
}

.avatar--lg {
  width: 96px;
  height: 96px;
  font-size: var(--text-2xl);
}

/* Static palette instead of inline styles: CSP forbids unsafe-inline. */
.avatar--tone-0 {
  background: #7dd3fc;
}

.avatar--tone-1 {
  background: #86efac;
}

.avatar--tone-2 {
  background: #fca5a5;
}

.avatar--tone-3 {
  background: #fcd34d;
}

.avatar--tone-4 {
  background: #c4b5fd;
}

.avatar--tone-5 {
  background: #f9a8d4;
}
</style>
