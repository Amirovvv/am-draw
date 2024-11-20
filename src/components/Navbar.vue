<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const { logout } = useAuth()
</script>

<template>
  <header>
    <nav class="nav">
      <div class="nav__logo">
        <router-link to="/">Amdraw</router-link>
      </div>
      <div class="nav__buttons">
        <router-link to="/draw">
          <button class="nav__buttons-draw">
            <Icon icon="line-md:pencil" class="icon" />
            draw
          </button>
        </router-link>
        <button
          v-if="authStore.user"
          @click="logout"
          class="nav__buttons-exit"
          aria-label="Exit"
        >
          <Icon icon="iconamoon:exit-thin" class="icon" />
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.nav {
  display: flex;
  justify-content: space-between;
  background-color: #0e0e10;
  width: 50%;
  border-radius: 0 0 40px 40px;
  max-width: 800px;
  margin: 0 auto;
  padding: 18px 36px;
  border: 1px solid #27272a;
  border-top: none;
  align-items: center;

  .nav__logo {
    font-size: 22px;
    font-family: sans-serif;
  }

  .nav__buttons {
    display: flex;
    align-items: center;
    gap: 14px;

    button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    &-draw {
      padding: 10px 12px;
      background-color: #28a745;
      border-radius: 14px;

      &:hover {
        background-color: #218838;
      }
    }

    &-exit {
      border-radius: 50%;
      border: 1px solid #27272a;
      padding: 10px;

      &:hover {
        background-color: #ff4d4d;
        border-color: #ff1a1a;
      }
    }
  }
}
</style>
