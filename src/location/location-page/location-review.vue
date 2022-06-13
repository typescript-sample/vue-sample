<template>
<div class='profile view-container'>
  <form id='locationForm' name='locationForm'>
    <Menu :locationProps = location />
    <div>
        <div class='row top-content'>
          <div class='col s4 m5 l6 summary' v-if="location.info">
            <div class='score' >
                <span>{{locationRate()}}</span>
            </div>
            <div class='average'>
              <div class='empty-stars' />
              <div class='full-stars'
                :style="{width: `${percent}%`}" />
            </div>
          </div>
          <div class='col s8 m7 l6'>
            <div v-for="index in 5" :key="index">
              <div class='detail'>
                
                  <!-- {{Array(index).fill(<i />)}} -->
                  <div class='rv-star' v-if="index == 1">
                    <i />
                  </div>
                  <div class='rv-star' v-else-if="index == 2">
                    <i /><i />
                  </div>
                  <div class='rv-star' v-else-if="index == 3">
                    <i /><i /><i />
                  </div>
                  <div class='rv-star' v-else-if="index == 4">
                    <i /><i /><i /><i />
                  </div>
                  <div class='rv-star' v-else>
                    <i /><i /><i /><i /><i />
                  </div>
                
                <div :key="index" class='progress' >
                  <span v-if="index == 1" :style="{ width: `${percentRate1}%` }" />
                  <span v-else-if="index == 2" :style="{ width: `${percentRate2}%` }" />
                  <span v-else-if="index == 3" :style="{ width: `${percentRate3}%` }" />
                  <span v-else-if="index == 4" :style="{ width: `${percentRate4}%` }" />
                  <span v-else :style="{ width: `${percentRate5}%` }" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='row mid-content'>
          <div class='col s12 m12 l12 rating'>
            <p>{{ resource.rating_text  }}</p>
            <div id='rate' :class="rateClassName">
                            <i
                      v-for="index in 5"
                    :key="index"
                    @click="handleOnclick(index)"
                    @mouseenter="handleOnMouseEnter(index)"
                    @mouseleave="handleOnMouseLeave()"
                  />
            </div>
          </div>
        </div>
        <div class='title'>
          <span><b>{{resource.reviews}}</b></span>
        </div>
        <ul class='row list-view' v-if="rates">
          <li v-for="(value, index) in rates" :key="index" class='col s12 m12 l12 review-custom'>
              <section class='card'>
                <h4> {{ value.userId }} </h4>
                <p>{{ fomatDate(value.rateTime) }}</p>
                <div class= 'rv-star2' :class="classes(value.rate)">
                      <i /><i /><i /><i /><i />
                </div>
                <span>{{  formatReviewText(value.review) }} </span>
              </section>
          </li>
        </ul>
        <div class='col s12 m12 l12 more-reviews-div'>
          <span class='more-reviews' @click.prevent="moreReview">
            <b>MORE REVIEWS</b>
          </span>
          </div>

        <!-- <div 
        :isOpen="isOpenRateModal" 
        :style="customStyles" 
        contentLabel="Modal"  
        portalClassName='modal-portal'
        class='modal-portal-content small-width'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
        > -->
          
          
        <!-- </div> -->
        <!-- <ReactModal
          isOpen={}
          style={customStyles}
          contentLabel='Modal'
          portalClassName='modal-portal'
          class='modal-portal-content small-width'
          bodyOpenClassName='modal-portal-open'
          overlayClassName='modal-portal-backdrop'>

          <PostRateForm value={voteStar} location={location} closeModal={() => setIsOpenRateModal(false)} loadData={load} />
        </ReactModal> -->
    </div>
  </form>
  <PostRateForm 
    :location = location 
    :voteStar = voteStar
    :isOpenRateModal = isOpenRateModal
    @onModelClose = onModelClose
    @reLoadData = reLoadData
  />
</div>
</template>

<script lang="ts">
import {
  inputEdit,
} from "uione";
import { Options } from "vue-class-component";
import { buildId, EditComponent } from "vuex-one";
import { Location } from "../service/location";
import { LocationRateFilter, LocationRate } from "../service/location-rate";
import {  getLocations, getLocationRates  } from "../service";
import Menu from "./index.vue";
import PostRateForm from "./post-rate-form.vue";


@Options({
    components: {
        Menu,
        PostRateForm
    }
})
export default class Review extends EditComponent<Location, string>{
    
