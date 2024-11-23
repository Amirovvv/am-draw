<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <footer class="footer">
    <div class="footer__text">Amdraw, Amirov</div>
    <div class="footer__links">
      <a
        href="https://t.me/amirovvvvv"
        target="_blank"
        aria-label="Open my Telegram"
      >
        <Icon icon="simple-icons:telegram" class="footer__links-icon" />
      </a>
      <a
        href="https://github.com/Amirovvv/am-draw"
        target="_blank"
        aria-label="Open Github"
      >
        <Icon icon="simple-icons:github" class="footer__links-icon" />
      </a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 48px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;

  &__links {
    display: flex;
    gap: 20px;

    &-icon {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
