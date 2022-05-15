import { authenticated } from "uione";
import { RouteRecordRaw } from "vue-router";
import Layout from '../core/Layout.vue';
import UsersPage from '../profile/users-page.vue';
import UserPage from '../profile/user-page.vue';
const profileRouter: RouteRecordRaw = {
  path: '/profile',
  component: Layout,
  name: 'profile',
  meta: {
    title: '',
    icon: ''
  },
  beforeEnter: (to, from, next) => {
    if (!authenticated()) {
      next({ name: 'Login' });
    }
    next();
  },
  children: [
    { path: '', component: UsersPage, name: 'UsersPage', meta: { title: '', noCache: true } },
    { path: ':id', component: UserPage, name: 'UserPage', meta: { title: '', noCache: true } },
  ]
}

export default profileRouter;