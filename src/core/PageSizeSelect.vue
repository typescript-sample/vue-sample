<template>
  <select :value="pageSize" :change="onPageSizeChanged">
    <option v-for="pgSize in pageSizes" :key="pgSize" :value="pgSize">
      {{ pgSize }}
    </option>
    )
  </select>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "PageSizeSelect",
  props:{
    pageSizes: {
    required: true,
  },
  pageSize: {
    required: true,
  },
  onPageSizeChanged: {
    required: true,
  },
  }
})
export default class extends Vue {
  private pageSizes: number[];
  private pageSize: number[];
  private onPageSizeChanged: () => void;
}
</script>
