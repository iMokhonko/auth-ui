<template>
  <div ref="googleAuthButton" />
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  emits: ['authenticated'],

  props: {
    text: {
      type: String,
      default: 'signin_with'
    }
  },

  setup(props, { emit }) {
    const googleAuthButton = ref(null);

    const handleCredentialResponse = (response) => emit('authenticated', response);

    const initGoogleAuth = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.addEventListener('load', async () => {
        window.google.accounts.id.initialize({
          client_id: '252143816418-tir6v1dcpo1l5069eoo9bti4h2lcph2j.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          googleAuthButton.value, {
            type: 'standard', // 'icon'
            theme: 'outline',
            height: 48, 
            text: props.text, // 'signin_with' , 'signup_with' , 'continue_with' , 'signin'
            logo_alignment: 'left', // 'center'
          },
        );

        window.google.accounts.id.prompt();
      });
    };

    onMounted(() => { initGoogleAuth(); });

    return {
      googleAuthButton
    }
  },
}
</script>