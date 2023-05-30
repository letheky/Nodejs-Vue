import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    meta: { title: 'Main' },
    redirect: '/home',
    component: () => import('@/view/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: 'Home' },
        component: () => import('@/components/Dashboard/Dashboard.vue'),
        children: [],
      },

      {
        path: '/check-your-email',
        name: 'check-your-email',
        meta: { title: 'Check Your Email - CEC App' },
        component: () => import('@/view/CheckYourEmail.vue'),
      },

      {
        path: '/version',
        name: 'version-view',
        meta: { title: 'Version' },
        component: () => import('@/components/ListVersion/ListVersion.vue'),
        children: [],
      },

      {
        path: '/my-profile',
        name: 'my-profile',
        meta: { title: 'My Profile' },
        component: () => import('@/components/MyProfile/MyProfile.vue'),
        children: [],
      },
      {
        path: '/my-profile/edit/:userId',
        name: 'my-profile-edit',
        meta: { title: 'My Profile - Edit' },
        component: () => import('@/components/MyProfile/Edit.vue'),
        children: [],
      },

      {
        path: '/my-profile/change-password',
        name: 'my-profile-change-password',
        meta: { title: 'My Profile - Change Password' },
        component: () => import('@/components/MyProfile/ChangePassword.vue'),
        children: [],
      },
      {
        path: '/my-profile/reset-password',
        name: 'my-profile-reset-password',
        meta: { title: 'My Profile - Reset Password' },
        component: () => import('@/components/MyProfile/ResetPassword.vue'),
        children: [],
      },
      {
        path: '/my-topic/overvie',
        name: 'my-topic',
        meta: { title: 'My Topic - QuangT App' },
        component: () => import('@/components/MyResearch/Overview.vue'),
      },
      {
        path: '/login',
        name: 'my-research',
        meta: { title: 'My Research - QuangT App' },
        component: () => import('@/components/MyTopic/Overview.vue'),
      },
      {
        path: '/account-management',
        name: 'account-management',
        meta: { title: 'Account Management' },
        redirect: '/account-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/account-management/overview',
            name: 'account-management-overview',
            meta: { title: 'Account Management - Over View' },
            component: () => import('@/components/AccountManagement/OverView.vue'),
            children: [],
          },
          {
            path: '/account-management/add-new',
            name: 'account-management-add-new',
            meta: { title: 'Account Management - Add New' },
            component: () => import('@/components/AccountManagement/AddNew.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/topic-management',
        name: 'topic-management',
        meta: { title: 'Topic Management' },
        redirect: '/topic-management/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/topic-management/overview',
            name: 'topic-management-overview',
            meta: { title: 'Topic Management - Over View' },
            component: () => import('@/components/TopicManagement/Overview.vue'),
            children: [],
          },
          {
            path: '/topic-management/add-new',
            name: 'topic-add-new',
            meta: { title: 'Topic Management - Add New' },
            component: () => import('@/components/TopicManagement/addNew.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/research-management',
        name: 'research-management',
        meta: { title: 'Research Management' },
        redirect: '/research-management/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/research-management/overview',
            name: 'research-management-overview',
            meta: { title: 'Research Management - Over View' },
            component: () => import('@/components/ResearchManagement/Overview.vue'),
            children: [],
          },
          {
            path: '/research-management/add-new',
            name: 'research-add-new',
            meta: { title: 'Research Management - Add New' },
            component: () => import('@/components/ResearchManagement/AddNew.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/seminar-management',
        name: 'seminar-management',
        meta: { title: 'Seminar Management' },
        redirect: '/seminar-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/seminar-management/overview',
            name: 'seminar-management-overview',
            meta: { title: 'Seminar Management - Over View' },
            component: () => import('@/components/SeminarManagement/Overview.vue'),
            children: [],
          },
          {
            path: '/seminar-management/add-new',
            name: 'seminar-add-new',
            meta: { title: 'Seminar Management - Add New' },
            component: () => import('@/components/SeminarManagement/AddNew.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/paper-management',
        name: 'paper-management',
        meta: { title: 'Paper Management' },
        redirect: '/paper-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/paper-management/overview',
            name: 'paper-management-overview',
            meta: { title: 'Paper Management - Over View' },
            component: () => import('@/components/PaperManagement/Overview.vue'),
            children: [],
          },
          {
            path: '/paper-management/add-new',
            name: 'paper-add-new',
            meta: { title: 'Paper Management - Add New' },
            component: () => import('@/components/PaperManagement/AddNew.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/circular-management',
        name: 'circular-management',
        meta: { title: 'Circular Management' },
        redirect: '/circular-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/circular-management/overview',
            name: 'circular-management-overview',
            meta: { title: 'Circular Management - Over View' },
            component: () => import('@/components/CircularManagement/Overview.vue'),
            children: [],
          },
          {
            path: '/circular-management/add-new',
            name: 'circular-add-new',
            meta: { title: 'Circular Management - Add New' },
            component: () => import('@/components/CircularManagement/AddNew.vue'),
            children: [],
          },
        ],
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    meta: { title: 'Login - QuangT App' },
    component: () => import('@/view/Login.vue'),
  },

  // {
  //   path: '/change-password',
  //   name: 'change-password',
  //   meta: { title: 'Change Password - QuangT App' },
  //   component: () => import('@/view/ChangePassword.vue'),
  // },
  // {
  //   path: '/signup',
  //   name: 'signup',
  //   meta: { title: 'Sign Up - QuangT App' },
  //   component: () => import('@/view/SignUp.vue'),
  // },
  // {
  //   path: '/forgot-password',
  //   name: 'forgot-password',
  //   meta: { title: 'Forgot Password - QuangT App' },
  //   component: () => import('@/view/ForgotPassword.vue'),
  // },
  // {
  //   path: '/reset-password',
  //   name: 'reset-password',
  //   meta: { title: 'Reset Password - CEC App' },
  //   component: () => import('@/view/ResetPassword.vue'),
  // },
  // {
  //   path: '/not-found',
  //   name: 'not-found',
  //   meta: { title: 'Not Found - CEC App' },
  //   component: () => import('@/components/Error/NotFound.vue'),
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

const DEFAULT_TITLE = 'Research management'
router.beforeEach((to, from, next) => {
  Vue.nextTick(() => {
    document.title = DEFAULT_TITLE
  })

  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {}

  if (to.path === '/home') {
    if (!authRequired && !currentUser) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
