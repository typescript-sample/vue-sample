<template>
  <div :class="getTopClass">
    <div class="top-banner">
      <div class="logo-banner-wrapper">
        <img
          src="https://jacobspradlin.files.wordpress.com/2014/10/banner-people-connected.png"
          alt="Baner of The Company"
        />
        <img
          src="https://jacobspradlin.files.wordpress.com/2014/10/banner-people-connected.png"
          class="banner-logo-title"
          alt="Logo of The Company"
        />
      </div>
    </div>
    <div class="menu sidebar">
      <nav class="expanded-all">
        <side-bar
          v-bind:items="items"
          @toggle-sidebar="setToggleSidebar"
          @toggle-menu="setToggleMenu"
          :isToggleSidebar="isToggleSidebar"
          :isToggleMenu="isToggleMenu"
        />
      </nav>
    </div>
    <div class="page-container">
      <div class="page-header">
        <form>
          <div class="search-group">
            <section>
              <button
                type="button"
                class="toggle-menu"
                @click="toggleMenu"
              ></button>
              <button
                type="button"
                class="toggle-search"
                @click="toggleSearch"
              ></button>
              <button
                type="button"
                class="close-search"
                @click="toggleSearch"
              ></button>
            </section>
            <div class="logo-wrapper">
              <img
                class="logo"
                src="@/assets/images/logo.png"
                alt="Logo of The Company"
              />
            </div>
            <label class="search-input">
              <PageSizeSelect
                :page-size="pageSize"
                :page-sizes="pageSizes"
                :on-page-size-changed="pageSizeChanged"
              />
              <input
                type="text"
                id="keyword"
                name="keyword"
                v-model="keyword"
                :maxLength="1000"
                :placeholder="resource.keyword"
              />
              <button
                type="button"
                :hidden="!keyword || keyword.length === 0"
                class="btn-remove-text"
                @click="clearQ"
              ></button>
              <button type="submit" class="btn-search" @click="search" />
            </label>
            <section class="quick-nav">
              <a><i class="material-icons" @click="viewProfile">home</i></a>
              <div class="dropdown-menu-profile">
                <!-- <img
                  v-if="user && user.imageURL"
                  id="btnProfile"
                  src="@/assets/images/male.png"
                  @click="toggleProfile"
                /> -->
                <i
                  v-if="!user || !user.imageURL"
                  class="material-icons"
                  @click="toggleProfile"
                  >person</i
                >
                <!-- <i v-if="(!user || !user.imageURL)" class="mdi mdi-account"  @click="toggleProfile"></i> -->
                <ul
                  id="dropdown-basic"
                  v-if="!user"
                  :class="getClassProfile + ' dropdown-content-profile'"
                >
                  <li @click="changeMenu">
                    <template v-if="isTopMenu">
                      <i class="material-icons">view_list</i
                      ><span class="dropdown-item-profile">{{
                        resource.sidebar
                      }}</span>
                    </template>
                    <template v-if="!isTopMenu">
                      <i class="material-icons">credit_card</i
                      ><span class="dropdown-item-profile">{{
                        resource.menu
                      }}</span>
                    </template>
                  </li>
                  <li @click="changeClassicMenu" class="classic-menu">
                    <template v-if="isClassicMenu">
                      <i class="material-icons">assessment</i
                      ><span class="dropdown-item-profile">{{
                        resource.modern_menu
                      }}</span>
                    </template>
                    <template v-if="!isClassicMenu">
                      <i class="material-icons">credit_card</i
                      ><span class="dropdown-item-profile">{{
                        resource.classic_menu
                      }}</span>
                    </template>
                  </li>
                  <hr style="margin: 0" />
                  <li @click="changeMode">
                    <template v-if="isDarkMode">
                      <i class="material-icons">radio_button_checked</i
                      ><span class="dropdown-item-profile">{{
                        resource.light_mode
                      }}</span>
                    </template>
                    <template v-if="isDarkMode">
                      <i class="material-icons">timelapse</i
                      ><span class="dropdown-item-profile">{{
                        resource.dark_mode
                      }}</span>
                    </template>
                  </li>
                  <hr style="margin: 0" />
                  <li>
                    <i class="material-icons">account_circle</i
                    ><a class="dropdown-item-profile" href="/">{{
                      resource.signin
                    }}</a>
                  </li>
                  <hr style="margin: 0" />
                  <li>
                    <a class="dropdown-item-profile" @click="signout">{{
                      resource.button_signout
                    }}</a>
                  </li>
                </ul>
                <ul
                  v-if="user"
                  id="dropdown-basic"
                  :class="getClassProfile + ' dropdown-content-profile'"
                >
                  <li @click="changeMenu">
                    <template v-if="isTopMenu">
                      <i class="material-icons">view_list</i
                      ><span class="dropdown-item-profile">{{
                        resource.sidebar
                      }}</span>
                    </template>
                    <template v-if="!isTopMenu">
                      <i class="material-icons">credit_card</i
                      ><span class="dropdown-item-profile">{{
                        resource.menu
                      }}</span>
                    </template>
                  </li>
                  <li @click="changeClassicMenu" class="classic-menu">
                    <template v-if="isClassicMenu">
                      <i class="material-icons">assessment</i
                      ><span class="dropdown-item-profile">{{
                        resource.modern_menu
                      }}</span>
                    </template>
                    <template v-if="!isClassicMenu">
                      <i class="material-icons">credit_card</i
                      ><span class="dropdown-item-profile">{{
                        resource.classic_menu
                      }}</span>
                    </template>
                  </li>
                  <hr style="margin: 0" />
                  <li @click="changeMode">
                    <template v-if="isDarkMode">
                      <i class="material-icons">radio_button_checked</i
                      ><span class="dropdown-item-profile">{{
                        resource.light_mode
                      }}</span>
                    </template>
                    <template v-if="!isDarkMode">
                      <i class="material-icons">timelapse</i
                      ><span class="dropdown-item-profile">{{
                        resource.dark_mode
                      }}</span>
                    </template>
                  </li>
                  <hr style="margin: 0" />
                  <li>
                    <i class="material-icons">account_circle</i
                    ><a
                      class="dropdown-item-profile"
                      @click="viewMyProfile()"
                      >{{ username }}</a
                    >
                  </li>

                  <li>
                    <i class="material-icons">settings</i
                    ><a
                      class="dropdown-item-profile"
                      @click="viewMySettings()"
                      >{{ resource.my_settings }}</a
                    >
                  </li>
                  <hr style="margin: 0" />
                  <li>
                    <i class="material-icons">exit_to_app</i
                    ><a class="dropdown-item-profile" @click="signout()">{{
                      resource.button_signout
                    }}</a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </form>
      </div>
      <div class="page-body">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { handleError, Privilege, storage, StringMap, useResource, UserAccount } from "uione";
