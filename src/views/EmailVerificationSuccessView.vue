<template>
  <div class="email-verification-success-page">
    <CheckCircledIcon class="w-[100px] h-[100px] text-[green]" /> 

    <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">
      Your email is verified
    </h1>

    <span class="text-sm text-muted-foreground">
      Thank you for confirming your email address. Your account is now successfully verified. Welcome aboard!
    </span>

    <Button as-child>
      <RouterLink to="/">
        Sign in
      </RouterLink>
    </Button>
  </div>
</template>

<script>
import { Button } from '@/components/ui/button'
import { CheckCircledIcon } from '@radix-icons/vue'

export default {
  components: {
    Button,
    CheckCircledIcon
  },

  setup() {
    document.title = 'Email verified';
  },
}
</script>

<style lang="scss" scoped>
.email-verification-success-page {
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
