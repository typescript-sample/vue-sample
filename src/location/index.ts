import { authenticated } from 'uione';
import { RouteRecordRaw } from 'vue-router';
import Layout from '../core/Layout.vue';
import LocationsComponent from './locations-page.vue'
import LocationComponent from './location.vue'
import Review from './location-page/location-review.vue'
import Home from './location-page/location-home.vue'
const locationRouter: RouteRecordRaw = {
  path: '/',
  component: Layout,
  name: 'loca',
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
    { path: 'location', component: LocationsComponent, name: 'location', meta: { title: '', noCache: true } },
    { path: 'location/add', component: LocationComponent, name: 'locationAdd', meta: { title: '', noCache: true } },
    { path: 'location/:id', component: LocationComponent, name: 'locationView', meta: { title: '', noCache: true } },
    { path: 'location/:id/review', component: Review, name: 'review', meta: { title: '', noCache: true } },
    { path: 'location/:id/home', component: Home, name: 'home', meta: { title: '', noCache: true } },
  ]
};

export default locationRouter;
