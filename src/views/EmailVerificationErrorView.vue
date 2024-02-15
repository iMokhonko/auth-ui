<template>
  <div class="email-verification-error-page">
    <MovingBackground class="email-verification-error-page__bg-container" />

   <div class="email-verification-error-page__container">
      <div class="email-verification-error-page__container-inner">
        <span class="icon">❌</span> {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';

// components
import MovingBackground from '@/components/layout/MovingBackground';

export default {
  components: {
    MovingBackground
  },

  setup() {
    document.title = 'Email verification error | iMokhonko';

    const router = useRouter();
    const { query } = useRoute();

    if(!query?.message) {
      router.push({
        name: 'login',
        query
      });
    }

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

  .header {
    font-size: 24px;
  }

  &__bg-container {
    width: 100%;
    max-width: 500px;
    flex-shrink: 0;
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
      color: #ff5555
    }
  }
}
</style>
