<template>
  <div class="labeled-divider">
    <span class="labeled-divider__text"><slot /></span>
  </div>
</template>


<style lang="scss" scoped>
.labeled-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 16px 0;
  user-select: none;

  &__text {
    background: #fff;
    padding: 0 8px;
    z-index: 2;
    color: #6e6d7a;
    font-size: 12px;
  }

  &::before {
    content: "";
    width: 100%;
    height: 1px;
    background: #e7e7e9;
    top: 50%;
    left: 0;
    position: absolute;
  }
}
</style>