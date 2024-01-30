<template>
  <div class="auth-page">
    <MovingBackground class="auth-page__bg-container" />

    <div class="auth-page__auth-container">
      <div class="auth-page__auth-container-inner">
        <h1>Create account</h1>

        <ErrorAlert v-if="errors.unknown">
          {{ errors.unknown }}
        </ErrorAlert>

        <div class="row">
          <TextInput
            label="First name"
            placeholder="Enter your first name"
            :model-value="firstName"
            :is-invalid="!!errors.firstName"
            :error-message="errors.firstName"
            @update:modelValue="firstName = $event" 
          />

          <TextInput
            label="Last name"
            placeholder="Enter your last name"
            :model-value="lastName"
            :is-invalid="!!errors.lastName"
            :error-message="errors.lastName"
            @update:modelValue="lastName = $event" 
          />
        </div>

          <TextInput
          label="Username"
          placeholder="Enter your username"
          :model-value="username"
          :is-invalid="!!errors.username"
          :error-message="errors.username"
          @update:modelValue="username = $event" 
        />

          <TextInput
          label="Email address"
          placeholder="Email your email address"
          :model-value="email"
          :is-invalid="!!errors.email"
          :error-message="errors.email"
          @update:modelValue="email = $event" 
        />

        <TextInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          :model-value="password"
          :is-invalid="!!errors.password"
          :error-message="errors.password"
          @update:modelValue="password = $event" 
        />

        <PrimaryButton
          @click="signUp"
          :is-loading="isLoading"
        >
          Create account
        </PrimaryButton>

        <div class="auth-page__sign-up-container">
          Already have an account? <RouterLink class="auth-page__sign-up-link" :to="loginLinkUrl">Sign in.</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// components
import TextInput from '@/components/reusable/TextInput';
import PrimaryButton from '@/components/reusable/PrimaryButton';
import MovingBackground from '@/components/layout/MovingBackground';
import ErrorAlert from '@/components/reusable/ErrorAlert';

import { ref, computed } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import env from '../../env.cligenerated.json';

import authWithCredentials from '@/helpers/authWithCredentials';

export default {
  components: {
    TextInput,
    PrimaryButton,
    MovingBackground,
    ErrorAlert
  },

  setup() {
    document.title = 'Create account | iMokhonko'

    const googleAuthResponse = window.GOOGLE_AUTH_RESPONSE;
    const hasGoogleResponseData = !!googleAuthResponse;
    const googleAuthAccessToken = googleAuthResponse?.accessToken ?? null;
    const googleAuthResponseDecodedData = googleAuthResponse?.profile ?? null;

    const router = useRouter();
    const { query } = useRoute();
    const { redirect_url } = query ?? {};

    const authApiUrl = `https://${env['auth-api']}`

    const email = ref(googleAuthResponseDecodedData?.email ?? '');
    const username = ref('');
    const password = ref('');
    const firstName = ref(googleAuthResponseDecodedData?.given_name ?? '');
    const lastName = ref(googleAuthResponseDecodedData?.family_name ?? '');

    const errors = ref({});

    const isLoading = ref(false);

    const loginLinkUrl = computed(() =>  redirect_url ? `/?redirect_url=${redirect_url}` : '/');

    const validateSignUpForm = () => {
      errors.value = {};

      const normalizedFirstName = firstName.value.trim();
      const normalizedLastName = lastName.value.trim();
      const normalizedEmail = email.value.trim();
      const normalizedUsername = username.value.trim();

      if(!normalizedFirstName) errors.value.firstName = 'This field is required';
      if(!normalizedLastName) errors.value.lastName = 'This field is required';

      const usernamePattern = /^[a-zA-z0-9_.]+$/;
      if(!normalizedUsername) errors.value.username = 'This field is required';
      if(!usernamePattern.test(normalizedUsername)) errors.value.username = 'Username can contain only letters, numbers, underscores and dots';
      
      const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!emailPattern.test(normalizedEmail)) errors.value.email = 'Invalid email format';
      if(!normalizedEmail) errors.value.email = 'This field is required';


      if(password.value.length < 6) errors.value.password = 'Password should be longer than 5 characters';
      if(!password.value) errors.value.password = 'This field is required';
    };

    const parseApiErrors = (apiErrors = {}) => {
      return Object.entries(apiErrors).reduce((allErrors, [fieldName, errors = []]) => ({
        ...allErrors,
        [fieldName]: errors[0]
      }), {});
    };

    const signUp = async () => {
      validateSignUpForm();

      if(Object.keys(errors.value).length) {
        return;
      }

      isLoading.value = true;

      try {
        const normalizedFirstName = firstName.value.trim();
        const normalizedLastName = lastName.value.trim();
        const normalizedEmail = email.value.trim();
        const normalizedUsername = username.value.trim();
        
        const response = await fetch(`${authApiUrl}/sign-up`,  {
          method: 'POST',
          body: JSON.stringify({
            email: normalizedEmail,
            username: normalizedUsername,
            password: password.value,
            firstName: normalizedFirstName,
            lastName: normalizedLastName,

            ...(googleAuthAccessToken && { googleAuthAccessToken })
          })
        });

        if(response.status === 200) {
          const {
            isSuccess = false,
            error: authWithCredentialsError = null
          } = await authWithCredentials({
            login: normalizedUsername,
            password: password.value
          });

          if(isSuccess) {
            if(redirect_url) {
              window.location = redirect_url;
            }
          } else {
            console.error(authWithCredentialsError);

            router.push({
              name: 'login',
              query
            });
          }
        } else {
          const result = await response.json();

          const apiErrors = parseApiErrors(result.errors);

          errors.value = parseApiErrors(result.errors);
          if(apiErrors.unknown) {
            // show main error
            errors.value = { unknown: errors.value.unknown }
          }
        }

      } catch(e) {
        console.error(e);

        errors.value = { unknown: 'Something went wrong. Please try again later' };
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

      errors,

      isLoading,

      loginLinkUrl,

      signUp
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
