<template>
  <div>
    <vue-final-modal
      v-model="isOpenModel"
      classes="modal-container"
      content-class="modal-content"
    >
      <div class="view-container">
        <header>
          <h2>{{ resource.users_lookup }}</h2>
          <button
            type="button"
            id="btnClose"
            name="btnClose"
            className="btn-close"
            @click="onModelClose"
          />
        </header>
        <div>
          <form
            id="usersLookupForm"
            name="usersLookupForm"
            noValidate="true"
            ref="form"
          >
            <section className="row search-group">
              <label className="col s12 m6 search-input">
                <PageSizeSelect
                  :pageSize="pageSize"
                  :pageSizes="pageSizes"
                  :onPageSizeChanged="pageSizeChanged"
                />
                <input
                  type="text"
                  id="q"
                  name="q"
                  @change="onChangeText"
                  :value="filter.q"
                  maxLength="40"
                  :placeholder="resource.user_lookup"
                />
                <button
                  type="button"
                  :hidden="!filter.userId"
                  class="btn-remove-text"
                  @click="clearUserId"
                />
                <button type="submit" class="btn-search" @click="search" />
              </label>
              <paginateVue
                :items-per-page="pageSize"
                :item-total="itemTotal"
                :margin-pages="pageSize"
                :page-range="pageSize"
                :forcePage="pageIndex"
                :click-handler="pageChanged"
                :page-class="'page-item'"
                :pageLinkClass="'page-link'"
                :container-class="'pagination'"
              ></paginateVue>
            </section>
          </form>
          <form className="list-result">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>{{ resource.sequence }}</th>
                    <th data-field="userId">
                      <button type="button" id="sortUserId" @click="sort">
                        {{ resource.user_id }}
                      </button>
                    </th>
                    <th data-field="username">
                      <button type="button" id="sortUsername" @click="sort">
                        {{ resource.username }}
                      </button>
                    </th>
                    <th data-field="email">
                      <button type="button" id="sortEmail" @click="sort">
                        {{ resource.email }}
                      </button>
                    </th>
                    <th data-field="displayName">
                      <button type="button" id="sortDisplayName" @click="sort">
                        {{ resource.display_name }}
                      </button>
                    </th>
                    <th data-field="status">
                      <button type="button" id="sortStatus" @click="sort">
                        {{ resource.status }}
                      </button>
                    </th>
                    <th data-field="imageURL" hidden="true"></th>
                    <th>{{ resource.action }}</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="list">
                    <template
                      v-for="(user, i) in list.filter(
                        (user) => !users.find((v) => v.userId === user.userId)
                      )"
                      :key="i"
                    >
                      <tr>
                        <td class="text-right">{{ (i = i + 1) }}</td>
                        <td>{{ user.userId }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.displayName }}</td>
                        <td>{{ user.status }}</td>
                        <td>
                          <input
                            type="checkbox"
                            :id="`chkSelect${i}`"
                            :value="user.userId"
                            v-model="userIdsLookup"
                            @change="onCheckUser"
                          />
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
          </form>
        </div>
        <footer>
          <button type="button" @click="onModelSave">
            {{ resource.select }}
          </button>
        </footer>
      </div>
    </vue-final-modal>
  </div>
</template>

<script lang="ts">
import { SearchComponent } from "vuex-one";
import { initForm, inputSearch, storage } from "uione";
import { Options } from "vue-class-component";
import { getUserService, User, UserFilter } from "./service";
import PageSizeSelect from "@/core/PageSizeSelect.vue";
import { PropType } from "@vue/runtime-core";
import { registerEvents } from "ui-plus";
import PaginateVue from "@/core/PaginateVue.vue";

@Options({
  name: "UsersLookup",
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
    isOpenModel: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["onModelClose", "onModelSave"],
  components: {
    PageSizeSelect,
    PaginateVue,
  },
})
export default class UsersLookup extends SearchComponent<User, UserFilter> {
  usersLookup: User[] = [];
  userIdsLookup = [];
  availableUsers: User[] = [];
  index = 0;
  isOpenModel = true;
  created() {
    const userService = getUserService();
    this.onCreated(userService, inputSearch());
  }
  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    this.load(this.createFilter(), storage.autoSearch);
  }

  onChangeText(e: any) {
    this.filter = {
      ...this.filter,
      ...({ [e.target.name]: e.target.value } as any),
    };
  }

  clearUserId = () => {
    const m = this.filter;
    if (m) {
      m.q = "";
      this.filter;
    }
  };
  createFilter(): UserFilter {
    const obj: any = {};
    return obj;
  }
  onCheckUser = (e: any) => {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const result = this.list
      ? this.list.find((v) => v.userId === target.value)
      : undefined;
    if (result) {
      const index = this.usersLookup.indexOf(result);
      if (index !== -1) {
        this.usersLookup.splice(index, 1);
      } else {
        this.usersLookup.push(result);
      }
    }
  };
  onModelSave = () => {
    this.$emit("onModelSave", this.usersLookup);
    this.usersLookup = [];
    this.availableUsers = [];
    if (this.filter) {
      this.filter.q = "";
    }
    this.userIdsLookup = [];
  };

  onModelClose() {
    this.usersLookup = [];
    this.availableUsers = [];
    if (this.filter) {
      this.filter.q = "";
    }
    this.userIdsLookup = [];
    this.$emit("onModelClose");
  }
}
</script>
