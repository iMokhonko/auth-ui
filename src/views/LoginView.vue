<template>
  <div class="auth-page">
    <div class="auth-page__email-container">
      <div 
        v-if="isError"
        class="auth-page__error-alert"
      >
        {{ errorMessage }}
      </div>

      <input 
        placeholder="email or login" 
        v-model="login"
      >
      <input 
        placeholder="password" 
        type="password"
        v-model="password"
      >
      <div class="auth-page__actions">
        <button
          :class="['auth-page__action-btn', { 'disabled': isLoading }]" 
          @click="signIn"
        >
          {{ isLoading ? 'Loging in...' : 'Log in' }}
        </button>
        <RouterLink :to="registerLinkUrl">Register</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

import env from '../../env.cligenerated.json';

import { useRoute } from 'vue-router';

export default {
  name: 'HomeView',

  setup() {
    const { query } = useRoute();
    const { redirect_url } = query ?? {};

    const login = ref('');
    const password = ref('');

    const isError = ref(false);
    const errorMessage = ref('')

    const isLoading = ref(false);

    const registerLinkUrl = computed(() => redirect_url ? `/register?redirect_url=${redirect_url}` : '/register');

    const signIn = async () => {
      try {
        isLoading.value = true;
        isError.value = false;

        const response = await fetch(`https://${env['auth-api']}/sign-in`, {
          method: "POST",
          body: JSON.stringify({
            login: login.value,
            password: password.value
          })
        });

        const result = await response.json();

        console.log('result', result)

        if(result.errorMessage) {
          isError.value = true;
          errorMessage.value = result.errorMessage;
        } else {
          const { token, refreshToken } = result;

          const isDev = process.env.NODE_ENV === 'development';

          document.cookie = `token=${token.value};max-age=${token.maxAge};path=${token.path ?? ''};sameSite=${token.sameSite ?? 'none'};secure=${token.secure ?? false};domain=${isDev ? 'localhost' : token.domain}`;
          document.cookie = `refreshToken=${refreshToken.value};max-age=${refreshToken.maxAge};path=${refreshToken.path ?? ''};sameSite=${refreshToken.sameSite ?? 'none'};secure=${refreshToken.secure ?? false};domain=${isDev ? 'localhost' : refreshToken.domain}`;
        

          if(redirect_url) {
            window.location = redirect_url;
          }
        }
      } catch(e) {
        console.error(e);
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      login,
      password,
      isLoading,
      registerLinkUrl,

      isError,
      errorMessage,

      signIn
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

  &__error-alert {
    background: rgba(255, 0, 0, 0.7);
    border-radius: 4px;
    padding: 16px;
    color: #000;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
