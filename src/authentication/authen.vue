<template>
  <div class="authentication">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class AuthenComponent extends Vue {}
</script>
