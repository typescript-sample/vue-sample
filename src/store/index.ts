import {createStore} from 'vuex'
import { privileges } from './privileges'
export const store = createStore({
    modules:{
        privileges
    }
})