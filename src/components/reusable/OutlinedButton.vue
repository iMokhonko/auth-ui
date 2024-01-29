<template>
  <button 
    class="btn-outlined" 
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
import SpinLoader from './SpinLoader';

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
.btn-outlined {
  background-color: transparent;
  border: 1px solid #e7e7e9;
  color: #0d0c22;
  height: 48px;
  padding: 0 16px;
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
    background-color: transparent;
    outline: none;
    border-color: #dbdbde;
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