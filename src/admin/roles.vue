<template>
  <div class="view-container">
    <header>
      <h2>{{ resource.role_list }}</h2>
      <div className="btn-group">
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
        <button
          v-if="addable"
          type="button"
          id="btnNew"
          name="btnNew"
          className="btn-new"
          @click="addRole"
        />
      </div>
    </header>
    <div>
      <form id="rolesForm" name="rolesForm" :novalidate="true" ref="form">
        <section className="row search-group">
          <label className="col s12 m6 search-input">
            <PageSizeSelect :pageSize="pageSize" :pageSizes="pageSizes" :onPageSizeChanged="pageSizeChanged" />
            <input
              type="text"
              id="q"
              name="q"
              :value="model.q"
              @change="updateState"
              maxLength="255"
              :placeholder="resource.keyword"
            />
            <button
              type="button"
              className="btn-filter"
              @click="toggleFilter"
            />
            <button
              type="submit"
              className="btn-search"
              @click="search"
            />
          </label>        
          <!-- <Pagination className='col s12 m6' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} /> -->
        </section>
        <section class="row search-group inline" :hidden="hideFilter">
          <label class="col s12 m4 l4">
            {{ resource.role_name }}
            <input
              type="text"
              id="roleName"
              name="roleName"
              v-model="model.roleName"
              maxlength="255"
              :placeholder="resource.role_name"
            />
          </label>

          <label class="col s12 m4 l4">
            {{ resource.status }}
            <section
              class="checkbox-group"
              v-for="ctrlItem in statusList"
              :key="ctrlItem.value"
            >
              <label>
                <input
                  type="checkbox"
                  :id="ctrlItem.value"
                  name="status"
                  :value="ctrlItem.value"
                  @change="updateState"
                  :checked="ctrlItem.value"
                />
                {{ ctrlItem.text }}
              </label>
            </section>
          </label>
        </section>
        <section class="btn-group">
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
          <!-- <button type="submit" class="btn-search" @click="search">{{resource.search}}</button> -->
        </section>
      </form>
      <form class="list-result">
        <div class="table-responsive" v-if="isTable">
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
        <nav class="col s12 m6 l6">
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
        </nav>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { alertError } from "ui-alert";
import { registerEvents } from "ui-plus";
import { toast } from "ui-toast";
import { getLocale, initForm, privileges, storage } from "uione";
import { Options } from "vue-class-component";
import { buildFromUrl, navigate, SearchComponent } from "../common";
import { Role, RoleFilter } from "./service/role";
import PaginateVue from "../core/PaginateVue.vue";
import { useMasterData, useRole } from "./service";
import PageSizeSelect from "../core/PageSizeSelect.vue"
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
  hideFilter=false;
  //   privilegesList=[];
  created() {
    const roleService = useRole();
    this.onCreated(
      roleService,
      storage.resource(),
      storage.ui(),
      getLocale,
      toast,
      alertError,
      storage.loading()
    );
  }
  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    const s = this.mergeFilter(buildFromUrl(), ["status"]);
    this.init(s, true);
  }

  init(s: RoleFilter, auto: boolean) {
    const com = this;
    const masterDataService = useMasterData();
    // const roleService = useRole();
    masterDataService
      .getStatus()
      .then((statusList) => {
        com.statusList = statusList;
        com.load(s, auto);
      })
      .catch(com.handleError);
    // roleService.getRoles().then((list) => {
    //   this.list = list;
    // });
  }

  changeView() {
    this.isTable = !this.isTable;
    console.log(this.isTable);
  }
  getSearchModel(): RoleFilter {
    const model = this.populateFilter();
    return model;
  }

  viewRoles(id) {
    navigate(this.$router, "roles", [id]);
  }
  addRole() {
    navigate(this.$router, "/admin/roles/add");
  }
}
</script>

<style>
</style>