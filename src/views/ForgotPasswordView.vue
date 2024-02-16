<template>
  <div class="forgot-password-page">
    <MovingBackground class="forgot-password-page__bg-container" />

    <div 
      v-if="!isSuccess"
      class="forgot-password-page__container"
    >
      <div class="forgot-password-page__container-inner">
        <h1 class="header">Reset password</h1>

        <span class="forgot-password-page__description">
          Enter the email address you used when you joined and we’ll send you instructions to reset your password.
        </span>

        <TextInput
          :model-value="email"
          placeholder="Email address"
          :is-invalid="!!errorMesage"
          :error-message="errorMesage"
          @update:modelValue="email = $event" 
        />

        <PrimaryButton 
          :is-loading="isLoading"
          @click="resetPassword"
        >
          Reset password
        </PrimaryButton>
      </div>
    </div>

    <div 
      v-else
      class="forgot-password-page__container"
    >
      <div class="forgot-password-page__container-inner success">
        <span class="icon">✅</span> If your email address exists in our database, you will receive a password recovery email
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import TextInput from '@/components/reusable/TextInput';
import PrimaryButton from '@/components/reusable/PrimaryButton';
import MovingBackground from '@/components/layout/MovingBackground';

import services from '../../services.cligenerated.json';

export default {
  components: {
    TextInput,
    PrimaryButton,
    MovingBackground
  },

  setup() {
    document.title = 'Reset password | iMokhonko';

    const email = ref('');
    const errorMesage = ref('');
    const isLoading = ref(false);
    const isSuccess = ref(false);

    const resetPassword = async () => {
      isLoading.value = true;
      errorMesage.value = '';

      try {
        const normalizedEmail = email.value.trim();

        if(!normalizedEmail) {
          throw new Error('Email address is required')
        }

        const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailPattern.test(normalizedEmail)) {
          throw new Error('Invalid email format')
        }

        const authApiUrl = `https://${services['auth-api']}`;

        const response = await fetch(`${authApiUrl}/reset-password?action=request_password_reset`,  {
          method: 'POST',
          body: JSON.stringify({ email: normalizedEmail })
        });

        if(response.status === 200) {
          isSuccess.value = true;
        } else {
          const { error } = await response.json();
          throw new Error(error ?? 'Something went wrong, please try again later')
        }

      } catch(error) {
        errorMesage.value = error.message;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      isLoading,
      isSuccess,
      errorMesage,

      resetPassword
    }
  },
}
</script>

<style lang="scss" scoped>
.forgot-password-page {
  width: 100%;
  height: 100%;
  display: flex;

  .header {
    font-size: 24px;
  }

  &__bg-container {
    width: 100%;
    max-width: 500px;
    flex-shrink: 0;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  &__description {
    font-size: 14px;
  }

  &__container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 30px 0px rgba(0,0,0,0.4);
    background: #fff;
    position: relative;

    .success {
      display: flex;
      flex-direction: column;
      row-gap: 16px;

      font-size: 18px;
    
      .icon {
        font-size: 48px;
      }
    }

    &-inner {
      max-width: 350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 24px;
    }
  }

  .btn-primary {
    width: fit-content;
    height: 36px;
    padding: 0 24px;
    margin-top: -8px;
  }
}
</style>
