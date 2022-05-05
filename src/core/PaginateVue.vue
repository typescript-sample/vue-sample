<template>
  <ul :class="containerClass" v-if="!noLiSurround">
    <li
      v-if="firstLastButton"
      :class="[pageClass, firstPageSelected() ? disabledClass : '']"
    >
      <a
        @click="selectFirstPage()"
        @keyup.enter="selectFirstPage()"
        :class="pageLinkClass"
        :tabindex="firstPageSelected() ? -1 : 0"
        v-html="firstButtonText"
      ></a>
    </li>

    <li
      v-for="page in pages"
      :class="[
        pageClass,
        page.selected ? activeClass : '',
        page.disabled ? disabledClass : '',
        page.breakView ? breakViewClass : '',
      ]"
      :key="page.index"
    >
      <a
        v-if="page.breakView"
        :class="[pageLinkClass, breakViewLinkClass]"
        tabindex="0"
      >
        <slot name="breakViewContent">{{ breakViewText }}</slot>
      </a>
      <a v-else-if="page.disabled" :class="pageLinkClass" tabindex="0">{{
        page.content
      }}</a>
      <a
        v-else
        v-on:click="handlePageSelected(page.index + 1, $event)"
        @keyup.enter="handlePageSelected(page.index + 1)"
        :class="pageLinkClass"
        tabindex="0"
        >{{ page.content }}</a
      >
    </li>

    <li
      v-if="firstLastButton"
      :class="[pageClass, lastPageSelected() ? disabledClass : '']"
    >
      <a
        @click="selectLastPage()"
        @keyup.enter="selectLastPage()"
        :class="pageLinkClass"
        :tabindex="lastPageSelected() ? -1 : 0"
        v-html="lastButtonText"
      ></a>
    </li>
  </ul>

  <div :class="containerClass" v-else>
    <a
      v-if="firstLastButton"
      @click="selectFirstPage()"
      @keyup.enter="selectFirstPage()"
      :class="[pageLinkClass, firstPageSelected() ? disabledClass : '']"
      tabindex="0"
      v-html="firstButtonText"
    ></a>
    <template v-for="page in pages" :key="page.index">
      <a
        v-if="page.breakView"
        :class="[
          pageLinkClass,
          breakViewLinkClass,
          page.disabled ? disabledClass : '',
        ]"
        tabindex="0"
      >
        <slot name="breakViewContent">{{ breakViewText }}</slot>
      </a>
      <a
        v-else-if="page.disabled"
        :class="[
          pageLinkClass,
          page.selected ? activeClass : '',
          disabledClass,
        ]"
        tabindex="0"
        >{{ page.content }}</a
      >
      <a
        v-else
        @click="handlePageSelected(page.index + 1)"
        @keyup.enter="handlePageSelected(page.index + 1)"
        :class="[pageLinkClass, page.selected ? activeClass : '']"
        tabindex="0"
        >{{ page.content }}</a
      >
    </template>
    <a
      v-if="firstLastButton"
      @click="selectLastPage()"
      @keyup.enter="selectLastPage()"
      :class="[pageLinkClass, lastPageSelected() ? disabledClass : '']"
      tabindex="0"
      v-html="lastButtonText"
    ></a>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
export interface PageItem {
  pageIndex?: number;
  itemsPerPage?: number;
}

@Options({
  name: "paginateVue",
  props: {
    value: { required: false },
    itemTotal: { required: true, default: 0 },
    itemsPerPage: { required: true, default: 0 },
    forcePage: { required: false },
    clickHandler: { required: false },
    pageRange: { required: true, default: 3 },
    marginPages: { required: true, default: 1 },
    breakViewText: { required: false, default: "…" },
    containerClass: { required: false, default: "pagination" },
    pageClass: { required: false, default: "page-item" },
    pageLinkClass: { required: false, default: "page-link" },
    breakViewClass: { required: false, default: "" },
    breakViewLinkClass: { required: false, default: "" },
    activeClass: { required: false, default: "active" },
    disabledClass: { required: false, default: "disabled" },
    noLiSurround: { required: false, default: false },
    firstLastButton: { required: false, default: false },
    firstButtonText: { required: false, default: "First" },
    lastButtonText: { required: false, default: "Last" },
    hidePrevNext: { required: false, default: true },
  },
})
export default class PaginateVue extends Vue {
  private value: number;
  private itemTotal: number;
  private itemsPerPage: number;
  private forcePage: number;
  private clickHandler: (t: PageItem, e?: MouseEvent) => void;
  private pageRange: number;
  private marginPages: number;
  private breakViewText: string;
  private containerClass: string;
  private pageClass: string;
  private pageLinkClass: string;
  private breakViewClass: string;
  private breakViewLinkClass: string;
  private activeClass: string;
  private disabledClass: string;
  private noLiSurround: boolean;
  private firstLastButton: boolean;
  private firstButtonText: string;
  private lastButtonText: string;
  private hidePrevNext: boolean;
  innerValue = 1;
  pageCount = 0;

