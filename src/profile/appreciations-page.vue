<template>
  <div class="profile view-container">
    <form id="userForm" name="userForm" ref="form">
      <header class="border-bottom-highlight">
        <div class="cover-image">
          <img
            src="https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg"
            alt="cover"
          />
          <div class="contact-group">
            <button id="btnPhone" name="btnPhone" class="btn-phone" />
            <button id="btnEmail" name="btnEmail" class="btn-email" />
          </div>
          <button id="btnFollow" name="btnFollow" class="btn-follow">
            Follow
          </button>
        </div>
        <button id="btnCamera" name="btnCamera" class="btn-camera" />
        <div class="avatar-wrapper">
          <img
            class="avatar"
            :src="
              user.imageURL ||
              'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'
            "
            alt="avatar"
          />
          <img class="profile-status" :src="imageOnline" alt="status" />
        </div>
        <div class="profile-title">
          <h3>{{ user.username }}</h3>
          <p>{{ user.website }}</p>
        </div>
        <div class="profile-followers">
          <p><i class="material-icons highlight">group</i> {{ followers }}</p>
          <p>
            <i class="material-icons highlight">group_add</i> {{ following }}
          </p>
        </div>
      </header>

      <div class='row top-content sort-content'>
          <section class='section-appreciate'>
            <button @click.prevent="openModal">Send</button>
          </section>
          <select class='comments-sort btn button' @change="handleSort" defaultValue='relevance'>
            <option value='relevance'>Top Reply</option>
            <option value='time'>Newest First</option>
          </select>
        </div>
        <div class='title'>
          <span><b>{{resource.reviews}}</b></span>
        </div>
        <Appreciations 
        :appreciations = appreciations
        @moreAppreciate = moreAppreciate
        @reLoadData = reLoadData
        />

        <PostAppreciationForm 
        :isOpenAppreciationModal = isOpenAppreciationModal
        @onModelClose = onModelClose
        @setData = setData
      />
    </form>
  </div>
</template>

<script lang="ts">
import {
  getResource,
  handleError,
  initForm,
  registerEvents,
  StringMap,
} from "uione";
import { Options, Vue } from "vue-class-component";
import Appreciations from "./appreciations.vue";
import PostAppreciationForm from "./post-appreciation-form.vue";
import imageOnline from "../assets/images/online.svg";
import { getMyProfileService, User } from "./user";
import { Appreciation, AppreciationFilter } from './appreciation/index';
import { useAppreciationService } from './user/index';
import { storage } from 'uione';

@Options({
    components: {
        Appreciations,
        PostAppreciationForm
    }
})
export default class AppreciationsPage extends Vue  {
    imageOnline = imageOnline;
    user: User = {} as any;
    resource!: StringMap;
    form: any;
    isOpenAppreciationModal: boolean = false;
    id: string = '';
    appreciations: Appreciation[] = [] as any;
    limit: number = 24;

    created() {
        this.resource = getResource().resource();
        const id = this.$route.params.id as string;
        this.id = id;
        getMyProfileService()
        .getMyProfile(id)
        .then((usr) => {
            if (usr) {
            this.user = usr;
            }
        })
        .catch(handleError);

        Promise.all([
        ])
        .then(() => {
            if (id) {
                this.loadData(id);
            }
        })
        .catch(err => {
            console.log(err);
            
        });
    }

    mounted() {
        this.form = initForm(this.$refs.form as any, registerEvents);
    }

    loadData = async (id: string) => {
        if(id)
        {
            const appreciateSM = new AppreciationFilter();
            appreciateSM.userId = id;
            appreciateSM.limit = this.limit;
            appreciateSM.userIdUseful= storage.getUserId();
            // console.log('filter', appreciateSM);
            
            const appreciationService = useAppreciationService();
            const searchResult = await appreciationService.search(appreciateSM);
            this.appreciations = searchResult.list;
        }
    }

    openModal = () => {
      this.isOpenAppreciationModal = true;
    };

    onModelClose = () => {
      this.isOpenAppreciationModal = false;
    }
    moreAppreciate = () => {
      this.limit += 3; 
      this.loadData(this.id);
    }

