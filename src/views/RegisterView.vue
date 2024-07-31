<template>
  <div class="auth-page">
    <MovingBackground class="auth-page__bg-container" />

    <div class="auth-page__auth-container">
      <div class="auth-page__auth-container-inner">
        <h1 class="text-2xl font-semibold tracking-tight py-4">
          Create account
        </h1>

        <Alert v-if="errors.unknown" variant="destructive">
          <AlertDescription>
            {{ errors.unknown }}
          </AlertDescription>
        </Alert>

        <div class="row">
          <div>
            <Label 
              for="first-name"
              :class="{ 'text-destructive': !!errors.firstName }"
            >
              First name
            </Label>
            <Input
              id="first-name"
              placeholder="Enter your first name"
              v-model="firstName"
            />
            <span class="text-xs text-destructive">{{ errors.firstName }}</span>
          </div>

          <div>
            <Label 
              for="last-name"
              :class="{ 'text-destructive': !!errors.lastName }"
            >
              Last name
            </Label>
            <Input
              id="last-name"
              placeholder="Enter your last name"
              v-model="lastName"
            />
            <span v-if="!!errors.lastName" class="text-xs text-destructive">{{ errors.lastName }}</span>
          </div>
        </div>

        <div>
          <Label 
            for="username"
            :class="{ 'text-destructive': !!errors.username}"
          >
            Username
          </Label>
          <Input
            id="username"
            placeholder="Enter your username"
            v-model="username"
          />
          <span v-if="!!errors.username" class="text-xs text-destructive">{{ errors.username }}</span>
        </div>

        <div>
          <Label 
            for="email"
            :class="{ 'text-destructive': !!errors.email }"
          >
            Email address
          </Label>
          <Input
            id="email"
            placeholder="Email your email address"
            v-model="email"
          />
          <span v-if="!!errors.email" class="text-xs text-destructive">{{ errors.email }}</span>
        </div>

        <div>
          <Label 
            for="password"
            :class="{ 'text-destructive': !!errors.password }"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            v-model="password"
          />
          <span v-if="!!errors.password" class="text-xs text-destructive">{{ errors.password }}</span>
        </div>

        <Button 
          class="mt-4" 
          :disabled="isLoading"
          @click="signUp"
        >
          <ReloadIcon v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          Create account
        </Button>

        <div class="text-center text-sm text-muted-foreground">
          Already have an account? <RouterLink  class="underline underline-offset-4 hover:text-primary" :to="loginLinkUrl">Sign in.</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// components
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-icons/vue'
import MovingBackground from "@/components/layout/MovingBackground.vue";

import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import services from "../../services.cligenerated.json";

import authWithCredentials from "@/helpers/authWithCredentials";

export default {
  components: {
    MovingBackground,

    Alert,
    AlertDescription,
    Input,
    Label,
    Button,
    ReloadIcon
  },

  setup() {
    document.title = "Create account | iMokhonko";

    const googleAuthResponse = window.GOOGLE_AUTH_RESPONSE;
    const hasGoogleResponseData = !!googleAuthResponse;
    const googleAuthAccessToken = googleAuthResponse?.accessToken ?? null;
    const googleAuthResponseDecodedData = googleAuthResponse?.profile ?? null;

    const router = useRouter();
    const { query } = useRoute();
    const { redirect_url } = query ?? {};

    const authApiUrl = `https://${services["auth-api"]}`;

    const email = ref(googleAuthResponseDecodedData?.email ?? "");
    const username = ref("");
    const password = ref("");
    const firstName = ref(googleAuthResponseDecodedData?.given_name ?? "");
    const lastName = ref(googleAuthResponseDecodedData?.family_name ?? "");

    const errors = ref({});

    const isLoading = ref(false);

    const loginLinkUrl = computed(() =>
      redirect_url ? `/?redirect_url=${redirect_url}` : "/"
    );

    const validateSignUpForm = () => {
      errors.value = {};

      const normalizedFirstName = firstName.value.trim();
      const normalizedLastName = lastName.value.trim();
      const normalizedEmail = email.value.trim();
      const normalizedUsername = username.value.trim();

      if (!normalizedFirstName)
        errors.value.firstName = "This field is required";
      if (!normalizedLastName) errors.value.lastName = "This field is required";

      const usernamePattern = /^[a-zA-z0-9_.]+$/;
      if (!normalizedUsername) errors.value.username = "This field is required";
      if (!usernamePattern.test(normalizedUsername))
        errors.value.username =
          "Username can contain only letters, numbers, underscores and dots";

      const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailPattern.test(normalizedEmail))
        errors.value.email = "Invalid email format";
      if (!normalizedEmail) errors.value.email = "This field is required";

      if (password.value.length < 6)
        errors.value.password = "Password should be longer than 5 characters";
      if (!password.value) errors.value.password = "This field is required";
    };

    const parseApiErrors = (apiErrors = {}) => {
      return Object.entries(apiErrors).reduce(
        (allErrors, [fieldName, errors = []]) => ({
          ...allErrors,
          [fieldName]: errors[0],
        }),
        {}
      );
    };

    const signUp = async () => {
      validateSignUpForm();

      if (Object.keys(errors.value).length) {
        return;
      }

      isLoading.value = true;

      try {
        const normalizedFirstName = firstName.value.trim();
        const normalizedLastName = lastName.value.trim();
        const normalizedEmail = email.value.trim();
        const normalizedUsername = username.value.trim();

        const response = await fetch(`${authApiUrl}/sign-up`, {
          method: "POST",
          body: JSON.stringify({
            email: normalizedEmail,
            username: normalizedUsername,
            password: password.value,
            firstName: normalizedFirstName,
            lastName: normalizedLastName,

            ...(googleAuthAccessToken && { googleAuthAccessToken }),
          }),
        });

        if (response.status === 200) {
          const { isSuccess = false, error: authWithCredentialsError = null } =
            await authWithCredentials({
              login: normalizedUsername,
              password: password.value,
            });

          if (isSuccess) {
            if (redirect_url) {
              window.location = redirect_url;
            }
          } else {
            console.error(authWithCredentialsError);

            router.push({
              name: "login",
              query,
            });
          }
        } else {
          const result = await response.json();

          const apiErrors = parseApiErrors(result.errors);

          errors.value = parseApiErrors(result.errors);
          if (apiErrors.unknown) {
            // show main error
            errors.value = { unknown: errors.value.unknown };
          }
        }
      } catch (e) {
        console.error(e);

        errors.value = {
          unknown: "Something went wrong. Please try again later",
        };
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

      signUp,
    };
  },
};
</script>

<style lang="scss" scoped>
.auth-page {
  width: 100%;
  height: 100%;
  display: flex;

  .row {
    width: 100%;
    display: flex;
    column-gap: 16px;

    & > div {
      flex-grow: 1;
    }
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
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.4);
    background: #fff;
    position: relative;
    padding: 0 16px;

    &-inner {
      max-width: 350px;
      width: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
    }
  }
}
</style>
