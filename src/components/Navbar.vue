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
        <router-link to="/">amdraw</router-link>
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
  border-radius: 0 0 40px 40px;
  max-width: 660px;
  height: 80px;
  margin: 0 auto;
  padding: 0 28px;
  border: 1px solid #1b1b1d;
  border-top: none;
  align-items: center;

  .nav__logo {
    font-size: 24px;
    font-family: 'Silkscreen', sans-serif;
  }

  .nav__buttons {
    display: flex;
    align-items: center;
    gap: 14px;

    button {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    &-draw {
      padding: 10px 12px;
      background-color: #28a745;
      border-radius: 14px;
      font-size: 16px;

      &:hover {
        background-color: #218838;
      }
    }

    &-exit {
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 1px solid #27272a;

      &:hover {
        background-color: #ff4d4d;
        border-color: #ff1a1a;
      }
    }
  }
}
</style>
