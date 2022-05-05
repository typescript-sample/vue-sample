
// <template>
//         <div v-if="!modules || modules.length === 0"></div>
//         <privileges-item v-else v-for="m in modules" :roles="roles" :m="m" :parentId="parentId" :disableds="disableds" :allPrivilege="allPrivilege" :key="m.id" />
// </template>
// <script lang="ts">
import { defineComponent, PropType } from "vue"
import { Privilege, Role } from "../../service";
import { PrivilegesItem } from "./PrivilegesItem";
// import { Options, Vue } from "vue-class-component"
// import PrivilegesItem from './PrivilegesItem.vue'
// @Options({
//     name:"PrivilegesForm",
//     components:{
//         PrivilegesItem 
//     },
//     props:{
//         roles:{
//             required:true
//         },
//         modules:{
//             reqired:true
//         },
//         parentId:{
//             required:true
//         },
//         disableds:{
//             required:true
//         },
//         allPrivilege:{
//             required:true
//         }
//     }

// })
// export default class PrivilegesForm extends Vue{
// roles: Role; 
// modules: Privilege[]|undefined; 
// parentId: string; 
// disableds: boolean; 
// allPrivilege: Privilege[];

// }

// </script>


export const PrivilegesForm:any = defineComponent({
    name: "PrivilegesForm",
    components: {
        PrivilegesItem,
    },
    props: {
        roles: {
            type: Object as PropType<Role>,
            required: true
        },
        modules: {
            type: Array as PropType<Privilege[] | undefined>,
            required: true
        },
        parentId: {
            type: String,
            required: true
        },
        disableds: {
            type: Boolean,
            required: true
        },
        allPrivilege: {
            type: Array as PropType<Privilege[]>,
            required: true
        }
    },

    render() {
        
        if (!this.modules || this.modules.length === 0) {
            return "";
        }
        return (
            <>   
                {this.modules.map(m => {
                    return <privileges-item roles={this.roles} m={m} parentId={this.parentId} disableds={this.disableds} allPrivilege={this.allPrivilege} key={m.id} />
                })}

            </>
        )
    }
})