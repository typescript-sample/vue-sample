import { createApp } from 'vue'
import App from './App.vue'
import router from './core/router'
import {store} from './store'
import vfmPlugin  from "vue-final-modal";
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { MapsPlugin, MapsComponent, Annotations } from '@syncfusion/ej2-vue-maps';


createApp(App)
.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyD07GxVWJhjALJsdlwPbDpvVpUiyG3b3IA',
    },
})
.use(MapsPlugin)
.use(router)
.use(store)
.use(vfmPlugin).mount('#app')
