<template>
  <div :class="getTopClass">
    <div class="top-banner">
      <div class="logo-banner-wrapper">
        <img src="@/assets/images/top-banner-logo.png" alt="Logo of The Company"/>
        <img src="@/assets/images/logo-title.png" class="banner-logo-title" alt="Logo of The Company"/>
      </div>
    </div>
    <div class="menu sidebar">
      <nav>
        <side-bar v-bind:features="features"
                  @toggle-sidebar="setToggleSidebar"
                  @toggle-menu="setToggleMenu"
                  v-bind:isToggleSidebar="toggleSidebar" v-bind:isToggleMenu="toggleSidebar"/>
      </nav>
    </div>
    <div class="page-container">
      <div class="page-header">
        <form>
          <div class="search-group">
            <section>
              <button type="button" class="toggle-menu"></button>
              <button type="button" class="toggle-search"></button>
              <button type="button" class="close-search"></button>
            </section>
            <div class="logo-wrapper">
              <img class="logo" src="@/assets/images/logo.png" alt="Logo of The Company"/>
            </div>
            <label class='search-input'>
              <PageSizeSelect :page-size="pageSize" :page-sizes="pageSizes"
                              :on-page-size-changed="pageSizeChanged"/>
              <input type='text' id='keyword' name='keyword' v-model="keyword" :maxLength="1000"
                     :placeholder="resource.keyword"/>
              <button type='button' :hidden="!keyword || keyword.length === 0" class='btn-remove-text'
                      @click="clearKeyworkOnClick"></button>
              <button type='submit' class='btn-search' @click="searchOnClick"/>
            </label>
            <section>
              <div class='dropdown-menu-profile'>
                <img v-if="user && user.imageURL" id='btnProfile' src="@/assets/images/male.png"
                     @click="toggleProfile"/>
                <!-- <i v-if="(!user || !user.imageURL)" class='material-icons' @click="toggleProfile">person</i> -->
                <i v-if="(!user || !user.imageURL)" class="mdi mdi-account"  @click="toggleProfile"></i>
                <ul id='dropdown-basic' :class="getClassProfile + ' dropdown-content-profile'">
                  <li>
                    <label>User Name: {{username}} </label>
                    <br/>
                    <label>Role : {{userType === 'M' ? 'Maker' : 'Checker'}} </label>
                  </li>
                  <hr style="margin: 0"/>
                  <li><a class='dropdown-item-profile'
                         @click="signout">{{resource.button_signout}}</a></li>
                </ul>
              </div>
            </section>
          </div>
        </form>
      </div>
      <div class="page-body">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import {HttpRequest} from 'axios-core';
import {alertError, confirm} from 'ui-alert';
import {toast} from 'ui-toast';
import {options, storage} from 'uione';
import {getLocale} from 'uione/src/index';
import { Options } from 'vue-class-component';
import {navigate} from '../common';
import {BaseComponent} from '../common';
import config from '../config';
import PageSizeSelect from './PageSizeSelect.vue';
import SideBar from './SideBar/index.vue';

@Options({
  name: 'DefaultWapper',
  components: {
    SideBar,
    PageSizeSelect
  }
})
export default class 
extends BaseComponent 
{
  private isToggleSidebar = false;
  private isToggleMenu = false;
  private keyword = '';
  private classProfile = '';
  private httpRequest: HttpRequest;
  private forms = {};
  private privileges = [];
  protected pageSize = 20;
  protected pageSizes = [10, 20, 40, 60, 100, 200, 400, 10000];

  private user: any = {};
  protected username = '';
  protected userType = '';

  mounted() {
    this.httpRequest = new HttpRequest(axios, options);
    const username = storage.username();
    const storageRole = storage.getUserType();
    this.resource = storage.getResource();
    this.resourceService = storage.resource();
    if (username || storageRole) {
      this.username = username;
      this.userType = storageRole;
    }
  }

  onCreated() {
    this.ui = storage.ui();
    this.getLocale = getLocale;
    this.showError = toast;
    this.loading =  storage.loading();
    this.resourceService = storage.resource();
    this.resource = storage.resource().resource();
  }

  created() {
    this.forms = JSON.parse(sessionStorage.getItem('authService'));
    this.privileges = this.forms && this.forms['privileges'] ? this.forms['privileges'] : [];
    this.onCreated();
  }

  get toggleSidebar() {
    return this.isToggleSidebar;
  }

  setToggleSidebar(dataToggleSidebar: boolean) {
    this.isToggleSidebar = !dataToggleSidebar;
  }

  get toggleMenu() {
    return this.isToggleMenu;
  }

  setToggleMenu(dataToggleMenu: boolean) {
    this.isToggleMenu = !dataToggleMenu;
  }

  pageSizeChanged = (event: any) => {
  }

  searchOnClick = () => {

  }

  toggleProfile() {
    this.classProfile = this.classProfile === 'show' ? '' : 'show';
  }

  get getClassProfile() {
    return this.classProfile;
  }

  async signout(event: any) {
    event.preventDefault();
    /*
    this.signoutService.signout(GlobalApps.getUserName()).subscribe(success => {
      if (success === true) {
        this.navigate('signin');
      }
    }, this.handleError);
    */
    try {
      // const url = config.authentication_url + '/authentication/signout/' + storage.username();
      // const success = await this.httpRequest.get(url);
      // if (success) {
      //   sessionStorage.setItem('authService', null);
      //   sessionStorage.clear();
      //   storage.setUser(null);
        navigate(this.$router, '/');
    
      // }
    } catch (err) {
      this.handleError(err);
    }
  }

  clearKeyworkOnClick = () => {
    this.keyword = '';
  }

  get features() {
    return this.privileges;
  }

  get getTopClass() {
    const topClassList = ['sidebar-parent'];
    if (this.isToggleSidebar) {
      topClassList.push('sidebar-off');
    }
    if (this.isToggleMenu) {
      topClassList.push('menu-on');
    }
    /*
            if (isToggleSearch) {
                topClassList.push('search');
            } */
    return topClassList.join(' ');
  }

}
</script>
