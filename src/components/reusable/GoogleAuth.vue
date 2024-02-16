<template>
  <OutlinedButton 
    class="google-auth-button" 
    @click="signIn"
  >
    <div class="google-auth-button__label">
      <div class="google-auth-button__icon" />
      Sign In with Google
    </div>
  </OutlinedButton>
</template>

<script>
import OutlinedButton from '@/components/reusable/OutlinedButton';

import services from '../../../services.cligenerated.json';

export default {
  emits: ['authenticated'],

  components: {
    OutlinedButton
  },
  
  methods: {
    signIn() {
      const popupWindow = window.open(
        `https://${services['auth-api']}/sign-in?type=google`,
        'Sign in to iMokhonko', 
        'height=600,width=600'
      );
    
      const handleAuthMesage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if(data.type !== 'google-auth:success') {
            return;
          }

          this.$emit('authenticated', data?.payload ?? {})

          popupWindow?.close();
          window.removeEventListener('message', handleAuthMesage, false);
        } catch(e) {
          // console.error(e);
        }
      }

      window.addEventListener('message', handleAuthMesage, false);
    },
  },
};
</script>

<style lang="scss">
.google-auth-button {
  &__label {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    column-gap: 16px;
  }

  &__icon {
    width: 16px;
    height: 16px;
    overflow: hidden;
    background: url('@/assets/icons/google.webp');
    background-size: 100%;
  }
}
</style>