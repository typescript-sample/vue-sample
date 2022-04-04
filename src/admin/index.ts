import { authenticated } from 'uione';
import { RouteRecordRaw } from 'vue-router';
import DefaultWapper from '../core/DefaultWapper.vue';
import RoleComponent from './role.vue';
import UsersComponent from './users.vue';
import RolesComponent from './roles.vue';
import UserComponent from './user.vue';
import RoleAssignmentForm from './role-assignment-form.vue'
const adminRouter: RouteRecordRaw = {
  path: '/admin',
  component: DefaultWapper,
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
  children: [
    { path: 'users', component: UsersComponent, name: 'Users', meta: { title: '', noCache: true } },
    { path: 'users/add', component: UserComponent, name: 'UserAdd', meta: { title: '', noCache: true } },
    { path: 'users/:id', component: UserComponent, name: 'UserView', meta: { title: '', noCache: true } },

    { path: 'roles', component: RolesComponent, name: 'Roles', meta: { title: '', noCache: true } },
    {path:'roles/add', component: RoleComponent, name: 'RoleAdd', meta: { title: '', noCache: true }},
    {path:'roles/assigns/:id', component: RoleAssignmentForm, name: 'RoleAssigns', meta: { title: '', noCache: true }},
    {path:'roles/:id', component: RoleComponent, name: 'RoleEdit', meta: { title: '', noCache: true }},
  ]
};

export default adminRouter;
