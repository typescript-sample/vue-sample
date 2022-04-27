<template>
  <div class="view-container profile-info">
    <form model-name="data">
      <header>
        <h2>{{ resource.user_profile_general_info }}</h2>
        <button
          type="button"
          id="btnClose"
          name="btnClose"
          class="btn-close"
          @click="closeModal()"
        ></button>
      </header>
      <div>
        <section class="row">
          <h4>{{ resource.user_profile_basic_info }}</h4>
          <label class="col s12 m6">
            {{ resource.first_name }}
            <input
              id="firstName"
              name="firstName"
              v-model="user.firstName"
              maxLength="255"
              :placeholder="resource.placeholder_user_profile_first_name"
            />
          </label>
          <label class="col s12 m6">
            {{ resource.last_name }}
            <input
              id="lastName"
              name="lastName"
              v-model="user.lastName"
              maxLength="255"
              :placeholder="resource.placeholder_user_profile_last_name"
            />
          </label>
          <label class="col s12 m6">
            {{ resource.user_profile_occupation }}
            <input
              id="occupation"
              name="occupation"
              v-model="user.occupation"
              maxLength="500"
              :placeholder="resource.placeholder_user_profile_occupation"
            />
          </label>
          <label class="col s12 m6">
            {{ resource.user_profile_company }}
            <input
              id="company"
              name="company"
              v-model="user.company"
              maxLength="500"
              :placeholder="resource.placeholder_user_profile_company"
            />
          </label>
          <label class="col s12">
            {{ resource.user_profile_website }}
            <input
              id="website"
              name="website"
              data-type="url"
              v-model="user.website"
              maxLength="500"
              placeholder="resource.placeholder_user_profile_website"
            />
          </label>
        </section>
        <section>
          <h4>{{ resource.user_profile_social }}</h4>
          <label class="inline-input">
            <i class="fa fa-facebook"></i>
            <input
              id="facebookLink"
              maxLength="100"
              name="facebookLink"
              :placeholder="resource.user_profile_facebook"
              v-model="user.facebookLink"
            />
          </label>
          <label class="inline-input">
            <i class="fa fa-linkedin"></i>
            <input
              id="linkedInLink"
              maxLength="100"
              :placeholder="resource.user_profile_linkedIn"
              name="linkedinLink"
              v-model="user.linkedinLink"
            />
          </label>
          <label class="inline-input">
            <i class="fa fa-instagram"></i>
            <input
              id="instagramLink"
              maxLength="100"
              v-model="user.instagramLink"
              :placeholder="resource.user_profile_instagram"
              name="instagramLink"
            />
          </label>
          <label class="inline-input">
            <i class="fa fa-twitter"></i>
            <input
              id="twitter"
              maxLength="100"
              :placeholder="resource.user_profile_twitter"
              name="twitterLink"
              v-model="user.twitterLink"
            />
          </label>
          <label class="inline-input">
            <i class="fa fa-skype"></i>
            <input
              id="skype"
              name="skypeLink"
              maxLength="100"
              :placeholder="resource.user_profile_skype"
              v-model="user.skypeLink"
            />
          </label>
          <label class="inline-input">
            <i class="fa fa-dribbble"></i>
            <input
              id="dribble"
              name="dribbbleLink"
              maxLength="100"
              :placeholder="resource.user_profile_dribbble"
              v-model="user.dribbbleLink"
            />
          </label>
        </section>
      </div>
      <footer>
        <button type="button" id="btnSave" name="btnSave" @click="save($event)">
          {{ resource.save }}
        </button>
      </footer>
    </form>
  </div>
</template>

<script lang="ts">
import { PropType } from "@vue/runtime-core";
import { StringMap } from "uione";
import { Options, prop, Vue } from "vue-class-component";
import { MyProfileService, useMyProfileService, User } from "./my-profile";

class Props {
  user = prop({ type: Object as PropType<User> });
  resource = prop({ type: Object as PropType<StringMap> });
}

@Options({
  name: "general-info-component",
  emits: ["onSave", "closeModalFn"],
})
export default class GeneralIfoComponent extends Vue.with(Props) {
  service: MyProfileService;
  created(){
      this.service = useMyProfileService();
  }
  save(event: any) {
    event.preventDefault();
    const id = "XU3rkqafp";
    if(this.user){
      this.service.saveMyProfile(this.user).then((success) => {
      let status = "";
      if (success) {
        status = "success";
      } else {
        status = "fail";
      }
      this.$emit("onSave", { status, user: this.user });
      this.$emit("closeModalFn");
    });
    }
  }
  closeModal(event: any) {
          this.$emit("closeModalFn");
  }
}
</script>

<style>
.view-container.profile-info
  > form
  > div
  > section
  > label.inline-input
  > i:first-child {
  width: 31px;
  height: 28px;
  margin-top: 5px;
  margin-right: 12px;
  padding-top: 5px;
  font-size: 16px;
  text-align: center;
  border: 1px solid;
  border-radius: 50%;
  color: #0dcfb0;
}
</style>