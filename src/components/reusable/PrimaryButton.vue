<template>
  <button 
    class="btn-primary" 
    :class="[{
      'disabled': isDisabled,
      'loading': isLoading
    }]"
  >
    <SpinLoader v-if="isLoading" />

    <span 
      class="label"
      :class="[{ 'visually-hidden': isLoading }]"
    >
      <slot />
    </span>
  </button>
</template>

<script>
import SpinLoader from './SpinLoader.vue';

export default {
  components: { SpinLoader },

  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.btn-primary {
  background-color: rgba(23,138,231, 1);
  color: #fff;
  height: 48px;
  padding: 0 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 48px;
  position: relative;

  &:hover,
  &:focus-visible {
    background-color: rgba(23,138,231, 0.9);
    box-shadow: 0 0 0 4px rgba(23,138,231,0.1);
    outline: none;
  }

  &.loading {
    pointer-events: none;
    user-select: none;
  }

  .loader {
    position: absolute;
  }

  .visually-hidden {
    opacity: 0;
    user-select: none;
    pointer-events: none;
  }
}
</style>