import { createRouter, createWebHashHistory } from 'vue-router'
// main app
import HomeView from '../views/HomeView.vue'
import DashBoardView from '../views/campains/DashBoardView.vue'
import CreateTableView from '../views/campains/tablesManagment/CreateTableView.vue'
import EditTableView from '../views/campains/tablesManagment/EditTableView.vue'
import TableView from '../views/campains/tablesManagment/TableView.vue'
import NewCampainView from '../views/campains/campainsManagment/NewCampainView.vue'
import CampainView from '../views/campains/campainsManagment/CampainView.vue'
import CampainEditView from '../views/campains/campainsManagment/CampainEditView.vue'

// auth
import SignupView from '../views/auth/SignupView.vue'
import LoginView from '../views/auth/LoginView.vue'
import SendConfirmationEmailAgainView from '../views/auth/SendConfirmationEmailAgainView.vue'
import ForgottenPasswordView from '../views/auth/ForgottenPasswordView.vue'
import LoginFromEmailView from '../views/auth/LoginFromEmailView.vue'
import AccountView from '../views/auth/AccountView.vue'
import ChangeUsernameView from '../views/auth/ChangeUsernameView.vue'
import ChangePasswordView from '../views/auth/ChangePasswordView.vue'
import ChangeEmailView from '../views/auth/ChangeEmailView.vue'
// store
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
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoardView,
    meta: { requireLogin: true }
  },
  {
    path: '/change_username',
    name: 'change_username',
    component: ChangeUsernameView,
    meta: { requireLogin: true }
  },
  {
    path: '/change_password',
    name: 'change_password',
    component: ChangePasswordView,
    meta: { requireLogin: true }
  },
  {
    path: '/change_email',
    name: 'change_email',
    component: ChangeEmailView,
    meta: { requireLogin: true }
  },
  {
    path: '/create_table',
    name: 'create_table',
    component: CreateTableView,
    meta: { requireLogin: true }
  },
  {
    path: '/edit_table/:id',
    name: 'edit_table',
    component: EditTableView,
    meta: { requireLogin: true }
  },
  {
    path: '/table/:id',
    name: 'table',
    component: TableView,
    meta: { requireLogin: true }
  },
  {
    path: '/campain/',
    name: 'NewCampainView',
    component: NewCampainView,
    meta: { requireLogin: true }
  },
  {
    path: '/campain/:id',
    name: 'CampainView',
    component: CampainView,
    meta: { requireLogin: true }
  },
  {
    path: '/campain/edit/:id',
    name: 'CampainEditView',
    component: CampainEditView,
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
