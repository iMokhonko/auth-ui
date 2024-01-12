<template>
  <div class="error-alert">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.error-alert {
  background: #ff5555;
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  font-size: 14px;
}
</style>