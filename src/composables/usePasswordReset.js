import { ref } from 'vue';

import services from "../../services.cligenerated.json";

const authApiUrl = `https://${services["auth-api"]}`;

export default () => {
  const isResetEmailSending = ref(false);
  const resetEmailErrorMessage = ref('');

  const isResetPassworSending = ref(false);
  const resetPasswordErrorMessage = ref('');

  const sendResetEmail = async (email = '') => {
    isResetEmailSending.value = true;
    resetEmailErrorMessage.value = '';

    try {
      const normalizedEmail = email.trim();

      if (!normalizedEmail) {
        throw new Error("Email address is required");
      }

      const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailPattern.test(normalizedEmail)) {
        throw new Error("Invalid email format");
      }

      const response = await fetch(
        `${authApiUrl}/reset-password?action=request_password_reset`,
        {
          method: "POST",
          body: JSON.stringify({ email: normalizedEmail }),
        }
      );

      if (response.status !== 200) {
        const { error } = await response.json();
        throw new Error(error ?? "Something went wrong, please try again later");
      }
    } catch (error) {
      resetEmailErrorMessage.value = error.message;
      throw new Error(error.message);
    } finally {
      isResetEmailSending.value = false;
    }
  };

  const resetPassword = async (password, token) => {
    isResetPassworSending.value = true;
    resetPasswordErrorMessage.value = '';

    console.log('password', password);

    try {
      if (!password) {
        throw new Error("New password is required");
      }

      if (password.length < 6) {
        throw new Error("Password length should be at least 6 characters");
      }

      const response = await fetch(
        `${authApiUrl}/reset-password?action=reset_password`,
        {
          method: "POST",
          body: JSON.stringify({ password, token }),
        }
      );

      if (response.status !== 200) {
        const { error } = await response.json();
        throw new Error(error ?? "Something went wrong, please try again later");
      }
    } catch (error) {
      resetPasswordErrorMessage.value = error.message;
      throw new Error(error.message);
    } finally {
      isResetPassworSending.value = false;
    }
  };

  return {
    isResetEmailSending,
    resetEmailErrorMessage,
    sendResetEmail,

    isResetPassworSending,
    resetPasswordErrorMessage,
    resetPassword
  }
}