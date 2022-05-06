import { RouteRecordRaw } from "vue-router";

import AuthenComponent from '../authentication/authen.vue';
import SigninComponent from '../authentication/Signin.vue';
import WelcomeComponent from '../authentication/Welcome.vue';
const authenRouter: RouteRecordRaw = {
  path: '/',
  component: AuthenComponent,
  children: [
    { path: 'welcome', component: WelcomeComponent, name: 'welcome', meta: { title: 'Welcome', noCache: true } },
    { path: '/', component: SigninComponent, name: 'Login', meta: { title: '', noCache: true } },
  ]
}

export default authenRouter;