<template>
  <div class="auth-page">

    <div class="auth-page__email-container">
       <h2>Sign in</h2>

      <div 
        v-if="isError"
        class="auth-page__error-alert"
      >
        {{ errorMessage }}
      </div>

      <GoogleAuth @authenticated="handleGoogleAuth" />

      <LabeledDivider>or</LabeledDivider>

      <TextInput 
        label="Username or Email"
        :model-value="login"
        @update:modelValue="login = $event" 
      />

      <TextInput 
        label="Password"
        type="password"
        :model-value="password"
        @update:modelValue="password = $event" 
      />


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
import GoogleAuth from '@/components/reusable/GoogleAuth';

import { ref, computed } from 'vue';

import env from '../../env.cligenerated.json';

import { useRoute, useRouter } from 'vue-router';

import TextInput from '@/components/reusable/TextInput';
import LabeledDivider from '@/components/reusable/LabeledDivider';

export default {
  name: 'HomeView',

  components: {
    TextInput,
    GoogleAuth,
    LabeledDivider
  },

  setup() {
    const router = useRouter();
    const { query } = useRoute();

    const { redirect_url } = query ?? {};

    const login = ref('');
    const password = ref('');

    const isError = ref(false);
    const errorMessage = ref('')

    const isLoading = ref(false);

    const registerLinkUrl = computed(() => redirect_url ? `/register?redirect_url=${redirect_url}` : '/register');

    const setCookies = (accessToken, refreshToken) => {
      const isDev = process.env.NODE_ENV === 'development';

      // prod env does not have prefix
      const cookiePrefix = env.__meta.config.env !== 'prod' ? `${env.__meta.config.env}-` : '';

      document.cookie = `${cookiePrefix}access-token=${accessToken.value};max-age=${accessToken.maxAge};path=${accessToken.path ?? ''};sameSite=${accessToken.sameSite ?? 'none'};secure=${accessToken.secure ?? false};domain=${isDev ? 'localhost' : accessToken.domain}`;
      document.cookie = `${cookiePrefix}refresh-token=${refreshToken.value};max-age=${refreshToken.maxAge};path=${refreshToken.path ?? ''};sameSite=${refreshToken.sameSite ?? 'none'};secure=${refreshToken.secure ?? false};domain=${isDev ? 'localhost' : refreshToken.domain}`;
    };

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

        if(response.status === 200) {
          const { accessToken, refreshToken } = result;

          setCookies(accessToken, refreshToken);
        
          if(redirect_url) window.location = redirect_url;
        } else {
          isError.value = true;
          errorMessage.value = result.errorMessage;
        }
      } catch(e) {
        console.error(e);
        isError.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    const handleGoogleAuth = async (authResponse) => {
      try {
        const response = await fetch(`https://${env['auth-api']}/auth/google`, {
          method: "POST",
          body: JSON.stringify({ credential: authResponse.credential })
        });

        if(response.status === 200) {
          const result = await response.json();

          const { accessToken, refreshToken } = result;

          setCookies(accessToken, refreshToken);

          if(redirect_url) window.location = redirect_url;
          return;
        } else {
          // save google reponse
          window.GOOGLE_AUTH_RESPONSE = authResponse;

          router.push({
            name: 'register',
            query
          });
        }
      } catch(e) {
         console.log(e);
      }
    };

    return {
      login,
      password,
      isLoading,
      registerLinkUrl,

      isError,
      errorMessage,

      signIn,
      handleGoogleAuth
    }
  },
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

  h2 {
    margin-bottom: 32px;
  }

  &__email-container {
    width: 400px;
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