    percent: number = 0;
    percentRate1: number = 0;
    percentRate2: number = 0;
    percentRate3: number = 0;
    percentRate4: number = 0;
    percentRate5: number = 0;
    location: Location = {} as any;
    rateClassName: string = 'rate';
    currClass: string = 'rate';
    voteStar: number = 0;
    isOpenRateModal: boolean = false;
    rates: LocationRate[] = [];
    pageSize: number = 3;
    customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      }
    };

  created() {
    this.onCreated(getLocations(), inputEdit());
  }

  mounted() {
    // this.form = initForm(this.$refs.form as any, registerEvents);
    const id = buildId<string>(this.$route) ;
    Promise.all([
    ])
      .then(() => {
        if (id) {
          this.load(id);
          this.loadData(id);
        }
        
      })
      .catch(this.handleError);  
  }

  loadData = async (id:any, page: number = 0) => {
    const locationRateSM = new LocationRateFilter();
    locationRateSM.locationId = id;
    locationRateSM.limit = this.pageSize + page;
    locationRateSM.sort = '-rateTime';
    const locationRateService = getLocationRates();
    const searchResult = await locationRateService.search(locationRateSM);
    this.rates = searchResult.list
  }

  moreReview() { 
    this.loadData(this.location?.id, 3);
    this.rateClassName = 'rate';
    this.currClass = 'rate';
    this.pageSize = this.pageSize + 3;
  }

  showModel(obj: Location) {
    this.location = obj;
  }

  locationRate(){
      let rate = this.location.info?.rate;
      if(rate)
      {
        this.renderDetailStar();
        this.calculatorPercentStar(rate)
        return Math.ceil( rate * 100) / 100;
      }
      else
      return 0
  }

  calculatorPercentStar(value: any) {
    this.percent = Number(value * 100 / 5);
  }

  renderDetailStar() {
    this.percentRate1 = this.location.info?.rate1 ? this.location.info?.rate1 : 0;
    this.percentRate2 = this.location.info?.rate2 ? this.location.info?.rate2 : 0;
    this.percentRate3 = this.location.info?.rate3 ? this.location.info?.rate3 : 0;
    this.percentRate4 = this.location.info?.rate4 ? this.location.info?.rate4 : 0;
    this.percentRate5 = this.location.info?.rate5 ? this.location.info?.rate5 : 0;
  }


  handleOnclick = (n: number) => {
    const newCurrClass = this.generateRatingClasses(n);
    this.currClass = newCurrClass;
    this.voteStar = n;
    this.isOpenRateModal = true;
    this.rateClassName = this.currClass;
    console.log('check', this.isOpenRateModal);
    
  };

    generateRatingClasses = (n: number) => {
    const className = ['rate'];
    for (let i = 1; i <= n; i++) {
      className.push(`star-${i}`);
    }
    return className.join(' ');
  };

  handleOnMouseEnter = (n: number) => {
    const rateClass = this.generateRatingClasses(n);
    this.rateClassName = rateClass;
  };

  handleOnMouseLeave = () => {
    this.rateClassName = this.currClass;
    // console.log('leave:::', this.rateClassName);
    
  };

   fomatDate = (date: Date): string => {
        let newDate = new Date(date);
        let time = newDate.toLocaleDateString();
        return time;
    }

    classes(value: number) {
      return  Array.from(Array(value).keys()).map(i => `star-${i + 1}`).join(' ');
    }

    formatReviewText(text:string) {
      const maxLengthReviewText: number = 65;
      if (text && text.length > maxLengthReviewText) {
        let textsub: string = text.substring(0, maxLengthReviewText);
        textsub = textsub + ' ...';
        // const a = <span>{resource.review} {textSub} <span className='more-reviews'>More</span></span>;
        return textsub;
      } else {
        return text;
      }
    }

    onModelClose(){
      this.isOpenRateModal=false;
      this.voteStar = 0;
    }

    reLoadData(){
      this.loadData(this.location.id);
    }

}
</script>

<style>

.top-content {
  margin-top: 20px;
}
/* ------ left*/
.summary {
  display: flex;
  justify-content: center;
  padding-right: 0px !important;
  height: 90%;
  flex-flow: column;
  align-items: center;
}

.summary > h1 {
  padding: 30px;
  text-align: center;
}

.score {
  height: 57%;
  line-height: 55px;
}

.score > span {
  text-align: center;
  font-size: 57px;
  color: #000000;
}
/* ------ right */
.detail {
  display: flex;
  justify-content: space-between;
  height: 1.2em;
}

.rv-star  {
  min-width: 30%;
}

.rv-star > i::before {
  content: '\2605';
  font-style: normal;
  display: inline;
  font-size: 15px;
  color: #A043D7;
}
/* ---------- progress*/
.progress { 
  display: inline;
  height: 5px;
  width: 300px;
  position: relative;
  margin: 10px;
	background: #F5F5F5;
	-moz-border-radius: 25px;
	-webkit-border-radius: 25px;
	border-radius: 25px;
	box-shadow: inset 0 -1px 1px rgba(255,255,255,0.3);
}

.progress > span {
  display: block;
  height: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color: #B453E5;
  box-shadow: 
    inset 0 2px 9px  rgba(255,255,255,0.3),
    inset 0 -2px 6px rgba(0,0,0,0.4);
  position: relative;
  overflow: hidden;
}

.rv-star2 > i::before {
    content: '\2605';
    font-style: normal;
    font-size: 15px;
}

