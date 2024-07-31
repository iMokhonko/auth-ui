<template>
  <Button variant="outline" @click="signIn">
    <div class="google-auth-button__label">
      <div class="google-auth-button__icon" />
      Sign In with Google
    </div>
  </Button>
</template>

<script>
import { Button } from '@/components/ui/button'

import services from "../../../services.cligenerated.json";

export default {
  emits: ["authenticated"],

  components: {
    Button,
  },

  methods: {
    signIn() {
      const popupWindow = window.open(
        `https://${services["auth-api"]}/sign-in?type=google`,
        "Sign in to iMokhonko",
        "height=600,width=600"
      );

      const handleAuthMesage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type !== "google-auth:success") {
            return;
          }

          this.$emit("authenticated", data?.payload ?? {});

          popupWindow?.close();
          window.removeEventListener("message", handleAuthMesage, false);
        } catch (e) {
          // console.error(e);
        }
      };

      window.addEventListener("message", handleAuthMesage, false);
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
    column-gap: 8px;
  }

  &__icon {
    width: 16px;
    height: 16px;
    overflow: hidden;
    background: url("@/assets/icons/google.webp");
    background-size: 100%;
  }
}
</style>
