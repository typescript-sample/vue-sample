import { authenticated } from "uione";
import { RouteRecordRaw } from "vue-router";
import DefaultWrapper from '../core/DefaultWapper.vue';
import UsersPage from '../profile/users-page.vue'
const profileRouter: RouteRecordRaw = {
    path:'/profile',
    component: DefaultWrapper,
    name: 'admin',
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
    children:[
        {path:'', component:UsersPage, name:'UsersPage', meta: { title: '', noCache: true }},
    ]
}

export default profileRouter;