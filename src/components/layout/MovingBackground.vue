<template>
  <div
    class="moving-background"
    :style="{ 
      ...(src && { backgroundImage: `url(${src})` })
    }"
  />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.moving-background {
  @keyframes moving {
    0%   {background-position: 0% 0%;}
    25%  {background-position: 100% 0%;}
    50%  {background-position: 100% 100%;}
    75%  {background-position: 0% 100%;}
    100% {background-position: 0% 0%;}
  }

  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: moving 1500s infinite linear;
  background: url('@/assets/images/bg.webp');
}
</style>