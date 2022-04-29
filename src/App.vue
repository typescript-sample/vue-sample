<template>
  <div id="root">
    <router-view />
  </div>
</template>

<script lang="ts">
import * as csv from 'csvtojson';
import {currency, locale} from 'locale-service';
import { phonecodes } from 'phonecodes';
import { alert, confirm } from 'ui-alert';
import { loading } from 'ui-loading';
import { formatFax, formatNumber, formatPhone, resources as uiresources, UIService } from 'ui-plus';
import { toast } from 'ui-toast';
import { storage } from 'uione';
import { resources as vresources } from 'validation-core';
import { DefaultCsvService, resources as resource } from 'web-clients';
import { resources } from './common';
import {config} from './config';
import { resources as locales } from './core/resources';

import './assets/css/reset.css';
import './App.css';
import './assets/fonts/material-icon/css/material-icons.css';
import './assets/css/checkbox.css';
import './assets/css/radio.css';
import './assets/css/grid.css';
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
import './assets/css/navigation.css';
import './assets/css/pagination.css';
import './assets/css/solid-container.css';
import './assets/css/button.css';
import './assets/css/search.css';
import './assets/css/layout.css';
import './assets/css/profile.css';
import './assets/css/theme.css';
import './assets/css/dark.css';

import { Options, Vue } from 'vue-class-component';
function parseDate(value: string, format: string): Date | null | undefined {

  const dateItems = format.split(/\.|\ |\-/);
  const valueItems = value.split(/\.|\ |\-/);
  let monthIndex  = dateItems.indexOf("M");
  let dayIndex    = dateItems.indexOf("d");
  let yearIndex   = dateItems.indexOf("yyyy");
  // if(monthIndex==-1){
  //   monthIndex  = dateItems.indexOf("MM");
  // }
  // if(dayIndex==-1){
  //   dayIndex  = dateItems.indexOf("DD");
  // }
  // if(yearIndex==-1){
  //   yearIndex  = dateItems.indexOf("YY");
  // }
  const month=parseInt(valueItems[monthIndex])-1;
  let year=parseInt(valueItems[yearIndex]);
  if(year<100)year+=2000;
  const day=parseInt(valueItems[dayIndex]);  
  const formatedDate = new Date(year,month,day);
  return formatedDate;
}

export function init() {
  // const conf = merge(config, process.env, env, process.env.ENV);
  console.log(parseDate('2000.12.25','yyyy.m.d'));
  
  storage.setConfig(config);
  resource.csv = new DefaultCsvService(csv);
  resource.config = {
    list: 'list'
  };
  if (storage.home == null || storage.home === undefined) {
    storage.home = '/welcome';
  }
  // storage.token = getToken;
  storage.moment = true;
  storage.authentication = '/signin';
  storage.home = '/welcome';
  storage.setResources(locales);
  storage.setLoadingService(loading);
  storage.setUIService(new UIService());
  storage.currency = currency;
  storage.locale = locale;
  storage.alert = alert;
  storage.confirm = confirm;
  storage.message = toast;

  vresources.phonecodes = phonecodes;
  uiresources.date = parseDate;
  uiresources.currency = currency;
  uiresources.resource = storage.resource();
  resources.formatPhone = formatPhone;
  resources.formatFax = formatFax;
  resources.currency = currency as any;
  resources.formatNumber = formatNumber;
}

@Options({})
export default class App extends Vue {
  created():void{
    init();
  }
}
</script>
