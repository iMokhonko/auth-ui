<template>
  <fieldset class="text-input">
    <label 
      v-if="label" 
      :for="name"
    >
      {{ label }}
    </label>

    <input 
      :value="modelValue"
      :placeholder="placeholder" 
      :type="type" 
      :name="name"
      @input="updateModelValue"
    >
  </fieldset>
</template>

<script>
export default {
  emits: ['update:modelValue'],

  props: {
    name: {
      type: String,
      default: ''
    },

    type: {
      type: String,
      default: 'text'
    },

    label: {
      type: String,
      default: ''
    },

    placeholder: {
      type: String,
      default: ''
    },

    modelValue: {
      type: String,
      default: '',
    },
  },

  setup(props, { emit }) {
    const updateModelValue = ({ target }) => emit('update:modelValue', target.value);

    return {
      updateModelValue
    }
  }
}
</script>


<style lang="scss" scoped>
.text-input {
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  row-gap: 8px;

  input {
    width: 100%;
    height: 48px;
    padding: 8px 16px;
    border-radius: 48px;
    outline: none;
    border: 1px solid rgb(243, 243, 243);
    background: #fff;

    &:focus-visible {
      border-color: rgba(23,138,231,0.4);
      box-shadow: 0 0 0 4px rgba(23,138,231,0.1);
    }
  }

  label {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>