<template>
  <div class='view-container'>
      <header>
        <!-- <h2>{{ resource.users }}</h2> -->
        <h2>Location</h2>
        <div class='btn-group' >
          
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
        <form
          id='locationsForm'
          name='locationsForm'
          :noValidate="true"
        >
          <section class='row search-group'>
            <label class='col s12 m4 search-input'>
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
                type='text'
                id='q'
                name='q'
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
            {{ resource.name }}
            <input
              type="text"
              :id="name"
              name="name"
              v-model="filter.name"
              maxlength="255"
              :placeholder="resource.name"
            />
          </label>
        </section>
        </form>
        <form class='list-result'>
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
                    <!-- {{ resource.item_id }} -->
                        Id
                  </button>
                </th>
                <th data-field="name">
                  <button type="button" id="sortName" @click="sort">
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
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul 
        class='row list-view 2' 
        v-if="view !== 'table' && list && list.length > 0"
        >
            <li 
            style="cursor: pointer;"
            v-for="(item, index) of list"
            class="col s12 m6 l4 xl3 card"
            @click="edit(item.id)"
            :key="index"
          >
             <section>
            <div
              className='cover'
              :style='
            `background-image: url(${item.imageURL});`
        '
            ></div>
            <h3 >{{item.name}}</h3>
          </section>
          </li>
            
        </ul>
            
        </form>
      </div>
    </div>
</template>

<script lang='ts'>
import { initForm, inputSearch, registerEvents, storage } from "uione";
import { Options } from "vue-class-component";
import { buildFromUrl, navigate, SearchComponent } from "vuex-one";
import { getLocations, Location, LocationFilter } from "./service/";
// import 'leaflet/dist/leaflet.css';
import PaginateVue from "../core/PaginateVue.vue";
import PageSizeSelect from "../core/PageSizeSelect.vue";

@Options({ 
  components: { PaginateVue, PageSizeSelect }
})

export default class UsersComponent extends SearchComponent<Location, LocationFilter> {
 
  viewable = true;
  editable = true;
  hideFilter = true;
  view = "listview";
  created() {
    const locationService = getLocations();
    this.onCreated(locationService, inputSearch());
    
    
  }
  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    const filter = this.mergeFilter(buildFromUrl(), ["status"]);
    this.load(filter, storage.autoSearch);
    console.log('data:::',this.list);
  }

  edit(id: string) {
    navigate(this.$router, "/location", [id]);
  }

  add() {
    navigate(this.$router, "/location/add");
  }
}
</script>

<style>

</style>