<template>
  <div class="view-container">
    <header>
      <h2>{{ resource.role_list }}</h2>
      <div class="btn-group">
        <button
          v-if="view !== 'table'"
          type="button"
          id="btnTable"
          name="btnTable"
          class="btn-table"
          data-view="table"
          @click="changeView"
        />
        <button
          v-if="view === 'table'"
          type="button"
          id="btnListView"
          name="btnListView"
          class="btn-list-view"
          data-view="listview"
          @Click="changeView"
        />
        <button
          v-if="addable"
          type="button"
          id="btnNew"
          name="btnNew"
          class="btn-new"
          @click="addRole"
        />
      </div>
    </header>
    <div>
      <form id="rolesForm" name="rolesForm" :novalidate="true" ref="form">
        <section class="row search-group">
          <label class="col s12 m6 search-input">
            <PageSizeSelect
              :pageSize="pageSize"
              :pageSizes="pageSizes"
              :onPageSizeChanged="pageSizeChanged"
            />
            <input
              type="text"
              id="q"
              name="q"
              v-model="filter.q"
              maxLength="255"
              :placeholder="resource.keyword"
            />
            <button
              type="button"
              :hidden="!filter.q || filter.q.length === 0"
              class="btn-remove-text"
              @click="clearKeyworkOnClick"
            />
            <button type="button" class="btn-filter" @click="toggleFilter" />
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
        <section class="row search-group inline" :hidden="hideFilter">
          <label class="col s12 m4 l4">
            {{ resource.role_name }}
            <input
              type="text"
              id="roleName"
              name="roleName"
              v-model="filter.roleName"
              maxlength="255"
              :placeholder="resource.role_name"
            />
          </label>

          <label class="col s12 m4 l4 checkbox-section">
            {{ resource.status }}
            <section class="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  id="A"
                  name="status"
                  value="A"
                  @change="updateState"
                  checked="A"
                />
                {{ resource.active }}
              </label>
              <label>
                <input
                  type="checkbox"
                  id="I"
                  name="status"
                  value="I"
                  @change="updateState"
                  checked="I"
                />
                {{ resource.inactive }}
              </label>
            </section>
          </label>
        </section>
        <!-- <section class="btn-group">
          <label>
            {{ resource.page_size }}
            <select @change="onPageSizeChanged">
              <option
                v-for="p of pageSizes"
                :value="p"
                :selected="p === pageSize"
                :key="p"
              >
                {{ p }}
              </option>
            </select>
          </label>
          <button type="submit" class="btn-search" @click="search">{{resource.search}}</button>
        </section> -->
      </form>
      <form class="list-result">
        <div class="table-responsive" v-if="view === 'table'">
          <table>
            <thead>
              <tr>
                <th>{{ resource.sequence }}</th>
                <th data-field="roleId">
                  <button type="button" id="sortUserId" @click="sort">
                    {{ resource.role_id }}
                  </button>
                </th>
                <th data-field="roleName">
                  <button type="button" id="sortUsername" @click="sort">
                    {{ resource.role_name }}
                  </button>
                </th>
                <th data-field="status">
                  <button type="button" id="sortStatus" @click="sort">
                    {{ resource.status }}
                  </button>
                </th>
                <th class="action">{{ resource.action }}</th>
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
          <li v-for="(item, i) in list" :key="{ i }" class="col s12 m6 l4 xl3">
            <section>
              <div>
                <h3 class="item.status === 'I' ? 'inactive' : ''">
                  {{ item.roleName }}
                </h3>
                <p>{{ item.remark }}</p>
              </div>
              <button
                class="btn-detail"
                v-if="editable"
                @click="viewRoles(item.roleId)"
              />
            </section>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { initForm, inputSearch, registerEvents } from "uione";
import { Options } from "vue-class-component";
import { buildFromUrl, navigate, SearchComponent } from "vuex-one";
import { Role, RoleFilter } from "./service/role";
import PaginateVue from "../core/PaginateVue.vue";
import { getRoleService } from "./service";
import PageSizeSelect from "../core/PageSizeSelect.vue";

@Options({
  components: { PaginateVue, PageSizeSelect },
})
export default class RolesComponent extends SearchComponent<Role, RoleFilter> {
  status = [];
  statusList = [];
  isTable = true;
  viewable = true;
  editable = true;
  list = [];
  hideFilter = true;
  view = "listview";
  created() {
    const roleService = getRoleService();
    this.onCreated(roleService, inputSearch());
  }
  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    const s = this.mergeFilter(buildFromUrl(), ["status"]);
    this.load(s, true);
  }

  getFilter(): RoleFilter {
    const model = super.getFilter();
    return model;
  }

  viewRoles(id: string) {
    navigate(this.$router, "/admin/roles", [id]);
  }
  addRole() {
    navigate(this.$router, "/admin/roles/add");
  }

  clearKeyworkOnClick() {
    if (this.filter) {
      this.filter.q = "";
    }
  }
}
</script>

<style>
</style>