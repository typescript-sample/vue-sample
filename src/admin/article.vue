<template>
  <div class="view-container">
    <form id="articleForm" name="articleForm" ref="form">
      <header>
        <button type="button" class="btn-back" @click="back(event)"></button>
        <h2>
          {{ newMode ? resource.button_create : resource.button_edit }}
          <!-- {{ resource.article }} -->
          Article
        </h2>
      </header>
      <div class="row">
        <label class="col s12 m6">
          <!-- {{ resource.article_id }} -->
          Id
          <input
            type="text"
            id="id"
            name="id"
            v-model="article.id"
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
            v-model="article.title"
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
            v-model="article.description"
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
import { Item } from "onecore";
import {
  emailOnBlur,
  initForm,
  inputEdit,
  phoneOnBlur,
  registerEvents,
} from "uione";
import { Options } from "vue-class-component";
import { buildId, createModel, EditComponent } from "vuex-one";
import { getMasterData, getArticleService } from "./service";
import { Article } from "./service";

@Options({})
export default class ArticleComponent extends EditComponent<Article, string> {
  statusList = [];
  titleList: Item[] = [];
  positionList: Item[] = [];
  article: Article = {} as any;

  created() {
    this.onCreated(getArticleService(), inputEdit());
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
  updatePhoneState() {}

  createModel(): Article {
    const article = createModel<Article>(this.metadata);
    return article;
  }
  showModel(obj: Article) {
    this.article = obj;
  }
  emailOnBlur = (event: any) => {
    emailOnBlur(event);
  };
  phoneOnBlur = (event: any) => {
    phoneOnBlur(event);
  };
  check = (e: any) => {
    e.preventDefault();
    console.log(this.article);
  };
}
</script>
