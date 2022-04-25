import myProfileRouter from '@/my-profile';
import { createRouter, createWebHistory } from 'vue-router';
import adminRouter from '../admin';
import authenRouter from '../authentication';
import NotFound from './NotFound.vue';

const routes = [
    adminRouter,
    authenRouter,
    myProfileRouter
    // { path: '/404', component: NotFound },
    // { path: '/:pathMatch(.*)*', redirect:'/404'},
]
const router = createRouter({
    history:createWebHistory(),
    routes
});

export default router;
  