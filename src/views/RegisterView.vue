<template>
  <div class="auth-page">
    <MovingBackground class="auth-page__bg-container" />

    <div class="auth-page__auth-container">
        <div class="auth-page__auth-container-inner">
          <h1>Create account</h1>

          <ErrorAlert v-if="isError">
            {{ errorMessage }}
          </ErrorAlert>


          <div class="row">
            <TextInput
              label="First name"
              placeholder="Enter your first name"
              :model-value="firstName"
              @update:modelValue="firstName = $event" 
            />

            <TextInput
              label="Last name"
              placeholder="Enter your last name"
              :model-value="lastName"
              @update:modelValue="lastName = $event" 
            />
          </div>

           <TextInput
            label="Username"
            placeholder="Enter your username"
            :model-value="username"
            @update:modelValue="username = $event" 
          />

           <TextInput
            label="Email address"
            placeholder="Email your email address"
            :model-value="email"
            @update:modelValue="email = $event" 
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            :model-value="password"
            @update:modelValue="password = $event" 
          />

          <PrimaryButton
            label="Create account"
            @click="signUp"
            :is-loading="isLoading"
          />

          <div class="auth-page__sign-up-container">
            Already have an account? <RouterLink class="auth-page__sign-up-link" :to="loginLinkUrl">Sign in</RouterLink>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
// components
import TextInput from '@/components/reusable/TextInput';
import PrimaryButton from '@/components/reusable/PrimaryButton';
import ErrorAlert from '@/components/reusable/ErrorAlert';
import MovingBackground from '@/components/layout/MovingBackground';

import { ref, computed } from 'vue';

import env from '../../env.cligenerated.json'

import { useRoute } from 'vue-router';

import { jwtDecode } from "jwt-decode";

export default {
  components: {
    TextInput,
    PrimaryButton,
    ErrorAlert,
    MovingBackground
  },

  setup() {
    document.title = 'Create account | iMokhonko'
    const googleAuthResponse = window.GOOGLE_AUTH_RESPONSE;
    const hasGoogleResponseData = !!googleAuthResponse;
    const googleAuthResponseDecodedData = hasGoogleResponseData ? jwtDecode(googleAuthResponse.credential) : {};

    const { query } = useRoute();
    const { redirect_url } = query ?? {};

    const authApiUrl = `https://${env['auth-api']}`

    const email = ref(googleAuthResponseDecodedData?.email ?? '');
    const username = ref('');
    const password = ref('');
    const firstName = ref(googleAuthResponseDecodedData?.given_name ?? '');
    const lastName = ref(googleAuthResponseDecodedData?.family_name ?? '');

    const isLoading = ref(false);
    const isError = ref(false);
    const errorMessage = ref(null);
    const isSuccess = ref(false);

    const loginLinkUrl = computed(() =>  redirect_url ? `/?redirect_url=${redirect_url}` : '/');

    const register = async () => {
      isLoading.value = true;
      isError.value = false;

      try {
        const response = await fetch(`${authApiUrl}/sign-up`,  {
          method: 'POST',
          body: JSON.stringify({
            email: email.value,
            login: username.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value,
            ...(googleAuthResponse?.credential && { googleCredential: googleAuthResponse.credential })
          })
        });

        const result = await response.json();

        if(result.errorMessage) {
          isError.value = true;
          errorMessage.value = result.errorMessage;
        } else {
          isSuccess.value = true;
        }
      } catch(e) {
        isError.value = true;
        errorMessage.value = 'Something went wrong. Please try again later'
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      username,
      firstName,
      lastName,

      hasGoogleResponseData,
      googleAuthResponseDecodedData,

      isLoading,
      isError,
      isSuccess,
      errorMessage,

      loginLinkUrl,

      register
    }
  }
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

  .row {
    display: flex;
    align-items: center;
    column-gap: 16px;

    .text-input {
      width: calc(50% - 8px);
      flex-shrink: 0;
    }
  }

  &__bg-container {
    width: 100%;
    height: 100%;
    max-width: 500px;
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
