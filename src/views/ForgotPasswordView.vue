<template>
  <div class="reset-password-page">
    <MovingBackground class="reset-password-page__bg-container" />

    <div class="reset-password-page__container">
      <div class="reset-password-page__container-inner">
        <h1 class="header">Reset password</h1>

        <span class="reset-password-page__description">
          Enter the email address you used when you joined and we’ll send you instructions to reset your password.
        </span>

        <TextInput
          :model-value="login"
          placeholder="Email address"
          @update:modelValue="email = $event" 
        />

        <PrimaryButton
          label="Reset password"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import TextInput from '@/components/reusable/TextInput';
import PrimaryButton from '@/components/reusable/PrimaryButton';
import MovingBackground from '@/components/layout/MovingBackground';

export default {
  components: {
    TextInput,
    PrimaryButton,
    MovingBackground
  },

  setup() {
    document.title = 'Reset password | iMokhonko';

    const email = ref('');
    const isLoading = ref(false)

    return {
      email,
      isLoading
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
