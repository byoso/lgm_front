import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotebooksView from '../views/campains/NotebooksView.vue'
import SignupView from '../views/auth/SignupView.vue'
import LoginView from '../views/auth/LoginView.vue'
import SendConfirmationEmailAgainView from '../views/auth/SendConfirmationEmailAgainView.vue'
import ForgottenPasswordView from '../views/auth/ForgottenPasswordView.vue'
import LoginFromEmailView from '../views/auth/LoginFromEmailView.vue'
import AccountView from '../views/auth/AccountView.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/send_confirmation_email_again',
    name: 'send_confirmation_email_again',
    component: SendConfirmationEmailAgainView,
  },
  {
    path: '/forgotten_password',
    name: 'forgotten_password',
    component: ForgottenPasswordView,
  },
  {
    path: '/login_from_email/:token',
    name: 'login_from_email',
    component: LoginFromEmailView,
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { requireLogin: true }
  },
  {
    path: '/notebooks',
    name: 'notebooks',
    component: NotebooksView,
    meta: { requireLogin: true }


  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


// if a record requires login and user is not logged in:
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin) && !store.state.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
