<template>
  <div class="register-page">
    <div class="register-page__email-container">
      <div 
        v-if="isError"
        class="register-page__error-alert"
      >
        {{ errorMessage }}
      </div>

      <div 
        v-if="isSuccess"
        class="register-page__success-alert"
      >
        You have successfully registered. Plese check your email for confirmation letter.
      </div>

      <input 
        v-if="!isSuccess"
        placeholder="Username" 
        v-model="username"
      >
      <input 
        v-if="!isSuccess"
        placeholder="email" 
        v-model="email"
      >
      <input 
        v-if="!isSuccess"
        placeholder="Password" 
        type="password"
        v-model="password"
      >
      <input 
        v-if="!isSuccess"
        placeholder="First name" 
        v-model="firstName"
      >
      <input 
        v-if="!isSuccess"
        placeholder="Last name" 
        v-model="lastName"
      >
      <div class="register-page__actions">
        <button 
          v-if="!isSuccess"
          :class="['register-page__action-btn', { 'disabled': isLoading }]" 
          @click="register"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
        <RouterLink :to="loginLinkUrl">Log in</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

import env from '../../env.cligenerated.json'

import { useRoute } from 'vue-router';

import { jwtDecode } from "jwt-decode";

export default {
  name: 'RegisterView',

  setup() {
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
.register-page {
  background:#f2f2f2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__sign-up-as-container {
    display: flex;
    column-gap: 8px;
    align-items: center;

    img {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      background: #f2f2f2;
      flex-shrink: 0;
    }
  }

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

  &__error-alert,
  &__success-alert {
    background: rgba(255, 0, 0, 0.7);
    border-radius: 4px;
    padding: 16px;
    color: #000;
  }

  &__success-alert {
    background: rgba(0, 255, 0, 0.7);
  }

  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
