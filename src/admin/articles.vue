<template>
  <div class="view-container">
    <header>
      <!-- <h2>{{ resource.articles }}</h2> -->
      <h2>Article</h2>
      <div class="btn-group">
        <button
          type="button"
          v-if="view !== 'table'"
          id="btnTable"
          name="btnTable"
          class="btn-table"
          data-view="table"
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
      <form id="articlesForm" name="articlesForm" :novalidate="true">
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
            <button type="button" class="btn-filter" @click.prevent="toggleFilter" />
            <button type="submit" class="btn-search" @clcik.prevent="search" />
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
            {{ resource.person_title }}
            <input
              type="text"
              :id="title"
              name="title"
              v-model="filter.title"
              maxlength="255"
              :placeholder="resource.person_title"
            />
          </label>
          <label class="col s12 m4 l4">
            {{ resource.description }}
            <input
              type="text"
              :id="description"
              name="description"
              v-model="filter.description"
              maxlength="255"
              :placeholder="resource.description"
            />
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
        <div
          v-if="view === 'table' && list && list.length > 0"
          class="table-responsive"
        >
          <table>
            <thead>
              <tr>
                <th>{{ resource.sequence }}</th>
                <th data-field="id">
                  <button type="button" id="sortId" @click="sort">
                    <!-- {{ resource.article_id }} -->
                        Id
                  </button>
                </th>
                <th data-field="title">
                  <button type="button" id="sortTitle" @click="sort">
                    {{ resource.person_title }}
                  </button>
                </th>
                <th data-field="description">
                  <button type="button" id="sortDescription" @click="sort">
                    {{ resource.description }}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in list"
                :key="item.id"
                @click="edit(item.id)"
              >
                <td class="text-right">{{ item.sequenceNo }}</td>
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul
          v-if="view !== 'table' && list && list.length > 0"
          class="row list-view"
        >
          <li
            v-for="(item, index) of list"
            class="col s12 m6 l4 xl3"
            @click="edit(item.id)"
            :key="index"
          >
            <section>
              <div>
                <h3 @click="edit(item.id)">{{ item.title }}</h3>
                <p>{{ item.description }}</p>
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
import { initForm, inputSearch, registerEvents, storage } from "uione";
import { Options } from "vue-class-component";
import { buildFromUrl, navigate, SearchComponent } from "vuex-one";
import PaginateVue from "../core/PaginateVue.vue";
import { getArticleService, Article, ArticleFilter } from "./service/";
import PageSizeSelect from "../core/PageSizeSelect.vue";

@Options({
  components: { PaginateVue, PageSizeSelect },
})
export default class ArticlesComponent extends SearchComponent<Article, ArticleFilter> {
  status = [];
  viewable = true;
  editable = true;
  hideFilter = true;
  view = "listview";
  created() {
    const articleService = getArticleService();
    this.onCreated(articleService, inputSearch());
  }
  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    const filter = this.mergeFilter(buildFromUrl(), ["status"]);
    this.load(filter, storage.autoSearch);
  }

  edit(id: string) {
    navigate(this.$router, "/admin/articles", [id]);
  }

  add() {
    navigate(this.$router, "/admin/articles/add");
  }
}
</script>
