<template>
  <div class="view-container">
    <header>
      <h2>{{ resource.users }}</h2>
      <div class="btn-group">
        <button
          type="button"
          v-if="view !== 'table'"
          id="btnTable"
          name="btnTable"
          class="btn-table"
          data-view ="table"
          @click="changeView"
        />
        <button
          type="button"
          v-if="view === 'table'"
          id="btnListView"
          name="btnListView"
          class="btn-list-view"
          data-view="listview"
          @click="changeView"
        />
        <button
          v-if="addable"
          type="button"
          class="btn-new"
          id="btnNew"
          @click="add"
        ></button>
      </div>
    </header>
    <div>
      <form id="usersForm" name="usersForm" :novalidate="true">
        <section class="row search-group">
          <label className="col s12 m4 search-input">
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
              :hidden="!filter.q"
              class="btn-remove-text"
              @click="clear()"
            ></button>
            <button type="button" class="btn-filter" @click="toggleFilter" />
            <button type="submit" class="btn-search" @clcik="search" />
          </label>
          <PaginateVue
            :items-per-page="pageSize"
            :item-total="itemTotal"
            :margin-pages="pageSize"
            :page-range="pageSize"
            :forcePage="pageIndex"
            :click-handler="pageChanged"
            :page-class="'page-item'"
            :pageLinkClass="'page-link'"
            :container-class="'pagination'"
          ></PaginateVue>
        </section>
        <section class="row search-group inline" :hidden="hideFilter">
          <label class="col s12 m4 l4">
            {{ resource.username }}
            <input
              type="text"
              :id="username"
              name="username"
              v-model="filter.username"
              maxlength="255"
              :placeholder="resource.username"
            />
          </label>
          <label class="col s12 m4 l4">
            {{ resource.display_name }}
            <input
              type="text"
              :id="displayName"
              name="displayName"
              v-model="filter.displayName"
              maxlength="255"
              :placeholder="resource.display_name"
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
            <PageSizeSelect :pageSize="pageSize" :pageSizes="pageSizes" :onPageSizeChanged="onPageSizeChanged" />
          </label>
          <button type="submit" class="btn-search" @click="search">
            {{ resource.search }}
          </button>
        </section> -->
      </form>
      <form class="list-result">
        <div v-if="view === 'table' && list && list.length > 0" class="table-responsive">
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in list" :key="item.userId" @click="edit(item.userId)">
                <td class="text-right">{{ item.sequenceNo }}</td>
                <td>{{ item.userId }}</td>
                <td>{{ item.username }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.displayName }}</td>
                <td>{{ item.status }}</td>
                
              </tr>
            </tbody>
          </table>
        </div>
        <ul v-if="view !== 'table' && list && list.length > 0" class='row list-view'>
        <li v-for="(item,index) of list" class='col s12 m6 l4 xl3' @click="edit(item.userId)"  :key="index">
          <section>
            <img
             :src='item.imageURL && item.imageURL.length > 0 ? item.imageURL : (item.gender === "F" ? femaleIcon : maleIcon)'
              class='round-border'/>
            <div>
              <h3 @click="edit(item.id)">{{item.displayName}}</h3>
              <p>{{item.email}}</p>
            </div>
            <button class='btn-detail'></button>
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
import { buildFromUrl, navigate } from "vuex-one";
import { SearchComponent } from "vuex-one";
import PaginateVue from "../core/PaginateVue.vue";
import { getUserService, User, UserFilter } from "./service/";
import PageSizeSelect from "../core/PageSizeSelect.vue";
import female from '../assets/images/female.png';
import male from '../assets/images/male.png';
@Options({
  components: { PaginateVue, PageSizeSelect },
})
export default class UsersComponent extends SearchComponent<User, UserFilter> {
  username = "";
  status = [];
  displayName = "";
  viewable = true;
  editable = true;
  hideFilter = true;
  femaleIcon = female;
  maleIcon = male;
  view="listview";
    created() {
    const userService = getUserService();
    this.onCreated(userService, inputSearch());
  }
  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    const s = this.mergeFilter(buildFromUrl(), ["status"]);
    this.init(s, true);
  }

  init(s: UserFilter, auto: boolean) {
        this.load(s, auto);
  }

  edit(id:string) {
    navigate(this.$router, "/admin/users", [id]);
  }

  add() {
    navigate(this.$router, "/admin/users/add");
  }
}
</script>
