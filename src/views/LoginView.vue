<template>
  <div class="auth-page">

    <div class="auth-page__bg-container" />

    <div 
      class="auth-page__auth-container"
      :class="{
        'auth-page__auth-container--loading-overlay': isGoogleCredentialsVerification
      }"
    >
      <SpinLoader v-if="isGoogleCredentialsVerification" />

        <div 
          class="auth-page__auth-container-inner"
          :class="[{
            'hidden-disable': isLoading
          }]"
        >
          <h2>Sign in to iMokhonko.com</h2>

          <!-- <div 
            v-if="isError"
            class="auth-page__error-alert"
          >
            {{ errorMessage }}
          </div> -->

          <TextInput
            :model-value="login"
            placeholder="Email or username"
            @update:modelValue="login = $event" 
          />

          <TextInput
            type="password"
            placeholder="Password"
            :model-value="password"
            @update:modelValue="password = $event" 
          />

          <div class="auth-page__login-action-container">
            <CheckboxInput 
              label="Remember me"
              v-model="isRememberMe"
            />

            <RouterLink class="auth-page__forgot-pass-link" :to="registerLinkUrl">Forgot password?</RouterLink>
          </div>

          <PrimaryButton
            label="Sign in"
            @click="signIn"
            :is-loading="isLoading"
          />

          <LabeledDivider>or login with</LabeledDivider>

          <GoogleAuth @authenticated="handleGoogleAuth" />

          <div class="auth-page__sign-up-container">
            Don't have an account? <RouterLink class="auth-page__sign-up-link" :to="registerLinkUrl">Sign up now</RouterLink>
          </div>

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
import CheckboxInput from '@/components/reusable/CheckboxInput';
import PrimaryButton from '@/components/reusable/PrimaryButton';
import SpinLoader from '@/components/reusable/SpinLoader';

export default {
  name: 'HomeView',

  components: {
    TextInput,
    GoogleAuth,
    LabeledDivider,
    CheckboxInput,
    PrimaryButton,
    SpinLoader
  },


  setup() {
    const router = useRouter();
    const { query } = useRoute();

    const { redirect_url } = query ?? {};

    const login = ref('');
    const password = ref('');
    const isRememberMe = ref(false);

    const isError = ref(false);
    const errorMessage = ref('')

    const isLoading = ref(false);
    const isGoogleCredentialsVerification = ref(false);

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
            authType: 'CREDENTIALS',
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
        isGoogleCredentialsVerification.value = true;

        const response = await fetch(`https://${env['auth-api']}/sign-in`, {
          method: "POST",
          body: JSON.stringify({
            authType: 'GOOGLE',
            googleCredential: authResponse.credential 
          })
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
      } finally {
        isGoogleCredentialsVerification.value = false;
      }
    };

    return {
      login,
      password,
      isRememberMe,
      isLoading,
      isGoogleCredentialsVerification,
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
  width: 100%;
  height: 100%;
  display: flex;

  &__bg-container {
    width: 100%;
    max-width: 500px;
    background: url('@/assets/images/bg.webp');
    object-fit: cover;
    flex-shrink: 0;
  }

  &__auth-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 30px 0px rgba(0,0,0,0.4);
    background: #fff;
    position: relative;

    &--loading-overlay {
      &:before {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        content: "";
        background: rgba(0,0,0,0.5);
        width: 100%;
        height: 100%
      }
    }

    .loader {
      position: absolute;
      z-index: 101;
    }

    &-inner {
      max-width: 350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 16px;

      h2 {
        text-align: center;
      }

      .btn-primary {
        margin-top: 8px;
      }
    }
  }

  &__login-action-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__forgot-pass-link {
    font-size: 12px;
    color: grey;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__sign-up-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    column-gap: 4px;

    font-size: 14px;
    font-weight: bold;
    color: #6e6d7a;
  }

  &__sign-up-link {
    text-decoration: none;
    color: rgba(23,138,231, 1);

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }
}
</style>