    reLoadData = () => {
        this.loadData(this.id)
    }

    setData= (data: any) => {

      let newList = [data, ...this.appreciations];
      // newList.unshift(data);
      this.appreciations = newList;
    }
}

</script>

<style scoped>
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

.summary>h1 {
  padding: 30px;
  text-align: center;
}

.score {
  height: 57%;
  line-height: 55px;
}

.score>span {
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

.rv-star {
  min-width: 30%;
}

.rv-star>i::before {
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
  box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
}

.progress>span {
  display: block;
  height: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color: #B453E5;
  box-shadow:
    inset 0 2px 9px rgba(255, 255, 255, 0.3),
    inset 0 -2px 6px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.rv-star2>i::before {
  content: '\2605';
  font-style: normal;
  font-size: 15px;
}

.rv-star3>i::before {
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

.rating>p {
  color: black;
  padding-top: 10px;
  margin-left: 30px;
}

/* ---------- rate*/
.rate {
  margin: 10px;
}

.rate>i {
  font-style: normal;
  line-height: 50px;
}

.rate>i::before {
  content: '\2605';
  width: 50px;
  vertical-align: middle;
  text-align: center;
  display: inline-block;
  font-size: 53px;
}

.rate>i:hover {
  cursor: pointer;
  color: #A043D7;
}

.star-1 i:nth-child(1) {
  color: #A043D7;
}

.star-2 i:nth-child(2) {
  color: #A043D7;
}

.star-3 i:nth-child(3) {
  color: #A043D7;
}

.star-4 i:nth-child(4) {
  color: #A043D7;
}

.star-5 i:nth-child(5) {
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

.empty-stars:before,
.full-stars:before {
  content: "\2605\2605\2605\2605\2605";
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

ul.list-view.row>li.col.review-custom {
  padding-bottom: 16px;
}

.review-custom>.card {
  display: flex;
  flex-direction: column;
  padding: 5px 16px;
  border-radius: 20px;
  background-color: #F5F5F5;
}

.review-custom>.card>h4 {
  padding-left: 0;
  padding-right: 0;
  font-size: 18px;
  color: #4d4d4d;
}

.review-custom>.card>p {
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  margin-block-end: 0;
  color: darkgrey;
}

.review-custom>.card>div.star-1,
.review-custom>.card>div.star-2,
.review-custom>.card>div.star-3,
.review-custom>.card>div.star-4,
.review-custom>.card>div.star-5 {
  width: 100%;
}

.review-custom>.card>div.description,
.review-custom>.card>span {
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  color: #4d4d4d;
}

.title {
  margin: 0px 16px;
}

.title>span,
.user-title>span {
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

article>h4 {
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
  -webkit-filter: drop-shadow(0 2px 3px hsla(0, 0%, 0%, .25));
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

.section-appreciate {
  padding: 20px;
  border-radius: 20px;
  background-color: #ffffff;
}

.input-appreciate {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
  border: none;
  outline: none;
  background-color: #f5f5f5;
  /* background-color: #b4b2b2; */
  width: 100%;
  border-radius: 10px;
  height: 30px;
  margin-bottom: 10px;
}

.input-appreciate:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
  border: none;
  outline: none;
}

.sort-content {
  justify-content: space-between;
  padding-right: 16px !important;
}

.comments-sort {
  height: 34px;
  min-width: 200px;
  border: 1px solid;
  border-radius: 20px;
  padding-left: 14px;
  color: #777777;
  border-color: #777777;
  font-size: 14px;
}

.review-custom .appreciation-section {
  align-items: flex-start !important;

}

.review-custom .appreciation-section button {
  padding: 1px 0px;
  color: #b453e5;
}

.review-custom .more-appreciations {
  margin-left: 100px;
  width: calc(100% - 100px)!important;
  list-style-type: none;
  border-bottom: none !important;
}
.review-custom button{
  box-shadow: none;
  border: none;
  background-color: inherit;
}
.useful-button{
  cursor: pointer;
}
</style>