.rv-star3 > i::before {
    content: '\2605';
    font-style: normal;
    font-size: 50px;
    margin: 3px;
}

.mid-content {
  justify-content: space-around;
  padding: 20px 16px;
  margin-left: unset;
  margin-right: unset;
}

.rating {
  background-color: #F5F5F5;
  border-radius: 20px;
  text-align: center;
}

.rating > p {
  color: black;
  padding-top: 10px;
  margin-left: 30px;
}
/* ---------- rate*/
.rate {
  margin: 10px;
}

.rate > i {
  font-style: normal;
  line-height: 50px;
}

.rate > i::before {
    content: '\2605';
    width:  50px;
    vertical-align: middle;
    text-align: center;
    display: inline-block;
    font-size: 53px;
}

.rate > i:hover {
  cursor: pointer;
  color: #A043D7;
}

.star-1 i:nth-child(1){
    color: #A043D7;
}
.star-2 i:nth-child(2){
    color: #A043D7;
}
.star-3 i:nth-child(3){
    color: #A043D7;
}
.star-4 i:nth-child(4){
    color: #A043D7;
}
.star-5 i:nth-child(5){
    color: #A043D7;
}

.average {
  position: relative;
  vertical-align: middle;
  display: inline-block;
  color: #b1b1b1;
  overflow: hidden;
}

.full-stars {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  overflow: hidden;
  color: #B453E5;
}

.empty-stars:before, .full-stars:before {
  content:"\2605\2605\2605\2605\2605";
  font-size: 17pt;
}

.rateReview {
  font-size: 15px;
  height: 207px;
  width: 90%;
  border-radius: 20px;
  margin-left: 15px;
  margin-right: 15px;
}
ul.list-view.row > li.col.review-custom {
  padding-bottom: 16px;
}
.review-custom > .card {
  display: flex;
  flex-direction: column;
  padding: 5px 16px;
  border-radius: 20px;
  background-color: #F5F5F5;
}

.review-custom > .card > h4 {
  padding-left: 0;
  padding-right: 0;
  font-size: 18px;
  color: #4d4d4d;
}

.review-custom > .card > p {
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  margin-block-end: 0;
  color: darkgrey;
}

.review-custom > .card > div.star-1,
.review-custom > .card > div.star-2,
.review-custom > .card > div.star-3,
.review-custom > .card > div.star-4,
.review-custom > .card > div.star-5 {
  width: 100%;
}

.review-custom > .card > div.description,
.review-custom > .card > span {
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  color: #4d4d4d;
}

.title {
  margin: 0px 16px;
}

.title > span, .user-title > span {
  font-style: normal;
  font-size: 18px;
  color: #4D4D4D;
}

.user-title {
  text-align: center;
  padding-top: 15px;
  padding-bottom: 0px !important;
}

.user-star {
  text-align: center;
  padding-bottom: 0px !important;
}

.rateReview {    
  resize: none;
  border-color: #EDEDED;
  padding: 10px;
}

.rateReview:focus {
  outline: none;
}

.rateReview::placeholder {
  color: #BFBFBF;
}

.addPhoto {
  display: flex;
  color: #B453E5;
  border-color: #B453E5;
  border: 1px solid;
  background-color: white;
  line-height: 30px;
  border-radius: 9px;
  padding: 2px 10px;
}
.addPhoto:focus {
  outline: none;
}

article > h4 {
  margin: 0px;
} 

.camera {
  background-image: radial-gradient(circle, transparent 25%, #B453E5 25%, #B453E5 35%, transparent 35%, transparent 45%, #B453E5 45%);
  border-radius: .25em;
  display: flex;
  height: 1.2em;
  left: 50%;
  margin-top: 7px;
  top: 50%;
  width: 1.9em;
  -webkit-filter: drop-shadow(0 2px 3px hsla(0,0%,0%,.25));
}

.camera:after {
  background-color: #B453E5;
  content: '';
  height: .27em;
  left: 0.3em;
  position: absolute;
  top: -.25em;
  border-radius: 2px;
  width: .5em;
}

.camera:before {
  border: .27em solid #B453E5;
  border-bottom: none;
  border-radius: .25em .25em 0 0;
  content: '';
  left: .7em;
  position: absolute;
  top: -.25em;
  width: .84em; 
  
}

.text-camera {
  font-style: normal;
  margin-left: 10px;
  font-size: 13px;
}

section.user-input {
  text-align: center;
  padding-bottom: 5px !important;
}

.takePhoto {
  display: inline-block;
  width: 90%;
  margin-left: 15px;
    margin-right: 15px;
    text-align: left;
}

.more-reviews {
  color: #B453E5;
}

.more-reviews:hover {
  cursor: pointer;
  color: #B453E5;
}

.more-reviews-div {
  display: flex;
  justify-content: center;
}

.three-dot {
  display: inline-block;
  width: 180px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  font-size: 18px;
}



</style>