  get selected() {
    return this.value || this.innerValue;
  }
  set selected(newValue: number) {
    this.innerValue = newValue;
  }
  getPageCount(): number {
    return Math.ceil(Number(this.itemTotal) / Number(this.itemsPerPage));
  }
  get pages() {
    this.pageCount = this.getPageCount();
    let items = [];
    if (this.pageCount <= this.pageRange) {
      for (let index = 0; index < this.pageCount; index++) {
        const page = {
          index,
          content: index + 1,
          selected: index === (this.selected as any) - 1,
        };
        items[index] = page;
      }
    } else {
      const halfPageRange = Math.floor((this.pageRange as any) / 2);
      const setPageItem = (index:number) => {
        const page = {
          index,
          content: index + 1,
          selected: index === (this.selected as any) - 1,
        };
        items[index] = page;
      };
      const setBreakView = (index:number) => {
        const breakView = {
          disabled: true,
          breakView: true,
        };
        items[index] = breakView;
      };
      // 1st - loop thru low end of margin pages
      for (let i = 0; i < this.marginPages; i++) {
        setPageItem(i);
      }
      // 2nd - loop thru selected range
      let selectedRangeLow = 0;
      if ((this.selected as any) - halfPageRange > 0) {
        selectedRangeLow = (this.selected as any) - 1 - halfPageRange;
      }
      let selectedRangeHigh =
        ((selectedRangeLow + Number(this.pageRange)) as number) - 1;
      if ((selectedRangeHigh >= this.pageCount) as any) {
        selectedRangeHigh = (this.pageCount as any) - 1;
        selectedRangeLow = selectedRangeHigh - Number(this.pageRange) + 1;
      }
      for (
        let i = selectedRangeLow;
        i <= selectedRangeHigh && ((i <= this.pageCount) as any) - 1;
        i++
      ) {
        setPageItem(i);
      }
      // Check if there is breakView in the left of selected range
      if (selectedRangeLow > this.marginPages) {
        setBreakView(selectedRangeLow - 1);
      }
      // Check if there is breakView in the right of selected range
      if (
        selectedRangeHigh + 1 <
        Number(this.pageCount) - Number(this.marginPages)
      ) {
        setBreakView(selectedRangeHigh + 1);
      }
      // 3rd - loop thru high end of margin pages
      for (
        let i = Number(this.pageCount) - 1;
        i >= Number(this.pageCount) - Number(this.marginPages);
        i--
      ) {
        setPageItem(i);
      }
    }
    return items;
  }
  beforeUpdate() {
    if (this.forcePage === undefined) {
      return;
    }
    if (this.forcePage !== this.selected) {
      this.selected = this.forcePage;
    }
    this.pageCount = this.getPageCount();
  }
  handlePageSelected(selected: number, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    if (this.selected === selected) {
      return;
    }
    this.innerValue = selected;
    this.$emit("input", selected);
    this.clickHandler(
      { pageIndex: selected, itemsPerPage: this.pageRange },
      event
    );
  }
  firstPageSelected() {
    return this.selected === 1;
  }
  lastPageSelected() {
    return this.selected === this.pageCount || this.pageCount === 0;
  }
  selectFirstPage() {
    if (this.selected <= 1) {
      return;
    }
    this.handlePageSelected(1);
  }
  selectLastPage() {
    if (this.selected >= this.pageCount) {
      return;
    }
    this.handlePageSelected(this.pageCount);
  }
}
</script>
