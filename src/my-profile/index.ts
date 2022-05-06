import { authenticated } from "uione";
import { RouteRecordRaw } from "vue-router";
import DefaultWapper from '../core/DefaultWapper.vue'
import MyProfileComponent from '../my-profile/my-profile-form.vue'
import MySettingsComponent from '../my-profile/my-settings-form.vue'
const myProfileRouter: RouteRecordRaw = {
  path: '/',
  component: DefaultWapper,
  name: 'my-profile',
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
    { path: 'my-profile', component: MyProfileComponent, name: 'MyProfile', meta: { title: '', noCache: true } },
    { path: 'my-profile/settings', component: MySettingsComponent, name: 'MySettings', meta: { title: '', noCache: true } }
  ]
};
export default myProfileRouter;