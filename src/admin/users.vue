<template>
  <div class="view-container">
    <header>
      <h2>{{resource.users_list}}</h2>
      <button type="button" class="btn-new" id="btnNew" @click="addUser"></button>
    </header>
    <div>
      <form id="rolesForm" name="rolesForm" :novalidate="true" ref="form">
        <section class="row search-group inline">
          <label class="col s12 m4 l4">
            {{resource.username}}
            <input
              type="text"
              :id="username"
              name="username"
              v-model="model.username"
              maxlength="255"
              :placeholder="resource.username"
            />
          </label>
          <label class="col s12 m4 l4">
            {{resource.display_name}}
            <input
              type="text"
              :id="displayName"
              name="displayName"
              v-model="model.displayName"
              maxlength="255"
              :placeholder="resource.display_name"
            />
          </label>
          <label class="col s12 m4 l4">
            {{resource.status}}
            <section
              class="checkbox-group"
              v-for="(ctrlItem) of statusList"
              :key="ctrlItem.value"
            >
              <label>
                <input
                  type="checkbox"
                  :id="ctrlItem.value"
                  name="status"
                  :value="ctrlItem.value"
                  @change="updateState"
                  v-model="model.status"
                  :checked="ctrlItem.value"
                />
                {{ctrlItem.text}}
              </label>
            </section>
          </label>
        </section>
        <section class="btn-group">
          <label>
            {{resource.page_size}}
            <select @change="onPageSizeChanged">
              <option v-for="p of pageSizes" :value="p" :selected="p === pageSize" :key="p">{{p}}</option>
            </select>
          </label>
          <button type="submit" class="btn-search" @click="search">{{resource.search}}</button>
        </section>
      </form>
      <form class="list-result">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>{{resource.sequence}}</th>
                <th data-field="userId">
                  <button type="button" id="sortUserId" @click="sort">{{resource.user_id}}</button>
                </th>
                <th data-field="username">
                  <button type="button" id="sortUsername" @click="sort">{{resource.username}}</button>
                </th>
                <th data-field="email">
                  <button type="button" id="sortEmail" @click="sort">{{resource.email}}</button>
                </th>
                <th data-field="displayName">
                  <button type="button" id="sortDisplayName" @click="sort">{{resource.display_name}}</button>
                </th>
                <th data-field="status">
                  <button type="button" id="sortStatus" @click="sort">{{resource.status}}</button>
                </th>
                <th className='action'>{{resource.action}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in list" :key="item.userId">
                <td class="text-right">{{item.sequenceNo}}</td>
                <td>{{item.userId}}</td>
                <td>{{item.username}}</td>
                <td>{{item.email}}</td>
                <td>{{item.displayName}}</td>
                <td>{{item.status}}</td>
                <td>
                  <button v-if="editable" type="button" class="btn-edit" :id="i" @click="viewUser(item.userId)"></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
import { alertError } from 'ui-alert';
import { toast } from 'ui-toast';
import { getLocale, initForm, registerEvents, storage, user } from 'uione';
import { Options } from 'vue-class-component';
import { buildFromUrl, navigate } from '../common';
import { SearchComponent } from '../common';
import PaginateVue from '../core/PaginateVue.vue';
import { useMasterData, User, UserFilter, useUser } from '../admin/service/user';

@Options({
  components: { PaginateVue }
})
export default class UsersComponent extends SearchComponent<User, UserFilter> {
  username = '';
  status = [];
  statusList = [];
  displayName = '';
  created() {
    const userService = useUser();
    this.onCreated(
      userService,
      storage.resource(),
      storage.ui(),
      getLocale,
      toast,
      alertError,
      storage.loading()
    );
  }
  mounted() {
    console.log('form',this.$refs.form);
    
    this.form = initForm(this.$refs.form as any, registerEvents);
    const s = this.mergeFilter(buildFromUrl(), ['status']);
    this.init(s, true);
  }

  init(s: UserFilter, auto: boolean) {
    const com = this;
    const userService = useUser();
    const masterDataService = useMasterData();
    masterDataService.getStatus()
      .then(statusList => {
        console.log('statusList',  statusList);
        com.statusList = statusList;
        com.load(s, auto);
      })
      .catch(com.handleError);
      userService.getAllUsers().then((users)=>{
        com.list = users;
        console.log("users: ", com.list);
        
      })
  }

  getSearchModel(): UserFilter {
    const model = this.populateFilter();
    return model;
  }

  viewUser(id) {
    navigate(this.$router, 'users', [id]);
  }

  addUser() {
    navigate(this.$router, '/admin/users/add');
  }
}
</script>
