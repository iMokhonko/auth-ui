<template>
  <div class="auth-page">
    <MovingBackground class="auth-page__bg-container" />

    <div class="auth-page__auth-container">
        <div 
          class="auth-page__auth-container-inner"
          :class="[{
            'hidden-disable': isLoading
          }]"
        >
          <h1>Sign in to iMokhonko</h1>

          <ErrorAlert v-if="isError">
            {{ errorMessage }}
          </ErrorAlert>

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
              :model-value="isRememberMe"
              @update:modelValue="isRememberMe = $event"
            />

            <RouterLink class="auth-page__forgot-pass-link" to="/forgot-password">Forgot password?</RouterLink>
          </div>

          <PrimaryButton
            @click="signIn"
            :is-loading="isLoading"
          >
            Sign in
          </PrimaryButton>

          <LabeledDivider>or sign in with</LabeledDivider>

          <GoogleAuth @authenticated="handleGoogleAuth" />

          <div class="auth-page__sign-up-container">
            Don't have an account? <RouterLink class="auth-page__sign-up-link" :to="registerLinkUrl">Create account.</RouterLink>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import GoogleAuth from '@/components/reusable/GoogleAuth';

import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import TextInput from '@/components/reusable/TextInput';
import LabeledDivider from '@/components/reusable/LabeledDivider';
import CheckboxInput from '@/components/reusable/CheckboxInput';
import PrimaryButton from '@/components/reusable/PrimaryButton';
import ErrorAlert from '@/components/reusable/ErrorAlert';
import MovingBackground from '@/components/layout/MovingBackground';

// helpers
import authWithCredentials from '@/helpers/authWithCredentials';
import setCookies from '@/helpers/setCookies';

export default {
  components: {
    TextInput,
    GoogleAuth,
    LabeledDivider,
    CheckboxInput,
    PrimaryButton,
    ErrorAlert,
    MovingBackground
  },

  setup() {
    document.title = 'Sign in | iMokhonko';

    const router = useRouter();
    const { query } = useRoute();

    const { redirect_url } = query ?? {};

    const login = ref('');
    const password = ref('');
    const isRememberMe = ref(false);

    const isError = ref(false);
    const errorMessage = ref('')

    const isLoading = ref(false);

    const registerLinkUrl = computed(() => redirect_url ? `/sing-up?redirect_url=${redirect_url}` : '/sign-up');

    const signIn = async () => {
      isLoading.value = true;
      isError.value = false;

      const {
        isSuccess = false,
        error = null
      } = await authWithCredentials({
        login: login.value,
        password: password.value,
        isRememberMe: isRememberMe.value
      });

      if(isSuccess) {
        if(redirect_url) {
          window.location = redirect_url;
        }
      } else {
        isError.value = true;
        errorMessage.value = error;
      }

      isLoading.value = false;
    };

    const handleGoogleAuth = async ({ status, authDetails, providerData }) => {
      switch (status) {
        case 'fully_signed_in': {
          const { accessToken, refreshToken } = authDetails ?? {};

          setCookies(accessToken, refreshToken, { isRememberMe: isRememberMe.value });

          if(redirect_url) {
            window.location = redirect_url;
          }
          
          break;
        }

        case 'provider_signed_in':
        default: {
          window.GOOGLE_AUTH_RESPONSE = providerData;

          router.push({
            name: 'register',
            query
          });

          break;
        }
      }
    };

    return {
      login,
      password,
      isRememberMe,
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
  width: 100%;
  height: 100%;
  display: flex;

  h1 {
    font-size: 24px;
  }

  &__bg-container {
    width: 100%;
    height: 100%;
    max-width: 500px;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  &__auth-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 30px 0px rgba(0,0,0,0.4);
    background: #fff;
    position: relative;
    padding: 24px;

    .loader {
      position: absolute;
      z-index: 101;
    }

    &-inner {
      max-width: 400px;
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
