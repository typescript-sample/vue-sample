<template>
  <ul :class="containerClass" v-if="!noLiSurround">
    <li v-if="firstLastButton" :class="[pageClass, firstPageSelected() ? disabledClass : '']">
      <a @click="selectFirstPage()" @keyup.enter="selectFirstPage()" :class="pageLinkClass"
         :tabindex="firstPageSelected() ? -1 : 0" v-html="firstButtonText"></a>
    </li>

    <!-- <li v-for="page in pages"
        :class="[pageClass, page.selected ? activeClass : '', page.disabled ? disabledClass : '', page.breakView ? breakViewClass: '']">
      <a v-if="page.breakView" :class="[pageLinkClass, breakViewLinkClass]" tabindex="0">
        <slot name="breakViewContent">{{ breakViewText }}</slot>
      </a>
      <a v-else-if="page.disabled" :class="pageLinkClass" tabindex="0">{{ page.content }}</a>
      <a v-else v-on:click="handlePageSelected(page.index + 1, $event)"
         @keyup.enter="handlePageSelected(page.index + 1)"
         :class="pageLinkClass" tabindex="0">{{ page.content }}</a>
    </li> -->

    <li v-if="firstLastButton" :class="[pageClass, lastPageSelected() ? disabledClass : '']">
      <a @click="selectLastPage()" @keyup.enter="selectLastPage()" :class="pageLinkClass"
         :tabindex="lastPageSelected() ? -1 : 0" v-html="lastButtonText"></a>
    </li>
  </ul>

  <div :class="containerClass" v-else>
    <a v-if="firstLastButton" @click="selectFirstPage()" @keyup.enter="selectFirstPage()"
       :class="[pageLinkClass, firstPageSelected() ? disabledClass : '']" tabindex="0" v-html="firstButtonText"></a>
    <!-- <template v-for="page in pages">
      <a v-if="page.breakView" :class="[pageLinkClass, breakViewLinkClass, page.disabled ? disabledClass : '']"
         tabindex="0">
        <slot name="breakViewContent">{{ breakViewText }}</slot>
      </a>
      <a v-else-if="page.disabled" :class="[pageLinkClass, page.selected ? activeClass : '', disabledClass]"
         tabindex="0">{{ page.content }}</a>
      <a v-else @click="handlePageSelected(page.index + 1)" @keyup.enter="handlePageSelected(page.index + 1)"
         :class="[pageLinkClass, page.selected ? activeClass : '']" tabindex="0">{{ page.content }}</a>
    </template> -->
  <a v-if="firstLastButton" @click="selectLastPage()" @keyup.enter="selectLastPage()"
       :class="[pageLinkClass, lastPageSelected() ? disabledClass : '']" tabindex="0" v-html="lastButtonText"></a>
  </div>
</template>

<script lang="ts">
// import {Component, Prop, Vue} from 'vue-property-decorator';
// export interface PageItem {
//   pageIndex?: number;
//   itemsPerPage?: number;
// }

// @Component({
//   name: 'paginateVue'
// })
// export default class PaginateVue extends Vue {
//   @Prop({required: false}) private value: number;
//   @Prop({required: true, default: 0}) private itemTotal: number;
//   @Prop({required: true, default: 0}) private itemsPerPage: number;
//   @Prop({required: false}) private forcePage: number;
//   @Prop({required: false}) private clickHandler: (t: PageItem, e?: MouseEvent) => void;
//   @Prop({required: true, default: 3}) private pageRange: number;
//   @Prop({required: true, default: 1}) private marginPages: number;
//   @Prop({required: false, default: '…'}) private breakViewText: string;
//   @Prop({required: false, default: 'pagination'}) private containerClass: string;
//   @Prop({required: false, default: 'page-item'}) private pageClass: string;
//   @Prop({required: false, default: 'page-link'}) private pageLinkClass: string;
//   @Prop({required: false, default: ''}) private breakViewClass: string;
//   @Prop({required: false, default: ''}) private breakViewLinkClass: string;
//   @Prop({required: false, default: 'active'}) private activeClass: string;
//   @Prop({required: false, default: 'disabled'}) private disabledClass: string;
//   @Prop({required: false, default: false}) private noLiSurround: boolean;
//   @Prop({required: false, default: false}) private firstLastButton: boolean;
//   @Prop({required: false, default: 'First'}) private firstButtonText: string;
//   @Prop({required: false, default: 'Last'}) private lastButtonText: string;
//   @Prop({required: false, default: true}) private hidePrevNext: boolean;
//   innerValue = 1;
//   pageCount = 0;

