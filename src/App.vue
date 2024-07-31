<template>
  <router-view/>
  <Toaster />
</template>

<script>
import Toaster from '@/components/ui/toast/Toaster.vue'

export default {
  components: {
    Toaster
  }
}
</script>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.hidden-disable {
  pointer-events: none;
  user-select: none;
}
</style>