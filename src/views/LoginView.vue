<template>
  <div class="auth-page">
    <div class="auth-page__email-container">
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
        <button :disabled="isLoading" class="auth-page__action-btn" @click="logIn">{{ isLoading ? 'Loading...' : 'Log in' }}</button>
        <RouterLink to="/register">Register</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import env from '../../env.cligenerated.json';

import { useRoute } from 'vue-router';

export default {
  name: 'HomeView',

  setup() {
    const { query } = useRoute();

    const email = ref('imokhonko');
    const password = ref('1234');

    const isLoading = ref(false);

    const logIn = async () => {
      try {
        isLoading.value = true;

        const response = await fetch(`https://${env['auth-api']}/sign-in`, {
          method: "POST",
          body: JSON.stringify({
            login:  email.value,
            password: password.value
          })
        });

        const result = await response.json();

        const { token, refreshToken } = result;

        const isDev = process.env.NODE_ENV === 'development';

        document.cookie = `token=${token.value};maxAge=${token.maxAge};path=${token.path ?? ''};sameSite=${token.sameSite ?? 'none'};secure=${token.secure ?? false};domain=${isDev ? 'localhost' : token.domain}`;
        document.cookie = `refreshToken=${refreshToken.value};maxAge=${refreshToken.maxAge};path=${refreshToken.path ?? ''};sameSite=${refreshToken.sameSite ?? 'none'};secure=${refreshToken.secure ?? false};domain=${isDev ? 'localhost' : refreshToken.domain}`;
      
        const { redirect_url } = query ?? {};

        if(redirect_url) {
          window.location = redirect_url;
        }
      } catch(e) {
        console.error(e)
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      isLoading,

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
