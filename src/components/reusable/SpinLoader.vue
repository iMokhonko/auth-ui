<template>
  <div class="loader" />
</template>

<style scoped lang="scss">
.loader {
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>