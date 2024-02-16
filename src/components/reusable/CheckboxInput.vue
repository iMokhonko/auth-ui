<template>
  <div class="checkbox">
    <input :id="id" type="checkbox" v-model="checkedValue"/>
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {  
  emits: ['update:modelValue'],

  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    id() {
      return uuidv4();
    },

    checkedValue: {
      get() {
        return this.modelValue;
      },

      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  column-gap: 4px;
  user-select: none;
  font-size: 12px;

  & > input {
    width: 12px;
    height: 12px;
    outline: none;
    border: 1px solid rgb(243, 243, 243);
    background: #fff;
  }
}
</style>