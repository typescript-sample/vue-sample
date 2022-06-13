<template>
<div>
    <vue-final-modal
            v-model="isOpenRateModal"
            content-class="modal-content"
            classes="modal-container"
            :z-index="1000"
        > 
        <form
        
            id='addNewRate'
            name='addNewRate'
            model-name='addNewRate'
            ref="form"
            class="modal__title"
        >
            
            <header>
            <button
                type='button'
                id='btnClose'
                name='btnClose'
                class='modal__close'
                @click="closeModal"
            ></button>
            <h2>{{location.locationName}}</h2>
            </header>
            <div >
            <section class='user-title'>
                <span>
                <b>{{resource.user_name}}</b>
                </span>
            </section>
            <section class='user-star' >
                {{ renderRateStar(voteStar) }}
            <div :class="rateClassName">
                <i /><i /><i /><i /><i />
            </div>
            </section>
            <section class='user-input'>
                <textarea
                class='rateReview'
                id='review'
                name='review'
                v-model="review"
                :placeholder="resource.placeholder_text"
                />
            </section>
            </div>
            <footer  class="modal__action">
            <button
                type='submit'
                id='btnSave'
                name='btnSave'
                @click="postReview.preventDefault"
            >
                Post
            </button>
            </footer>
        </form>


    </vue-final-modal>
    <!-- <vue-final-modal v-model="isOpenRateModal" classes="modal-container" content-class="modal-content">
      <span class="modal__title">Hello, vue-final-modal</span>
    </vue-final-modal> -->
    </div>
</template>

<script lang='ts'>
import { SearchComponent } from "vuex-one";
import { storage, UserAccount } from 'uione';
import { Options } from "vue-class-component";
import { Location, LocationFilter, } from "../service/location";
import { LocationRate } from "../service/location-rate";
import {  getLocations} from "../service";

@Options({
    props: [
        'location',
        'isOpenRateModal',
        'voteStar',
        'customStyles'
    ],
    emits: ["closeModal"],
})
export default class PostRateForm extends SearchComponent<Location, LocationFilter>{
    review: string = '';
    rateClassName: string = 'rv-star3';
    locationService = getLocations();
    location: Location = {} as any;
    isOpenRateModal: boolean = true;
    voteStar: number = 0;
    // created() {
    //     this.voteStar;
    // }
    closeModal(){
    //     this.usersLookup = [];
    // this.availableUsers = [];
    // if (this.filter) {
    //   this.filter.q = "";
    // }
    // this.userIdsLookup = [];
        this.$emit("onModelClose");
        this.review = '';
    }

    postReview = async () => {
    try {
        
      const user: UserAccount = JSON.parse(sessionStorage.getItem('authService') || '{}') as UserAccount;
      const locationRate: LocationRate = {};
      locationRate.locationId = this.location.id;
      locationRate.userId = user.id;
      locationRate.rate = this.voteStar;
      locationRate.review = this.review;
      locationRate.rateTime = new Date();
      await this.locationService.rateLocation(locationRate);
      storage.message('Your review is submited');
      this.closeModal();
      this.reLoadData();
    } catch (err) {
      storage.alert('error');
    }
  };

    renderRateStar(n: number){
        const className = ['rv-star3'];
        for (let i = 1; i <= n; i++) {
        className.push(`star-${i}`);
        }
        this.rateClassName = className.join(' ');
    }

    reLoadData(){
        this.$emit("reLoadData");
    }
}
</script>

<style scoped>

::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .modal-content {
  /* display: inline-block; */
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: rgb(250, 250, 250);
  width: 40%;
  max-width: 1000px;
  max-height: 500px;
  height: 50%; 
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}

.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}

</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>

