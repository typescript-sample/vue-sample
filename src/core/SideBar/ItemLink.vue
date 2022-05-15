<template>
  <li
    v-if="item && item.children && Array.isArray(item.children)"
    :class="'open' + this.activeWithPath(link, true, items)"
  >
    <a class="menu-item" @click="toggleMenuItem">
      <button
        type="button"
        :class="`btn-pin ${isPinned ? 'pinned' : ''}`"
        @click="pinModulesHandler(index, item.sequence)"
      />
      <i class="material-icons">{{ className }}</i>
      <span>{{ name }}</span>
      <i class="entity-icon down" />
    </a>
    <ul
      class="sub-list"
      v-if="item && item.children && Array.isArray(item.children)"
    >
      <li
        is="vue:item-link"
        v-for="(item, index) in featuresChild"
        :items="items"
        :key="index"
        :index="index"
        v-bind:pinnedItems="[]"
        :item="item"
        :isPinned="false"
      ></li>
    </ul>
  </li>
  <li v-else :class="activeWithPath(item.path, false)">
    <router-link :to="item.path" class="menu-item">
      <i class="material-icons">{{ className }}</i>
      <span>{{ name }}</span>
    </router-link>
  </li>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { resources } from "../resources";
import ItemLink from "./ItemLink.vue";

export interface StringMap {
  [key: string]: string;
}
export interface Item {
  id?: string;
  name: string;
  resource?: string;
  path?: string;
  icon?: string;
  sequence?: number;
  children?: Item[];
}
@Options({
  name: "item-link",
  props: {
    item: { required: true },
    items: { required: true },
    index: { required: true },
    pinnedItems: { required: false },
    isPinned: { required: false, default: false },
  },
  components: {
    "item-link": ItemLink,
  },
})
export default class extends Vue {
  private item?: Item;
  private items!: Item[];
  private index!: number;
  private pinnedItems: any;
  private isPinned!: boolean;

  private resource: StringMap = resources["en"];
  private className?: string;
  private link?: string;
  private name!: string;
  private featuresChild?: Item[];

  get getPinnedItems() {
    return this.pinnedItems;
  }

  created() {
    const item = this.item;
    if (item) {
      const n = item.resource ? this.resource[item.resource] : undefined;
      this.name = n ? n : item.name;
      if (item && item.children && Array.isArray(item.children)) {
        this.className = !item.icon || item.icon === "" ? "settings" : item.icon;
        this.link = item.path;
        this.featuresChild = item.children;
      } else {
        this.className = !item.icon || item.icon === "" ? "settings" : item.icon;
      }
    }
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
  activeWithPath = (path: string, isParent: boolean, items?: Item[]) => {
    const pathName = window.location.pathname;
    if (isParent && items && Array.isArray(items)) {
      const hasChildLink = items.some((item) =>
        item.path && pathName.startsWith(item.path)
      );
      return path && pathName.startsWith(path) && hasChildLink ? "active" : "";
    }
    return path && pathName.startsWith(path) ? "active" : "";
  };

  pinModulesHandler(index: number, sequence?: number) {
    const pinnedModulesTemp = Object.assign([], this.getPinnedItems);
    if (
      this.items.find(
        (moduleItem: Item) =>
          moduleItem && moduleItem.sequence === sequence
      )
    ) {
      const removedModule = this.items.splice(index, 1);
      pinnedModulesTemp.push(removedModule[0]);
      this.items.sort(
        (moduleA: any, moduleB: any) => moduleA.sequence - moduleB.sequence
      );
    } else {
      if (pinnedModulesTemp.length > 0) {
        const removedModule = pinnedModulesTemp.splice(index, 1);
        this.items.push(removedModule[0]);
        this.items.sort(
          (moduleA: any, moduleB: any) => moduleA.sequence - moduleB.sequence
        );
      }
    }
    this.$emit("setPinnedModules", pinnedModulesTemp);
  }
  isCollapsedAll(parent: HTMLElement): boolean {
    const navbar = Array.from(
      parent.querySelectorAll(".sidebar>nav>ul>li>ul.sub-list")
    );
    if (navbar.length > 0) {
      let i = 0;
      for (i = 0; i < navbar.length; i++) {
        if (navbar[i].classList.contains("expanded")) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  isExpandedAll(parent: HTMLElement): boolean {
    const navbar = Array.from(
      parent.querySelectorAll(".sidebar>nav>ul>li>ul.sub-list")
    );
    if (navbar.length > 0) {
      let i = 0;
      for (i = 0; i < navbar.length; i++) {
        if (!navbar[i].classList.contains("expanded")) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  toggleMenuItem = (event: any) => {
    event.preventDefault();
    let target: HTMLElement | null = event.currentTarget;
    const currentTarget = event.currentTarget;
    const nul = currentTarget.nextElementSibling;
    if (nul) {
      const elI = currentTarget.querySelectorAll(".menu-item > i.entity-icon");
      if (nul.classList.contains("expanded")) {
        nul.classList.remove("expanded");
        if (elI && elI.length > 0) {
          elI[0].classList.add("up");
          elI[0].classList.remove("down");
        }
      } else {
        nul.classList.add("expanded");
        if (elI && elI.length > 0) {
          elI[0].classList.remove("up");
          elI[0].classList.add("down");
        }
      }
    }
    if (target && target.nodeName === "A") {
      target = target.parentElement;
    }
    if (target && target.nodeName === "LI") {
      target.classList.toggle("open");
    }
    const parent = this.findParent(currentTarget, "NAV");
    if (parent) {
      setTimeout(() => {
        if (this.isExpandedAll(parent)) {
          parent.classList.remove("collapsed-all");
          parent.classList.add("expanded-all");
        } else if (this.isCollapsedAll(parent)) {
          parent.classList.remove("expanded-all");
          parent.classList.add("collapsed-all");
        } else {
          parent.classList.remove("expanded-all");
          parent.classList.remove("collapsed-all");
        }
      }, 0);
    }
  };
}
</script>
