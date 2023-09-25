<template>
  <div class="register-page">
    <div class="register-page__email-container">
      <input 
        placeholder="username" 
        v-model="username"
      >
      <input 
        placeholder="email" 
        v-model="email"
      >
      <input 
        placeholder="password" 
        type="password"
        v-model="password"
      >
      <div class="register-page__actions">
        <button class="register-page__action-btn" @click="register">Register</button>
        <RouterLink to="/">Log in</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'HomeView',

  setup() {
    const email = ref('');
    const username = ref('');
    const password = ref('');

    const register = () => {
      console.log('registered with', '[', username.value, ":", email.value, ':', password.value , ']');
    };

    return {
      email,
      password,
      username,

      register
    }
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  background:#f2f2f2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__email-container {
    width: 300px;
    padding: 16px;
    border-radius: 8px;
    background: #fff;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }

  &__actions {
    display: flex;
    align-items: center;
    column-gap: 8px;
  }

  &__action-btn {
    display: flex;
    width: fit-content;
  }
}
</style>
