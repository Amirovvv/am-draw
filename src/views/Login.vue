<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { Icon } from '@iconify/vue'

const { loginWithGoogle, loginWithGitHub } = useAuth()
</script>

<template>
  <div class="login">
    <div class="login__title">
      <p>Draw it. Show it.</p>
      <p>Login to your account</p>
    </div>
    <div class="login__btns">
      <button
        class="login__btn"
        @click="loginWithGoogle"
        aria-label="Login with Google"
      >
        <Icon icon="flat-color-icons:google" class="icon" />
        Login with Google
      </button>
      <button
        class="login__btn"
        @click="loginWithGitHub"
        aria-label="Login with GitHub"
      >
        <Icon icon="bytesize:github" class="icon" />
        Login with GitHub
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  margin: 32px auto;
  max-width: 380px;

  &__title {
    font-size: 22px;
    font-weight: bold;
    width: 100%;

    & p:first-of-type {
      font-family: 'Silkscreen', sans-serif;
      font-weight: normal;
    }

    p {
      margin: 0;
    }
  }

  &__btns {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    width: 100%;
    gap: 8px;
  }

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    background: none;
    border: 1px solid #3b3a3a;
    border-radius: 12px;
    width: 100%;
    padding: 10px;

    &:hover {
      border: 1px solid #8f8e8d;
    }
  }
}
</style>
