import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  },
  {
    path: '/sign-up',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/RegisterView.vue')
  },
  {
    path: '/email-verification-success-page',
    name: 'email-verification-success-view',
    component: () => import(/* webpackChunkName: "email-verification-success-view" */ '../views/EmailVerificationSuccessView.vue')
  },
  {
    path: '/email-verification-error-page',
    name: 'email-verification-error-view',
    component: () => import(/* webpackChunkName: "email-verification-error-view" */ '../views/EmailVerificationErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
