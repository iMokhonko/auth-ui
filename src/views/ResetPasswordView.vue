<template>
  <div class="reset-password-page">
    <MovingBackground class="reset-password-page__bg-container" />

    <div class="reset-password-page__container">
      <div class="reset-password-page__container-inner">
        <h1 class="header">Reset your password</h1>

         <TextInput
          label="New password"
          type="password"
          placeholder="Enter new password"
          :is-invalid="!!errorMesage"
          :error-message="errorMesage"
          :model-value="newPassword"
          @update:modelValue="newPassword = $event" 
        />

        <PrimaryButton 
          :is-loading="isLoading"
          @click="resetPassword"
        >
          Reset password
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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

    const router = useRouter();
    const { query } = useRoute();

    const newPassword = ref('');
    const errorMesage = ref('');
    const isLoading = ref(false);

    const resetPassword = async () => {
      isLoading.value = true;
      errorMesage.value = '';

      try {
        if(!newPassword.value) {
          throw new Error('New password is required');
        }

        if(newPassword.value.length < 6) {
          throw new Error('Password length should be at least 6 characters');
        }

        const authApiUrl = `https://${services['auth-api']}`

        const response = await fetch(`${authApiUrl}/reset-password?action=reset_password`,  {
          method: 'POST',
          body: JSON.stringify({
            password: newPassword.value,
            token: query.resetPasswordToken
          })
        });

        if(response.status === 200) {
          router.push({
            name: 'login',
            query
          });
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
      newPassword,
      errorMesage,

      isLoading,

      resetPassword
    }
  },
}
</script>

<style lang="scss" scoped>
.reset-password-page {
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

  &__container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 30px 0px rgba(0,0,0,0.4);
    background: #fff;
    position: relative;

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
    margin-top: 0px;
  }
}
</style>
