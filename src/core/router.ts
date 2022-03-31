import Vue from 'vue';
import Router, { createRouter, createWebHistory } from 'vue-router';
import adminRouter from '../admin';
import authenRouter from '../authentication';
import NotFound from './NotFound.vue';

const routes = [
    adminRouter,
    authenRouter,
    // { path: '/404', component: NotFound },
    // { path: '*', redirect: '/404' },
]
const router = createRouter({
    history:createWebHistory(),
    routes
});

export default router;
  