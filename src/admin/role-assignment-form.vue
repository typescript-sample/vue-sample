<template>
  <div class="view-container">
    <form id="roleAssignmentForm" name="roleAssignmentForm" model-name="role">
      <header>
        <button
          type="button"
          id="btnBack"
          name="btnBack"
          className="btn-back"
          @click="back"
        />
        <h2 v-if="role.roleName && role.roleName.length > 0">
          {{ role.roleName }}
        </h2>
        <h2 v-else>{{ resource.role_assignment_subject }}</h2>
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
              maxLength="255"
              :placeholder="resource.role_id"
              disabled="true"
            />
          </label>
          <label class="col s12 m6">
            {{ resource.role_name }}
            <input
              type="text"
              id="roleName"
              name="roleName"
              v-model="role.roleName"
              maxLength="255"
              :placeholder="resource.role_name"
              disabled="true"
            />
          </label>
        </section>
        <section class="row detail">
          <h4>
            {{ resource.user }}
            <div class="btn-group">
              <button type="button" @click="isOpenModel = true">
                {{ resource.add }}
              </button>
              <button type="button" @click="onShowCheckBox">
                {{ isCheckboxShown ? resource.deselect : resource.select }}
              </button>

              <button v-if="isCheckboxShown" type="button" @click="onCheckAll">
                {{ resource.check_all }}
              </button>
              <button
                v-if="isCheckboxShown"
                type="button"
                @click="onUnCheckAll"
              >
                {{ resource.uncheck_all }}
              </button>
              <button v-if="isCheckboxShown" type="button" @click="onDelete">
                {{ resource.delete }}
              </button>
              <div class="btn-group">
                <button
                  v-if="isTable === true"
                  type="button"
                  id="btnTable"
                  name="btnTable"
                  className="btn-table"
                  data-view="table"
                  @click="changeView"
                />
                <button
                  v-if="isTable !== true"
                  type="button"
                  id="btnListView"
                  name="btnListView"
                  className="btn-list-view"
                  data-view="listview"
                  @Click="changeView"
                />
              </div>
            </div>
          </h4>
          <label className="col s12 search-input">
            <i className="btn-search" />
            <input
              type="text"
              id="q"
              name="q"
              @change="onSearch"
              v-model="q"
              maxLength="40"
              :placeholder="resource.role_assignment_search_user"
            />
          </label>
          <form class="list-result">
            <div class="table-responsive" v-if="isTable">
              <table>
                <thead>
                  <tr>
                    <th>{{ resource.sequence }}</th>
                    <th data-field="userId">
                      <button type="button" id="sortUserId" @click="sort">
                        {{ resource.user_id }}
                      </button>
                    </th>
                    <th data-field="userName">
                      <button type="button" id="sortUsername" @click="sort">
                        {{ resource.username }}
                      </button>
                    </th>
                    <th data-field="status">
                      <button type="button" id="sortStatus" @click="sort">
                        {{ resource.status }}
                      </button>
                    </th>
                    <th className="action">{{ resource.action }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in list" :key="item.roleId">
                    <td class="text-right">{{ item.sequenceNo }}</td>
                    <td>{{ item.roleId }}</td>
                    <td>{{ item.roleName }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                      <button
                        v-if="editable"
                        type="button"
                        class="btn-edit"
                        :id="i"
                        @click="viewRoles(item.roleId)"
                      ></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul class="row list-view" v-else>
              <template v-if="users">
                <li
                  v-for="(user, index) in users"
                  :key="index"
                  class="col s12 m6 l4 xl3"
                  @click="
                    isCheckboxShown === true
                      ? this.onCheck(user.userId)
                      : () => {}
                  "
                >
                  <section>
                    <input
                      v-if="isCheckboxShown === true"
                      type="checkbox"
                      name="selected"
                      :checked="
                        selectedUsers.find((v) => v.userId === user.userId)
                          ? true
                          : false
                      "
                    />
                    <img
                      :src="
                        user.imageURL && user.imageURL.length > 0
                          ? user.imageURL
                          : user.gender === 'F'
                          ? this.femaleIcon
                          : this.maleIcon
                      "
                      class="round-border"
                    />
                    <div>
                      <h3>{{ user.displayName }}</h3>
                      <p>{{ user.email }}</p>
                    </div>
                    <button class="btn-detail" />
                  </section>
                </li>
              </template>
            </ul>
          </form>
        </section>
      </div>
      <footer>
        <button type="submit" id="btnSave" name="btnSave" @click="save">
          {{ resource.save }}
        </button>
      </footer>
    </form>
    <UsersLookup
      :isOpenModel="isOpenModel"
      :users="users"
      @onModelClose="onModelClose"
      @onModelSave="onModelSave"
    />
  </div>
</template>

<script lang="ts">
import { buildId, EditComponent, message } from "../common";
import { confirm, getLocale, storage } from "uione";
import { Options } from "vue-class-component";
import { Role, User, useRole, useUser } from "./service";
import { toast } from "ui-toast";
import { alertError } from "ui-alert";
import UsersLookup from "./users-lookup.vue";
import { clone } from "reflectx";
@Options({
  name: "RoleAssignmentForm",
  components: {
    UsersLookup,
  },
})
export default class RoleAssignmentForm extends EditComponent<Role, string> {
  role: Role = {} as any;
  users: User[] = [];
  q = "";
  isTable = true;

  isOpenModel = false;
  isCheckboxShown = false;
  selectedUsers: User[] = [];
  userService = useUser();
  roleService = useRole();

  femaleIcon: "../../../assets/images/female.png";
  maleIcon: "../../../assets/images/male.png";
  created() {
    this.onCreated(
      this.roleService,
      storage.resource(),
      storage.ui() as any,
      getLocale,
      toast,
      alertError,
      confirm,
      storage.loading()
    );
  }
  mounted() {
    if (this.service.keys) {
      const id = buildId(this.service.keys(), this.$route);
      this.userService.getUsersByRole(id).then((users) => {
        this.users = users;
      });
      this.load(id);
    }
  }
  showModel(obj: Role) {
    if (!obj) return;
    this.role = obj;
  }
  onCheck(userId: string) {
    if (this.users) {
      const user = this.users.find((v) => v.userId === userId);
      if (user) {
        const index = this.selectedUsers.indexOf(user);
        if (index !== -1) {
          this.selectedUsers.splice(index, 1);
        } else {
          this.selectedUsers.push(user);
        }
      }
    }
  }
  onShowCheckBox() {
    if (this.isCheckboxShown === false) {
      this.isCheckboxShown = true;
    } else {
      this.isCheckboxShown = false;
    }
  }
  onCheckAll() {
    if (this.users) {
      this.selectedUsers = [];
      this.users.forEach((element) => {
        this.selectedUsers.push(element);
      });
    }
  }
  getModel(): Role {
    const obj = clone(this.role);
    return obj;
  }
  getIds = (users?: User[]): string[] => {
    return users ? users.map((item) => item.userId) : [];
  };
  save(e: any) {
    e.preventDefault();
    const userIDs = this.getIds(this.users);
    const msg = message(
      this.resource,
      "msg_confirm_save",
      "confirm",
      "yes",
      "no"
    );
    confirm(
      msg.message,
      msg.title as any,
      () => {
        this.roleService
          .assign(this.role.roleId, userIDs)
          .then((result) => {
            this.showMessage(this.resource.msg_save_success);
          })
          .catch((error) => this.handleError(error));
      },
      msg.no,
      msg.yes
    );
  }
  onUnCheckAll() {
    this.selectedUsers = [];
  }
  onDelete() {
    confirm(this.resource.msg_confirm_delete, this.resource.confirm, () => {
      const arr: User[] = [];
      this.users.map((value) => {
        const user = this.selectedUsers.find((v) => v.userId === value.userId);
        if (!user) {
          arr.push(value);
        }
      });
      this.users = arr;
      this.selectedUsers = [];
      this.isCheckboxShown = false;
    });
  }
  onSearch(e: any) {
    if (this.users) {
      const v = e.target.value;
      const result = this.users.filter(
        (u) =>
          (u.username && u.username.includes(v)) ||
          (u.displayName && u.displayName.includes(v)) ||
          (u.email && u.email.includes(v))
      );
      const obj = { [e.target.name]: e.target.value, users: result } as any;
      console.log(obj);

      const keys = Object.keys(obj);
      keys.forEach((key) => {
        this[key] = obj[key];
      });
    }
  }
  changeView() {
    this.isTable = !this.isTable;
  }
  onModelClose(e: any) {
    this.isOpenModel = false;
  }
  onModelSave(users: User[]) {
    users.forEach((item) => {
      this.users.push(item);
    });
    this.isOpenModel = false;
  }
}
</script>

<style>
</style>