//   get selected() {
//     return this.value || this.innerValue;
//   }
//   set selected(newValue: number) {
//     this.innerValue = newValue;
//   }
//   getPageCount(): number {
//     return Math.ceil(Number(this.itemTotal) / Number(this.itemsPerPage));
//   }
//   get pages() {
//     this.pageCount = this.getPageCount();
//     const items = {};
//     if (this.pageCount <= this.pageRange) {
//       for (let index = 0; index < this.pageCount; index++) {
//         const page = {
//           index,
//           content: index + 1,
//           selected: index === (this.selected as any - 1)
//         };
//         items[index] = page;
//       }
//     } else {
//       const halfPageRange = Math.floor(this.pageRange as any / 2);
//       const setPageItem = index => {
//         const page = {
//           index,
//           content: index + 1,
//           selected: index === (this.selected as any - 1)
//         };
//         items[index] = page;
//       };
//       const setBreakView = index => {
//         const breakView = {
//           disabled: true,
//           breakView: true
//         };
//         items[index] = breakView;
//       };
//       // 1st - loop thru low end of margin pages
//       for (let i = 0; i < this.marginPages; i++) {
//         setPageItem(i);
//       }
//       // 2nd - loop thru selected range
//       let selectedRangeLow = 0;
//       if (this.selected as any - halfPageRange > 0) {
//         selectedRangeLow = this.selected as any - 1 - halfPageRange;
//       }
//       let selectedRangeHigh = selectedRangeLow + Number(this.pageRange) as number - 1;
//       if (selectedRangeHigh >= this.pageCount as any) {
//         selectedRangeHigh = this.pageCount as any - 1;
//         selectedRangeLow = selectedRangeHigh - Number(this.pageRange) + 1;
//       }
//       for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= this.pageCount as any - 1; i++) {
//         setPageItem(i);
//       }
//       // Check if there is breakView in the left of selected range
//       if (selectedRangeLow > this.marginPages) {
//         setBreakView(selectedRangeLow - 1);
//       }
//       // Check if there is breakView in the right of selected range
//       if (selectedRangeHigh + 1 < Number(this.pageCount) - Number(this.marginPages)) {
//         setBreakView(selectedRangeHigh + 1);
//       }
//       // 3rd - loop thru high end of margin pages
//       for (let i = Number(this.pageCount) - 1; i >= Number(this.pageCount) - Number(this.marginPages); i--) {
//         setPageItem(i);
//       }
//     }
//     return items;
//   }
//   beforeUpdate() {
//     if (this.forcePage === undefined) { return; }
//     if (this.forcePage !== this.selected) {
//       this.selected = this.forcePage;
//     }
//     this.pageCount = this.getPageCount();
//   }
//   handlePageSelected(selected: number, event?: MouseEvent) {
//     if (event) {
//       event.preventDefault();
//     }
//     if (this.selected === selected) { return; }
//     this.innerValue = selected;
//     this.$emit('input', selected);
//     this.clickHandler({pageIndex: selected, itemsPerPage: this.pageRange}, event);
//   }
//   firstPageSelected() {
//     return this.selected === 1;
//   }
//   lastPageSelected() {
//     return (this.selected === this.pageCount) || (this.pageCount === 0);
//   }
//   selectFirstPage() {
//     if (this.selected <= 1) { return; }
//     this.handlePageSelected(1);
//   }
//   selectLastPage() {
//     if (this.selected >= this.pageCount) { return; }
//     this.handlePageSelected(this.pageCount);
//   }
// }
</script>
