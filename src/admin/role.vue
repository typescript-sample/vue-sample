<script lang="ts">
import { initForm, inputEdit, Privilege, registerEvents } from "uione";
import { Options } from "vue-class-component";
import { buildId, clone, createModel, EditComponent, navigate } from "../common";
import { getMasterData, getRoleService, Role } from "./service";
import { PrivilegesForm } from "./role/PrivilegesForm";
import { useStore } from "vuex";
@Options({
  components: {
    PrivilegesForm,
  },
})
export default class RoleComponent extends EditComponent<Role, string> {
  store = useStore();
  statusList = [];
  checkedCtrl: string[] = [];
  role: Role = {} as any;
  all: string[] = [];
  keyword = "";
  shownPrivileges: Privilege[] = [];
  allPrivilege: Privilege[] = [];
  checkedAll: boolean | undefined = false;
  created() {
    this.checkedCtrl = [];
    const editParams = inputEdit() as any;
    const roleService = getRoleService();
    this.onCreated(roleService, inputEdit());
    this.patchable = false;
    roleService.getPrivileges().then((allPrivilege) => {
      this.buildAll(this.all, allPrivilege);
      this.shownPrivileges = allPrivilege;
      this.allPrivilege = allPrivilege;
    });

    this.$watch("pickPrivileges", () => {
      this.role.privileges = this.buildPrivileges(
        this.pickPrivileges.id,
        this.pickPrivileges.type,
        this.role.privileges ? this.role.privileges : [],
        this.allPrivilege
      );
      this.isCheckedAll(this.role.privileges, this.all);
    });
  }
  assign(roleId: string) {
    navigate(this.$router, `/admin/roles/assigns/${roleId}`);
  }
  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
      const id = buildId(['roleId'], this.$route);
      // const id = this.$route.params.id as string;
      this.load(id, this.formatModel);
  }
  createModel(): Role {
    const role = createModel<Role>(this.metadata);
    role.status = "A";
    return role;
  }
  getModel(): Role {
    const obj = clone(this.role);
    return obj;
  }
  showModel(obj: Role) {
    if (!obj) {
      return;
    }
    if (!obj.privileges) {
      obj.privileges = [];
    } else {
      obj.privileges = obj.privileges.map((p) => p.split(" ", 1)[0]);
    }
    this.role = obj;
    this.isCheckedAll(this.role.privileges, this.all);
  }
  isCheckedAll = (privileges: string[] | undefined, all: string[]) => {
    this.checkedAll =
      privileges && all && privileges.length === this.all.length;
  };
  handleCheckAll = (event: any) => {
    this.checkedAll = event.target.checked;
    this.role.privileges = this.checkedAll ? this.all : [];
  };
  buildAll = (privileges: string[], all: Privilege[]): void => {
    for (const root of all) {
      if (root.id) {
        privileges.push(root.id);
        if (root.children && root.children.length > 0) {
          this.buildAll(privileges, root.children);
        }
      }
    }
  };
  getPrivilege = (id: string, all: Privilege[]): Privilege | undefined => {
    if (!all || !id) {
      return undefined;
    }
    for (const root of all) {
      if (root.id === id) {
        return root;
      }
      if (root.children && root.children.length > 0) {
        const m = this.getPrivilege(id, root.children);
        if (m) {
          return m;
        }
      }
    }
    return undefined;
  };
  buildShownModules = (keyword: string, allPrivileges: Privilege[]) => {
    if (!keyword || keyword === "") {
      return allPrivileges;
    }
    const w = keyword.toLowerCase();
    const shownPrivileges = allPrivileges
      .map((parent) => {
        const parentCopy = Object.assign({}, parent);
        if (parentCopy.children) {
          parentCopy.children = parentCopy.children.filter((child) =>
            child.name.toLowerCase().includes(w)
          );
        }
        return parentCopy;
      })
      .filter(
        (item) =>
          (item.children && item.children.length > 0) ||
          item.name.toLowerCase().includes(w)
      );
    return shownPrivileges;
  };
  get pickPrivileges() {
    return this.store.getters.pick;
  }
  onChange = (e: any) => {
    e.preventDefault();
    this.shownPrivileges = this.buildShownModules(
      this.keyword,
      this.allPrivilege
    );
  };
  containOne = (privileges?: string[], all?: Privilege[]): boolean => {
    if (!privileges || privileges.length === 0 || !all || all.length === 0) {
      return false;
    }
    for (const m of all) {
      if (privileges.includes(m.id as any)) {
        return true;
      }
    }
    return false;
  };
  buildPrivileges = (
    id: string,
    type: string,
    privileges: string[],
    all: Privilege[]
  ): string[] => {
    if (type === "parent") {
      const parent = this.getPrivilege(id, all);
      if (parent && parent.children) {
        const ids = parent.children.map((i) => i.id);
        const ms = privileges.filter((i) => !ids.includes(i));
        if (this.containOne(privileges, parent.children)) {
          return ms;
        } else {
          return ms.concat(parent.children.map((i) => i.id as any));
        }
      } else {
        return [];
      }
    } else {
      let checked = true;
      if (privileges && privileges.length > 0) {
        const m = privileges.find((item) => item === id);
        checked = m != null;
      } else {
        checked = false;
      }
      if (!checked) {
        return privileges.concat([id]);
      } else {
        return privileges.filter((item) => item !== id);
      }
    }
  };
}
</script>
<template>
  <div class="view-container">
    <form id="roleForm" name="roleForm" ref="form">
      <header>
        <button type="button" class="btn-back" @click="back(event)"></button>
        <h2>
          {{ newMode ? resource.button_create : resource.button_edit }}
          {{ resource.role }}
        </h2>
        <button class="btn-group btn-right">
          <i @click="assign(this.role.roleId)" class="material-icons">group</i>
        </button>
      </header>
      <div>
        <section class="row">
          <label class="col s12 m6">
            {{ resource.role_id }}
            <input
              type="text"
              id="roleId"
              name="roleId"
              v-model="role.roleId"
              @change="updateState"
              maxlength="40"
              :required="true"
              :placeholder="resource.user_id"
            />
          </label>
          <label class="col s12 m6">
            {{ resource.role_name }}
            <input
              type="text"
              id="roleName"
              name="roleName"
              v-model="role.roleName"
              maxlength="50"
              :required="true"
              :placeholder="resource.role_name"
            />
          </label>
          <label className="col s12 m6">
            {{ resource.remark }}
            <input
              type="text"
              id="remark"
              name="remark"
              @change="updateState"
              maxLength="255"
              v-model="role.remark"
              :placeholder="resource.remark"
            />
          </label>
          <label className="col s12 m6 radio-section">
            {{ resource.status }}
            <div class="radio-group">
              <label>
                <input
                  type="radio"
                  id="active"
                  name="status"
                  value="A"
                  v-model="role.status"
                  @change="updateState"
                  :checked="role.status === 'A'"
                />
                {{ resource.yes }}
              </label>
              <label>
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  value="I"
                  @change="updateState"
                  v-model="role.status"
                  :checked="role.status === 'I'"
                />
                {{ resource.no }}
              </label>
            </div>
          </label>
        </section>
        <h4>
          <label>
            <input
              type="checkbox"
              value="all"
              :disabled="keyword !== ''"
              data-type="all"
              :checked="checkedAll"
              @change="handleCheckAll"
            />
            {{ resource.all_privileges }}
          </label>
          <label className="col s12 search-input">
            <i className="btn-search" />
            <input
              type="text"
              id="keyword"
              name="keyword"
              maxLength="40"
              :placeholder="resource.role_filter_modules"
              v-model="keyword"
              @change="onChange"
            />
          </label>
        </h4>
        <section className="row hr-height-1">
          <privileges-form
            :roles="role"
            :modules="shownPrivileges"
            parentId=""
            :disableds="keyword !== ''"
            :allPrivilege="allPrivilege"
          />
        </section>
      </div>
      <footer>
        <button type="submit" id="btnSave" name="btnSave" @click="save">
          {{ resource.save }}
        </button>
      </footer>
    </form>
  </div>
</template>
