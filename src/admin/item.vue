<template>
  <div class="view-container">
    <form id="itemForm" name="itemForm" ref="form">
      <header>
        <button type="button" class="btn-back" @click="back(event)"></button>
        <h2>
          {{ newMode ? resource.button_create : resource.button_edit }}
          <!-- {{ resource.item }} -->
          Item
        </h2>
      </header>
      <div class="row">
        <label class="col s12 m6">
          <!-- {{ resource.item_id }} -->
          Id
          <input
            type="text"
            id="id"
            name="id"
            v-model="item.id"
            @change="updateState"
            maxlength="40"
            :required="true"
            placeholder="Id"
          />
        </label>
        <label class="col s12 m6">
          {{ resource.person_title }}
          <input
            type="text"
            id="title"
            name="title"
            v-model="item.title"
            maxlength="40"
            :required="true"
            :placeholder="resource.person_title"
          />
        </label>
        <label class="col s12 m6">
          {{ resource.description }}
          <input
            type="text"
            id="description"
            name="description"
            v-model="item.description"
            maxlength="40"
            :required="true"
            :placeholder="resource.description"
          />
        </label>
      </div>
      <footer>
        <button type="submit" id="btnSave" name="btnSave" @click="save">
          {{ resource.save }}
        </button>
      </footer>
    </form>
  </div>
</template>
<script lang="ts">
import { Item as It} from "onecore";
import {
  emailOnBlur,
  initForm,
  inputEdit,
  phoneOnBlur,
  registerEvents,
} from "uione";
import { Options } from "vue-class-component";
import { buildId, createModel, EditComponent } from "vuex-one";
import { getMasterData, getItemService } from "./service";
import { Item } from "./service";

@Options({})
export default class ItemComponent extends EditComponent<Item, string> {
  statusList = [];
  titleList: It[] = [];
  positionList: It[] = [];
  item: Item = {} as any;

  created() {
    this.onCreated(getItemService(), inputEdit());
  }

  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    const id = buildId<string>(this.$route);
    const masterDataService = getMasterData();
    Promise.all([
      masterDataService.getTitles(),
      masterDataService.getPositions(),
    ])
      .then((values) => {
        [this.titleList, this.positionList] = values;
        if (id) {
          this.load(id);
        }
      })
      .catch(this.handleError);
  }

  createModel(): Item {
    const item = createModel<Item>(this.metadata);
    return item;
  }
  showModel(obj: Item) {
    this.item = obj;
  }

}
</script>
