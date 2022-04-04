import { createApp } from 'vue'
import App from './App.vue'
import router from './core/router'
import {store} from './store'
import  vfmPlugin  from "vue-final-modal";

createApp(App).use(router).use(store).use(vfmPlugin).mount('#app')
