<template>
  <ul>
    <li>
      <a class="toggle-menu" @click="toggleMenu" />
      <p class="sidebar-off-menu">
        <i class="toggle" @click="toggleSidebar" />
        <i v-if="!isToggleSidebar" class="expand" @click="onShowAllMenu" />
        <i v-if="!isToggleSidebar " class="collapse" @click="onHideAllMenu" />
      </p>
    </li>
    <li
      is="vue:item-link"
      v-for="(module, index) in pinnedModules"
      :features="features"
      :key="`${index}-'pinned'`"
      :index="index"
      v-bind:pinnedModules="pinnedModules"
      @setPinnedModules="changePinnedModules"
      :module="module"
      :isPinnedModules="true"
    ></li>
    <li
      is="vue:item-link"
      v-for="(module, index) in features"
      :features="features"
      :key="`${index}-'unpinned'`"
      :index="index"
      v-bind:pinnedModules="pinnedModules"
      @setPinnedModules="changePinnedModules"
      :module="module"
      :isPinnedModules="false"
    ></li>
  </ul>
</template>

<script lang="ts">
import { Options, prop, Vue } from 'vue-class-component';
import ItemLink from './ItemLink.vue';

@Options({
  name: 'SideBar',
  props: {
    features:{required:false},
    isToggleSidebar:{required:true},
  },
  components: {
    ItemLink
  }
})
export default class extends Vue {
  private features: any[];
  private isToggleSidebar = false;
  private isToggleMenu = true;
  private pinnedModules: any[] = [];

  changePinnedModules(pinnedModules) {
    this.pinnedModules = pinnedModules;
  }

  toggleSidebar() {
    this.$emit('toggle-sidebar', this.isToggleSidebar);
  }

  toggleMenu() {
    this.$emit('toggle-menu', this.isToggleMenu);
  }

  onShowAllMenu = (e: any) => {
    const sysBody = (window as any).sysBody;
    if (sysBody.classList.contains('top-menu2')) {
      const navbar = Array.from(
        document.querySelectorAll('.sidebar>nav>ul>li>ul.list-child')
      );
      const icons = Array.from(
        document.querySelectorAll('.sidebar>nav>ul>li>a>i.down')
      );
      if (navbar.length > 0) {
        let i = 0;
        for (i = 0; i < navbar.length; i++) {
          navbar[i].className = 'list-child expanded';
          if (icons[i]) {
            icons[i].className = 'entity-icon up';
          }
        }
      }
    }
  }

  onHideAllMenu = (e: any) => {
    const sysBody = (window as any).sysBody;
    if (sysBody.classList.contains('top-menu2')) {
      const navbar = Array.from(
        document.querySelectorAll('.sidebar>nav>ul>li>ul.expanded')
      );
      const icons = Array.from(
        document.querySelectorAll('.sidebar>nav>ul>li>a>i.up')
      );
      if (navbar.length > 0) {
        let i = 0;
        for (i = 0; i < navbar.length; i++) {
          navbar[i].className = 'list-child';
          if (icons[i]) {
            icons[i].className = 'entity-icon down';
          }
        }
      }
    }
  }
}
</script>
