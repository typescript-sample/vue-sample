import { authenticated } from 'uione';
import { RouteRecordRaw } from 'vue-router';
import Layout from '../core/Layout.vue';
import RoleComponent from './role.vue';
import UsersComponent from './users.vue';
import RolesComponent from './roles.vue';
import UserComponent from './user.vue';
import ArticleComponent from './article.vue';
import ArtilcesComponent from './articles.vue';
import ItemComponent from './item.vue';
import ItemsComponent from './items.vue';
import RoleAssignmentForm from './role-assignment-form.vue'
const adminRouter: RouteRecordRaw = {
  path: '/admin',
  component: Layout,
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
    { path: 'roles/add', component: RoleComponent, name: 'RoleAdd', meta: { title: '', noCache: true } },
    { path: 'roles/assigns/:id', component: RoleAssignmentForm, name: 'RoleAssigns', meta: { title: '', noCache: true } },
    { path: 'roles/:id', component: RoleComponent, name: 'RoleEdit', meta: { title: '', noCache: true } },

    { path: 'articles', component: ArtilcesComponent, name: 'Articles', meta: { title: '', noCache: true } },
    { path: 'articles/add', component: ArticleComponent, name: 'ArticleAdd', meta: { title: '', noCache: true } },
    { path: 'articles/:id', component: ArticleComponent, name: 'ArticleView', meta: { title: '', noCache: true } },

    { path: 'items', component: ItemsComponent, name: 'Items', meta: { title: '', noCache: true } },
    { path: 'items/add', component: ItemComponent, name: 'ItemAdd', meta: { title: '', noCache: true } },
    { path: 'items/:id', component: ItemComponent, name: 'ItemView', meta: { title: '', noCache: true } },
  ]
};

export default adminRouter;
