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
          <h1 class="text-2xl font-semibold tracking-tight py-4">
            Sign in
          </h1>

          <Alert v-if="isError" variant="destructive">
            <AlertDescription>
              {{ errorMessage  }}
            </AlertDescription>
          </Alert>

          <Input 
            type="email" 
            placeholder="Email or username" 
            v-model="login" 
          />

          <Input 
            type="password" 
            placeholder="Password" 
            v-model="password" 
          />

          <div class="auth-page__login-action-container">

            <div class="flex items-center space-x-2">
              <Checkbox id="remember-me" v-model="isRememberMe" />
              <label
                for="remember-me"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
              Remember me
              </label>
            </div>

            <Button
              variant="link"
              class="p-0"
              size="sm"
              @click="isForgotPasswordDialogOpen = true"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            @click="signIn"
            :disabled="isLoading"
          >
            <ReloadIcon v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            Sign in
          </Button>

          <LabeledDivider>or</LabeledDivider>

          <GoogleAuth @authenticated="handleGoogleAuth" />

          <div class="py-4 text-center text-sm text-muted-foreground">
            Don't have an account? <RouterLink  class="underline underline-offset-4 hover:text-primary" :to="registerLinkUrl">Create account.</RouterLink>
          </div>
        </div>
    </div>
  </div>

  <Dialog v-model:open="isForgotPasswordDialogOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Reset password</DialogTitle>
        <DialogDescription>
          Enter the email address you used when you joined and we’ll send you instructions to reset your password.
        </DialogDescription>
      </DialogHeader>

      <Alert v-if=" resetEmailErrorMessage" variant="destructive">
        <AlertDescription>
          {{ resetEmailErrorMessage  }}
        </AlertDescription>
      </Alert>

      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <Input 
            type="email" 
            placeholder="Email" 
            :disabled="isResetEmailSending"
            v-model="resetEmail" 
          />
        </div>
      </div>
      
      <DialogFooter class="sm:justify-end">
        <Button 
          type="button"
          @click="submitResetEmail"
          :disabled="isResetEmailSending"
        >
          <ReloadIcon v-if="isResetEmailSending" class="w-4 h-4 mr-2 animate-spin" />
          Reset
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="isResetPasswordDialogOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Reset password</DialogTitle>
        <DialogDescription>
          Enter your new password
        </DialogDescription>
      </DialogHeader>

      <Alert v-if=" resetPasswordErrorMessage" variant="destructive">
        <AlertDescription>
          {{ resetPasswordErrorMessage  }}
        </AlertDescription>
      </Alert>

      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <Input 
            type="password" 
            placeholder="New password" 
            :disabled="isResetPassworSending"
            v-model="newPassword" 
          />
        </div>
      </div>
      
      <DialogFooter class="sm:justify-end">
        <Button 
          type="button"
          @click="submitPasswordReset"
          :disabled="isResetPassworSending"
        >
          <ReloadIcon v-if="isResetPassworSending" class="w-4 h-4 mr-2 animate-spin" />
          Reset password
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
import GoogleAuth from '@/components/reusable/GoogleAuth.vue';

import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LabeledDivider from '@/components/reusable/LabeledDivider.vue';
import MovingBackground from '@/components/layout/MovingBackground.vue';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-icons/vue'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useToast } from '@/components/ui/toast/use-toast';
import usePasswordReset from '@/composables/usePasswordReset';

// helpers
import authWithCredentials from '@/helpers/authWithCredentials';
import setCookies from '@/helpers/setCookies.js';

export default {
  components: {
    GoogleAuth,
    LabeledDivider,
    MovingBackground,

    Button,
    Alert,
    AlertDescription,
    Input,
    Checkbox,
    ReloadIcon,

    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  },

  setup() {
    const router = useRouter();
    const { query } = useRoute();
    const { toast } = useToast();

    const { 
      isResetEmailSending, 
      resetEmailErrorMessage, 
      sendResetEmail,

      isResetPassworSending,
      resetPasswordErrorMessage,
      resetPassword
    } = usePasswordReset();

    const isForgotPasswordDialogOpen = ref(false);
    const resetEmail = ref('');
    const submitResetEmail = async () => {
      try {
        await sendResetEmail(resetEmail.value);
        isForgotPasswordDialogOpen.value = false;

         toast({
          title: 'Password reset',
          description: 'If your email address exists in our database, you will receive a password recovery email',
        });
      } catch(e) {
        console.debug(e)
      }
    };

    const isResetPasswordDialogOpen = ref(!!query.resetPasswordToken);
    const newPassword = ref('');

    const submitPasswordReset = async () => {
      try {
        await resetPassword(newPassword.value, query.resetPasswordToken);
        isResetPasswordDialogOpen.value = false;

        toast({
          title: 'Password reset',
          description: 'Your password succesfully reset',
        });
      } catch(e) {
        console.debug(e)
      }
    }

    document.title = 'Sign in | iMokhonko';

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
      resetEmail,
      isResetEmailSending, 
      resetEmailErrorMessage,
      isForgotPasswordDialogOpen,
      submitResetEmail,

      newPassword,
      isResetPasswordDialogOpen,
      isResetPassworSending,
      resetPasswordErrorMessage,
      submitPasswordReset,

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
      max-width: 350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 8px;
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
