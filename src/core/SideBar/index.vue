<template>
  <ul>
    <li>
      <!-- <a class="toggle-menu" @click="toggleMenu" /> -->
      <p class="sidebar-off-menu">
        <button class="toggle" @click="toggleMenu"></button>
        <i v-if="!isToggleSidebar" class="expand" @click="onShowAllMenu" />
        <i v-if="!isToggleSidebar" class="collapse" @click="onHideAllMenu" />
      </p>
    </li>
    <li
      is="vue:item-link"
      v-for="(item, index) in pinnedItems"
      :items="items"
      :key="`${index}-'pinned'`"
      :index="index"
      v-bind:pinnedItems="pinnedItems"
      @setPinnedModules="changePinnedModules"
      :item="item"
      :isPinned="true"
    ></li>
    <li
      is="vue:item-link"
      v-for="(item, index) in items"
      :items="items"
      :key="`${index}-'unpinned'`"
      :index="index"
      v-bind:pinnedItems="pinnedItems"
      @setPinnedModules="changePinnedModules"
      :item="item"
      :isPinned="false"
    ></li>
  </ul>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ItemLink, {Item} from "./ItemLink.vue";

@Options({
  name: "SideBar",
  props: {
    items: { required: false },
    isToggleSidebar: { required: true, default: true },
    isToggleMenu: { required: true },
  },
  components: {
    ItemLink,
  },
})
export default class extends Vue {
  private items!: Item[];
  private isToggleSidebar = false;
  private isToggleMenu = true;
  private pinnedItems: Item[] = [];

  changePinnedModules(pinnedItems: Item[]) {
    this.pinnedItems = pinnedItems;
  }

  toggleSidebar() {
    this.$emit("toggle-sidebar", this.isToggleSidebar);
  }

  toggleMenu() {
    this.$emit("toggle-menu", this.isToggleMenu);
  }
  findParent(ele: HTMLElement, node: string): HTMLElement | null {
    let current: HTMLElement | null = ele;
    while (true) {
      current = current.parentElement;
      if (!current) {
        return null;
      }
      if (current.nodeName === node) {
        return current;
      }
    }
  }
  onShowAllMenu(e: any) {
    e.preventDefault();
    const parent = this.findParent(e.currentTarget, "NAV");
    if (parent) {
      parent.classList.add("expanded-all");
      parent.classList.remove("collapsed-all");
      const navbar = Array.from(
        parent.querySelectorAll(".sidebar>nav>ul>li>ul.sub-list")
      );
      if (navbar.length > 0) {
        const icons = Array.from(parent.querySelectorAll("i.up"));
        let i = 0;
        for (i = 0; i < navbar.length; i++) {
          navbar[i].className = "sub-list expanded";
        }
        for (i = 0; i < icons.length; i++) {
          icons[i].className = "entity-icon down";
        }
      }
    }
  }

  onHideAllMenu = (e: any) => {
    e.preventDefault();
    const parent = this.findParent(e.currentTarget, "NAV");
    if (parent) {
      parent.classList.add("collapsed-all");
      parent.classList.remove("expanded-all");
      const navbar = Array.from(
        parent.querySelectorAll(".sidebar>nav>ul>li>ul.expanded")
      );
      if (navbar.length > 0) {
        const icons = Array.from(parent.querySelectorAll("i.down"));
        let i = 0;
        for (i = 0; i < navbar.length; i++) {
          navbar[i].className = "sub-list";
        }
        for (i = 0; i < icons.length; i++) {
          icons[i].className = "entity-icon up";
        }
      }
    }
  };
}
</script>
