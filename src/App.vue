<template>
  <div id="root">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { storage } from 'uione';
import config from './config';
import { resources as locales } from "./core/resources";


// import './App.css';
import './assets/fonts/material-icon/css/material-icons.css';
import './assets/css/reset.css';
import './assets/css/checkbox.css';
import './assets/css/radio.css';
import './assets/css/materialize-grid.css';
import './assets/css/alert.css';
import './assets/css/loader.css';
import './assets/css/main.css';
import './assets/css/modal.css';
import './assets/css/multi-select.css';
import './assets/css/date-picker.css';
import './assets/css/form.css';
import './assets/css/diff.css';
import './assets/css/group.css';
import './assets/css/article.css';
import './assets/css/list-view.css';
import './assets/css/table.css';
import './assets/css/list-detail.css';
import './assets/css/navigation-bar.css';
import './assets/css/pagination.css';
import './assets/css/solid-container.css';
import './assets/css/common-button.css';
import './assets/css/search.css';
import './assets/css/layout.css';
import './assets/css/profile.css';
import './assets/css/theme.css';

export function init() {
  // const conf = merge(config, process.env, env, process.env.ENV);
  storage.setConfig(config);
  // resource.csv = new DefaultCsvService(csv);
  // resource.config = {
  //   list: 'list'
  // };
  if (storage.home == null || storage.home === undefined) {
    storage.home = '/welcome';
  }
  // storage.token = getToken;
  storage.moment = true;
  storage.authentication = '/signin';
  storage.home = '/welcome';
  storage.setResources(locales);
  // storage.setLoadingService(loading);
  // storage.setUIService(new UIService());
  // storage.currency = currency;
  // storage.locale = locale;
  // storage.alert = alert;
  // storage.confirm = confirm;
  // storage.message = toast;

  // vresources.phonecodes = phonecodes;
  // uiresources.date = parseDate;
  // uiresources.currency = currency;
  // uiresources.resource = storage.resource();
  // resources.formatPhone = formatPhone;
  // resources.formatFax = formatFax;
  // resources.currency = currency;
  // resources.formatNumber = formatNumber;
}

@Options({})
export default class App extends Vue {
  created():void{
    init();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
