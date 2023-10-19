<template>
  <div class="auth-page">
    <div class="auth-page__email-container">
      test feature 222
      <input 
        placeholder="email" 
        v-model="email"
      >
      <input 
        placeholder="password" 
        type="password"
        v-model="password"
      >
      <div class="auth-page__actions">
        <button class="auth-page__action-btn" @click="logIn">Log in</button>
        <RouterLink to="/register">Register</RouterLink>
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
    const password = ref('');

    const logIn = () => {
      console.log('log in with', '[', email.value, ":", password.value, ']');
    };

    return {
      email,
      password,

      logIn
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-page {
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
