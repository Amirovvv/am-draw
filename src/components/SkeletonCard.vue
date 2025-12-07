<template>
  <div class="drawing-card drawing-card--skeleton">
    <div class="drawing-card__info">
      <div class="drawing-card__author">
        <div class="drawing-card__author-photo skeleton-item"></div>
        <div class="drawing-card__author-name skeleton-item"></div>
      </div>
      <div class="drawing-card__date skeleton-item"></div>
    </div>
    <div class="drawing-card__image skeleton-item"></div>
  </div>
</template>

<style lang="scss">
.drawing-card--skeleton .drawing-card__author-name,
.drawing-card--skeleton .drawing-card__date {
  width: 60px;
  height: 14px;
  border-radius: 10px;
}

.skeleton-item {
  position: relative;
  overflow: hidden;
  opacity: 0.2;

  background-image: linear-gradient(
    to right,
    rgba(214, 215, 216, 0.6) 0%,
    rgba(255, 255, 255, 0.9) 15%,
    rgba(214, 215, 216, 0.6) 30%,
    rgba(214, 215, 216, 0.6) 100%
  );

  background-size: 200% 100%;
  animation: skeletonShimmer 1.2s linear infinite;
}

@keyframes skeletonShimmer {
  0% {
    background-position: 50% 0;
  }
  100% {
    background-position: -150% 0;
  }
}
</style>