import { Options, Vue } from "vue-class-component";
import { navigate } from "vuex-one";
import PageSizeSelect from "./PageSizeSelect.vue";
import SideBar from "./SideBar/index.vue";

@Options({
  name: "Layout",
  components: {
    SideBar,
    PageSizeSelect,
  },
})
export default class Layout extends Vue {
  pageSize = 12;
  pageSizes = [12, 24, 60, 100, 120, 180, 300, 600];
  isToggleSidebar = false;
  isToggleMenu = false;
  isToggleSearch = false;
  isMenu = false;
  darkMode = false;
  classicMenu = false;
  sysBody: HTMLElement | null | undefined;
  resource!: StringMap;
  isDarkMode?: boolean;
  isTopMenu?: boolean;
  isClassicMenu?: boolean;
  user?: UserAccount|null;
  username?: string = "";
  userType?: string = "";
  keyword = "";
  showProfile = "";
  forms: Privilege[] = [];
  privileges: Privilege[] = [];
  created() {
    this.user = storage.user();
    const username = storage.username();
    const userType = storage.getUserType();
    if (username || userType) {
      this.username = username;
      this.userType = userType;
    }
    if (!this.sysBody) {
      this.sysBody = document.getElementById("sysBody");
    }
    this.isDarkMode = this.checkIsDarkMode();
    this.isTopMenu = this.checkIsTopMenu();
    this.isClassicMenu = this.checkIsClassicMenu();
    this.privileges = storage.privileges();
    this.resource = useResource();
    this.$watch("darkMode", () => {
      this.isDarkMode = this.checkIsDarkMode();
    });
    this.$watch("isMenu", () => {
      this.isTopMenu = this.checkIsTopMenu();
      this.isClassicMenu = this.checkIsClassicMenu();
    });
    this.$watch("classicMenu", () => {
      this.isClassicMenu = this.checkIsClassicMenu();
    });
    this.$watch("darkMode", () => {});
    /*
    const config: any = storage.config();
    const httpRequest = new HttpRequest(axios, options);
    httpRequest
      .get(config.public_privilege_url)
      .then((forms: any) => {
        this.privileges = forms.privileges;
      })
      .catch((err) => {});
    // this.forms = JSON.parse(sessionStorage.getItem("authService") as any);
    // this.privileges =
    //   this.forms && this.forms["privileges"] ? this.forms["privileges"] : [];
    */
  }
  viewMyProfile() {
    navigate(this.$router, "/my-profile");
  }
  viewMySettings() {
    navigate(this.$router, "/my-profile/settings");
  }
  viewProfile() {
    navigate(this.$router, "/profile");
  }
  changeMenu() {
    if (this.sysBody) {
      if (this.sysBody.classList.contains("top-menu")) {
        this.sysBody.classList.remove("top-menu");
        this.isMenu = true;
      } else {
        this.sysBody.classList.add("top-menu");
        this.isMenu = false;
      }
    }
  }
  changeClassicMenu() {
    if (this.sysBody) {
      if (this.sysBody.classList.contains("classic")) {
        this.sysBody.classList.remove("classic");
        this.classicMenu = true;
      } else {
        this.sysBody.classList.add("classic");
        this.classicMenu = false;
      }
    }
  }
  checkIsClassicMenu(): boolean {
    if (this.sysBody) {
      if (this.sysBody.classList.contains("classic")) {
        return true;
      }
    }
    return false;
  }
  checkIsTopMenu(): boolean {
    if (this.sysBody) {
      if (this.sysBody.classList.contains("top-menu")) {
        return true;
      }
    }
    return false;
  }
  changeMode(): void {
    if (this.sysBody) {
      const parent = this.sysBody.parentElement;
      if (parent) {
        if (parent.classList.contains("dark")) {
          parent.classList.remove("dark");
          this.darkMode = false;
        } else {
          parent.classList.add("dark");
          this.darkMode = true;
        }
      }
    }
  }
  checkIsDarkMode(): boolean {
    if (this.sysBody) {
      const parent = this.sysBody.parentElement;
      if (parent) {
        if (parent.classList.contains("dark")) {
          return true;
        }
      }
    }
    return false;
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

  pageSizeChanged = (event: any) => {};

  search = () => {};

  toggleProfile() {
    this.showProfile = this.showProfile === "show" ? "" : "show";
  }

  get getClassProfile() {
    return this.showProfile;
  }

  async signout(event: any) {
    // event.preventDefault();
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
      navigate(this.$router, "/");

      // }
    } catch (err) {
      handleError(err);
    }
  }
  clearQ = () => {
    this.keyword = "";
  };

  get items() {
    return this.privileges;
  }

  get getTopClass() {
    const topClassList = ["sidebar-parent"];
    if (this.isToggleSidebar) {
      topClassList.push("sidebar-off");
    }
    if (this.isToggleMenu) {
      topClassList.push("menu-on");
    }

    if (this.isToggleSearch) {
      topClassList.push("search");
    }
    return topClassList.join(" ");
  }
}
</script>
