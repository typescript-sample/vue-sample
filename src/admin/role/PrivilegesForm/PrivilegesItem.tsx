import { defineComponent, PropType, reactive } from "vue";
import { useStore } from "vuex";
import { Privilege, Role } from "../../service";
import { PrivilegesForm } from "../PrivilegesForm";
{/* <template>
  <section
    class="col s12"
    v-if="m.children && m.children.length > 0"
  >
    <label class="checkbox-container">
      <input
        type="checkbox"
        name="modules"
        :disabled="disableds"
        :data-id="m.id"
        data-type="parent"
        :checked="checked"
        onChange="handleCheck"
      />
      {{ m.name }}
    </label>
    <section class="row checkbox-group">
      <PrivilegesForm :roles="roles" :modules="m.children" :parentId="m.id" :disableds="disableds" :allPrivilege="allPrivilege"/>
    </section>
    <hr />
  </section>
  <section v-else class="col s12 m4 l3" :key="m.id">
    <label class="checkbox-container">
      <input type='checkbox' name='modules' :data-id="m.id"
      :data-parent="parentId" :checked="roles.privileges ?
      (roles.privileges.find(item => item === m.id) ? true : false) : false"
      onChange="handleCheck" /> {{m.name}}
    </label>
  </section> 
  <div></div>
</template> */}

// <script lang="ts">
// import { Options, Vue } from "vue-class-component";
// import { Privilege, Role } from "../../service";
// import PrivilegesForm from '../PrivilegesForm';

// @Options({
//     name: "PrivilegesItem",
//     components:{
//         PrivilegesForm
//     },
//   props: {
//     roles: {
//       required: true,
//     },
//     m: {
//       required: true,
//     },
//     parentId: {
//       required: true,
//     },
//     disableds: {
//       required: true,
//     },
//     allPrivilege: {
//       required: true,
//     },
//   },
// })
// export default class PrivilegesItem extends Vue {
//   roles: Role;
//   m: Privilege;
//   parentId: string;
//   disableds: boolean;
//   allPrivilege: Privilege[];

//   containOne = (privileges?: string[], all?: Privilege[]): boolean => {

//     if (!privileges || privileges.length === 0 || !all || all.length === 0) {
//       return false;
//     }
//     for (const m of all) {
//       if (privileges.includes(m.id)) {
//         return true;
//       }
//     }
//     return false;
//   };
//   created() {
//     const checked = this.containOne(this.roles.privileges, this.allPrivilege);
//   }
// }
// </script>

export const PrivilegesItem: any = defineComponent({
  name: "PrivilegesItem",

  components: {
    PrivilegesForm
  },
  props: {
    roles: {
      required: true,
      type: Object as PropType<Role>,

    },
    m: {
      required: true,
      type: Object as PropType<Privilege>
    },
    parentId: {
      required: true,
      type: String
    },
    disableds: {
      required: true,
      type: Boolean
    },
    allPrivilege: {
      required: true,
      type: Array as PropType<Privilege[]>
    },
  },

  setup() {
    const state = reactive({
      checked: false
    });

    const containOne = (privileges?: string[], all?: Privilege[]): boolean => {

      if (!privileges || privileges.length === 0 || !all || all.length === 0) {
        return false;
      }
      for (const m of all) {
        if (privileges.includes(m.id)) {          
          return true;
        }
      }
      return false;
    }
    const store = useStore();
    const handleCheck = (event: any) => {

      // event.persist();
      const target = event.target;
      const id = target.getAttribute('data-id');
      const type = target.getAttribute('data-type');
      store.commit("updatePickPrivilege", { type, id });
    }

    return {
      state,
      containOne,
      handleCheck
    }
  },
  render() {

    if (this.m.children && this.m.children.length > 0) {
      this.state.checked = this.containOne(this.roles.privileges, this.m.children);

      return (
        <section
          class="col s12"
          key={this.m.id}
        >
          <label class="checkbox-container">
            <input
              type="checkbox"
              name="modules"
              disabled={this.disableds}
              data-id={this.m.id}
              data-type="parent"
              checked={this.state.checked}
              onChange={this.handleCheck}
            />
            {this.m.name}
          </label>
          <section class="row checkbox-group">
            <PrivilegesForm roles={this.roles} modules={this.m.children} parentId={this.m.id} disableds={this.disableds} allPrivilege={this.allPrivilege} />

          </section>
          <hr />
        </section>
      )
    }
    else {
      return (
        <>
          <section class="col s12 m4 l3" key={this.m.id}>
            <label class="checkbox-container">
              <input type='checkbox' name='modules' data-id={this.m.id} onChange={this.handleCheck}
                data-type={this.parentId} checked={this.roles.privileges ? (this.roles.privileges.find(item => item === this.m.id) ? true : false) : false}
              /> {this.m.name}
            </label>
          </section> </>
      )
    }
  }
})
