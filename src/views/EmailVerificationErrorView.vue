<template>
  <div class="email-verification-error-page">
    <ExclamationTriangleIcon class="w-[100px] h-[100px] text-[red]" /> 

    <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">
      Your email is not verified
    </h1>

    <span v-if="message" class="text-sm text-muted-foreground">
      {{ message }}
    </span>

    <Button as-child>
      <RouterLink to="/">
        Sign in
      </RouterLink>
    </Button>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';

import { ExclamationTriangleIcon } from '@radix-icons/vue'
import { Button } from '@/components/ui/button'

export default {
  components: {
    Button,
    ExclamationTriangleIcon
  },

  setup() {
    document.title = 'Email verification error';
    
    const { query } = useRoute();

    return {
      message: query?.message
    }
  },
}
</script>

<style lang="scss" scoped>
.email-verification-error-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: 24px;
  padding: 16px;
  text-align: center;
}
</style>
