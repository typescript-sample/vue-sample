<template>
  <li
    v-if="module && module.children && Array.isArray(module.children)"
    :class="'open' + this.activeWithPath(link, true, features)"
  >
    <a class="menu-item" @click="toggleMenuItem">
      <button
        type="button"
        :class="`btn-pin ${isPinnedModules ? 'pinned' : ''}`"
        @click="pinModulesHandler(index, module.sequence)"
      />
      <i class="material-icons">{{ className }}</i>
      <!-- <i :class="`mdi mdi-${className}`"></i> -->

      <span>{{ name }}</span>
      <i class="entity-icon down" />
    </a>
    <ul
      class="list-child"
      v-if="module && module.children && Array.isArray(module.children)"
    >
      <li
        is="vue:item-link"
        v-for="(module, index) in featuresChild"
        :features="features"
        :key="index"
        :index="index"
        v-bind:pinnedModules="[]"
        :module="module"
        :isPinnedModules="false"
      ></li>
    </ul>
  </li>
  <li v-else :class="activeWithPath(module.path, false)">
    <router-link :to="module.path" class="menu-item">
      <i class="material-icons">{{ className }}</i>
      <!-- <i :class="`mdi mdi-${className}`"></i> -->
      <span>{{ name }}</span>
    </router-link>
  </li>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { resources } from "../resources";
import ItemLink from "./ItemLink.vue";
@Options({
  name: "item-link",
  props: {
    module: { required: true },
    features: { required: true },
    index: { required: true },
    pinnedModules: { required: false },
    isPinnedModules: { required: false, default: false },
  },
  components: {
    "item-link": ItemLink,
  },
})
export default class extends Vue {
  private module: any;
  private features: any;
  private index: any;
  private pinnedModules: any;
  private isPinnedModules: boolean;

  private resource: any = resources["en"];
  private className: any = "";
  private link: any;
  private name: any;
  private featuresChild: any;

  get getPinnedModules() {
    return this.pinnedModules;
  }

  created() {
    const module = this.module;
    if (module) {
      this.name =
        !this.resource[module.resourceKey] ||
        this.resource[module.resourceKey] === ""
          ? module.name
          : this.resource[module.resourceKey];
      if (module && module.children && Array.isArray(module.children)) {
        this.className =
          !module.icon || module.icon === "" ? "settings" : module.icon;
        this.link = module.path;
        this.featuresChild = module.children;
      } else {
        this.className =
          !module.icon || module.icon === "" ? "settings" : module.icon;
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
  activeWithPath = (path: string, isParent: boolean, features?: any[]) => {
    const pathName = window.location.pathname;
    if (isParent && features && Array.isArray(features)) {
      const hasChildLink = features.some((item) =>
        pathName.startsWith(item["link"])
      );
      return path && pathName.startsWith(path) && hasChildLink ? "active" : "";
    }
    return path && pathName.startsWith(path) ? "active" : "";
  };

  pinModulesHandler(index: any, moduleSequence: any) {
    const pinnedModulesTemp = Object.assign([], this.getPinnedModules);
    if (
      this.features.find(
        (moduleItem: any) =>
          moduleItem && moduleItem["sequence"] === moduleSequence
      )
    ) {
      const removedModule = this.features.splice(index, 1);
      pinnedModulesTemp.push(removedModule[0]);
      this.features.sort(
        (moduleA: any, moduleB: any) => moduleA.sequence - moduleB.sequence
      );
    } else {
      if (pinnedModulesTemp.length > 0) {
        const removedModule = pinnedModulesTemp.splice(index, 1);
        this.features.push(removedModule[0]);
        this.features.sort(
          (moduleA: any, moduleB: any) => moduleA.sequence - moduleB.sequence
        );
      }
    }
    this.$emit("setPinnedModules", pinnedModulesTemp);
  }
  isCollapsedAll(parent: HTMLElement): boolean {
    const navbar = Array.from(
      parent.querySelectorAll(".sidebar>nav>ul>li>ul.list-child")
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
      parent.querySelectorAll(".sidebar>nav>ul>li>ul.list-child")
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
