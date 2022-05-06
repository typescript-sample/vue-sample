<template>
  <div class="view-container">
    <header>
      <h2>{{ resource.users }}</h2>
      <div class="btn-group">
        <button
          v-if="view !== 'table'"
          type="button"
          id="btnTable"
          name="btnTable"
          class="btn-table"
          @click="changeView($event, 'table')"
        ></button>
        <button
          v-if="view === 'table'"
          type="button"
          id="btnListView"
          name="btnListView"
          class="btn-list-view"
          @click="changeView($event, 'listview')"
        ></button>
      </div>
    </header>
    <div>
      <form id="usersForm" name="usersForm" novalidate>
        <section class="row search-group">
          <label class="col s12 m4 search-input">
            <select @change="onPageSizeChanged($event)">
              <option
                v-for="(p, index) in pageSizes"
                :value="p"
                :selected="p === pageSize"
                :key="index"
              >
                {{ p }}
              </option>
            </select>
            <input
              type="text"
              id="q"
              name="q"
              v-model="model.q"
              maxlength="1000"
              :placeholder="resource.keyword"
            />
            <button
              type="button"
              :hidden="!model.q"
              class="btn-remove-text"
              @click="clear()"
            ></button>
            <button
              type="button"
              class="btn-filter"
              @click="toggleFilter"
            ></button>
            <button type="submit" class="btn-search" @click="search"></button>
          </label>
          <!-- <pagination class='col s12 m6' id='pageIndex' name='pageIndex' v-if='showPaging' v-model='pageIndex'
          (pageChanged)='pageChanged($event)' (numPages)='pageIndex = $event' [directionLinks]='false'
          [totalItems]='itemTotal' [maxSize]='pageMaxSize' [itemsPerPage]='pageSize'></pagination> -->
        </section>
        <section class="row search-group inline" :hidden="hideFilter">
          <label class="col s12 m4 l4">
            {{ resource.username }}
            <input
              type="text"
              id="username"
              name="username"
              v-model="model.username"
              maxLength="255"
              :placeholder="resource.username"
            />
          </label>
          <label class="col s12 m4 l4">
            {{ resource.display_name }}
            <input
              type="text"
              id="displayName"
              name="displayName"
              v-model="model.displayName"
              maxLength="255"
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
                  checked="A"
                  @change="updateState($event)"
                />
                {{ resource.active }}
              </label>
              <label>
                <input
                  type="checkbox"
                  id="I"
                  name="status"
                  value="I"
                  checked="I"
                  @change="updateState($event)"
                />
                {{ resource.inactive }}
              </label>
            </section>
          </label>

          <label class="col s12 m4 l4">
            {{ resource.interests }}
            <div class="row">
              <div class="inline-input">
                <input
                  type="text"
                  name="interest"
                  class="form-control"
                  v-model="interest"
                  :placeholder="resource.interests"
                  maxLength="50"
                />
                <button
                  type="button"
                  id="btnAddInterest"
                  name="btnAddInterest"
                  class="btn-add"
                  @click="addInterest($event)"
                ></button>
              </div>
              <template v-if="model.interests">
                <template *v-for="(item,index) in model.interests">
                  <div class="chip" :tabindex="index" :key="item">
                    {{ item }}
                    <button
                      type="button"
                      name="btnRemoveInterest"
                      class="close"
                      @click="removeInterest($event, item)"
                    ></button>
                  </div>
                </template>
              </template>
            </div>
          </label>
          <!-- <label class='col s12 m4 l4'>
          {{resource.skills}}
          <div class='row'>
            <div class='inline-input'>
              <input type="text" name='skill' class="form-control" v-model="skill"
                :placeholder="resource.skills" maxLength="50" />
              <button type="button" id="btnAddSkill" name="btnAddSkill" class="btn-add" @click="addSkill()" ></button>
            </div>
            <template v-if="model.skills">
              <template v-for="iten in model.skills">
                <div class="chip" :tabindex="i" :key="item">
                  {{item}}
                  <button type="button" name="btnRemoveSkill" class="close" @click="removeSkill($event, item)"></button>
                </div>
              </template>
            </template>
          </div>
        </label> -->
        </section>
      </form>
      <form class="list-result">
        <div
          v-if="view === 'table' && list && list.length > 0"
          class="table-responsive"
        >
          <table>
            <thead>
              <tr>
                <!-- <th>{{resource.sequence}}</th> -->
                <th data-field="id">
                  <button type="button" id="sortId" @click="sort($event)">
                    {{ resource.user_id }}
                  </button>
                </th>
                <th data-field="username">
                  <button type="button" id="sortUserName" @click="sort($event)">
                    {{ resource.username }}
                  </button>
                </th>
                <th data-field="email">
                  <button type="button" id="sortEmail" @click="sort($event)">
                    {{ resource.email }}
                  </button>
                </th>
                <th data-field="displayname">
                  <button
                    type="button"
                    id="sortDisplayName"
                    @click="sort($event)"
                  >
                    {{ resource.display_name }}
                  </button>
                </th>
                <th data-field="status">
                  <button type="button" id="sortStatus" @click="sort($event)">
                    {{ resource.status }}
                  </button>
                </th>
              </tr>
            </thead>
            <tr
              v-for="item in list"
              @click.prevent="viewProfile(item.id)"
              :key="item.id"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.username }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.displayName }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </table>
        </div>
        <ul
          v-if="view !== 'table' && list && list.length > 0"
          class="row list-view"
        >
          <li
            v-for="item in list"
            class="col s12 m6 l4 xl3"
            @click.prevent="viewProfile(item.id)"
            :key="item.id"
          >
            <section>
              <img
                :src="
                  item.imageURL && item.imageURL.length > 0
                    ? item.imageURL
                    : item.gender === 'F'
                    ? femaleIcon
                    : maleIcon
                "
                class="round-border"
              />
              <div>
                <h3 @click.prevent="viewProfile(item.id)">
                  {{ item.displayName }}
                </h3>
                <p>{{ item.email }}</p>
              </div>
              <button class="btn-detail"></button>
            </section>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { buildFromUrl, navigate, SearchComponent } from "vuex-one";
import { initForm, inputSearch, registerEvents } from "uione";
import { Options } from "vue-class-component";
import { getUserService, User, UserFilter } from "./user";
import female from "../assets/images/female.png";
import male from "../assets/images/male.png";
@Options({})
export default class UsersPage extends SearchComponent<User, UserFilter> {
  viewable = true;
  editable = true;
  femaleIcon = female;
  maleIcon = male;
  hideFilter = true;
  view = "listview";
  interest = "";
  created() {
    const userService = getUserService();
    const searchParameters = inputSearch() as any;
    this.onCreated(
      userService,
      searchParameters.resource,
      searchParameters.ui,
      searchParameters.getLocale,
      searchParameters.showMessage,
      searchParameters.showError,
      searchParameters.loading
    );
  }
  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    const s = this.mergeFilter(buildFromUrl());
    this.init(s, true);
  }

  init(s: UserFilter, auto: boolean) {
    this.load(s, auto);
  }
  viewProfile(id: string) {
    console.log(id);

    navigate(this.$router, "/profile", [id]);
  }
}
</script>

<style>
</style>