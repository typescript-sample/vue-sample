<template>
  <ul class='row list-view' v-if="appreciations">
      <!-- {
        appreciations && appreciations.length > 0 &&
        (appreciations.map((value: Appreciation, index: number) => {
          return <AppreciationReplys replyAppreciation={false} data={value} key={value.id} />;
        }) || '')
      } -->
      <AppreciationReplys  
      v-for="(appreciation) in appreciations" 
      :key="appreciation.id" 
      :appreciation = appreciation
      :replyAppreciation="false"
      @setDataAppreciation = setDataAppreciation
      @reLoadData = reLoadData
       />
      
    </ul>
    <div class='col s12 m12 l12 more-reviews-div'>
        <span class='more-reviews' @click.prevent="moreAppreciate()">
            <b>MORE REVIEWS</b>
        </span>
    </div>
</template>

<script lang="ts">


import { Appreciation } from './appreciation/index';
import { Options, Vue } from "vue-class-component";
import AppreciationReplys from "./appreciation.vue";

@Options({
    components: {
        AppreciationReplys
    },
    props:[
        'appreciations',
    ],
    emits: ["reLoadData", 'moreAppreciate'],
    
})
export default class Appreciations extends Vue {
    
    appreciations: Appreciation[] = [] as any;
    
    // created() {
    //     this.resource = getResource().resource();
    //     // const id = this.$route.params.id as string;
    //     // this.id = id;
    // }

    moreAppreciate = () => {
        this.$emit('moreAppreciate');
        
    };

    reLoadData = () => {
        this.$emit("reLoadData");
    }

}
</script>
