<template>
  <div class="profile view-container">
    <form id="userForm" name="userForm">
      <header class="border-bottom-highlight">
        <div class="cover-image">
          <img
            src="https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg"
            alt="cover"
          />
          <div class="contact-group">
            <button id="btnPhone" name="btnPhone" class="btn-phone"></button>
            <button id="btnEmail" name="btnEmail" class="btn-email"></button>
          </div>
          <button id="btnFollow" name="btnFollow" class="btn-follow">
            Follow
          </button>
        </div>
        <button id="btnCamera" name="btnCamera" class="btn-camera"></button>
        <div class="avatar-wrapper">
          <img
            class="avatar"
            :src="
              user.imageURL ||
              'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'
            "
            alt="avatar"
          />
          <img
            class="profile-status"
            src="@/assets/images/online.svg"
            alt="status"
          />
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
      <div class="row">
        <div class="col m12 l4">
          <div class="card">
            <header>
              <i class="material-icons highlight">account_box</i>
              {{ resource.user_profile_basic_info }}
              <button
                type="button"
                id="btnBasicInfo"
                name="btnBasicInfo"
                :hidden="isEditing"
                class="btn-edit"
                @click="showModal"
              ></button>
            </header>
            <p>{{ user.occupation }}</p>
            <p>{{ user.company }}</p>
          </div>

          <div class="card" v-if="!isEditingSkill">
            <header>
              <i class="material-icons highlight">local_mall</i>
              {{ resource.skills }}
              <button
                type="button"
                id="btnSkill"
                name="btnSkill"
                :hidden="isEditing"
                class="btn-edit"
                @click="toggleSkill($event)"
              ></button>
            </header>
            <section>
              <template v-for="(item, index) in user.skills" :key="index">
                <p>
                  {{ item.skill
                  }}<i :hidden="!item.hirable" class="star highlight"></i>
                </p>
              </template>

              <hr />
              <p class="description">
                <i class="star highlight"></i>
                {{ resource.user_profile_hireable_skill }}
              </p>
            </section>
          </div>
          <div class="card" v-if="isEditingSkill">
            <header>
              <i class="material-icons highlight">local_mall</i>
              {{ resource.skills }}
              <button
                type="button"
                id="btnSkill"
                name="btnSkill"
                class="btn-close"
                @click="toggleSkill($event)"
              ></button>
            </header>
            <section>
              <template v-for="(item, index) in user.skills" :key="index">
                <div class="chip">
                  {{ item.skill }}
                  <i v-if="item.hirable" class="star highlight"></i>
                  <button
                    type="button"
                    name="btnRemoveSkill"
                    class="close"
                    @click="removeSkill($event, item.skill)"
                  ></button>
                </div>
              </template>
              <label class="checkbox-container">
                <input
                  type="checkbox"
                  id="hireable"
                  name="hireable"
                  v-model="edit.hireable"
                />
                {{ resource.user_profile_hireable_skill }}
              </label>
              <hr />
              <p class="description">
                <i class="star highlight"></i
                >{{ resource.user_profile_hireable_skill }}
              </p>
            </section>
            <footer>
              <button
                type="button"
                id="btnSaveSkill"
                name="btnSaveSkill"
                @click="saveChanges($event)"
              >
                {{ resource.save }}
              </button>
            </footer>
          </div>

          <div class="card" v-if="!isEditingLookingFor">
            <header>
              <i class="material-icons highlight">find_in_page</i>
              {{ resource.user_profile_looking_for }}
              <button
                type="button"
                id="btnLookingFor"
                name="btnLookingFor"
                :hidden="isEditing && !isEditingLookingFor"
                class="btn-edit"
                @click="toggleLookingFor($event)"
              ></button>
            </header>
            <section>
              <template v-for="(item, index) of user.lookingFor" :key="index">
                <p>{{ item }}</p>
              </template>
            </section>
          </div>

          <div class="card" v-if="isEditingLookingFor">
            <header>
              <i class="material-icons highlight">find_in_page</i>
              {{ resource.user_profile_looking_for }}
              <button
                type="button"
                id="btnLookingFor"
                name="btnLookingFor"
                class="btn-close"
                @click="toggleLookingFor($event)"
              ></button>
            </header>
            <section>
              <template v-for="(item, index) of user.lookingFor" :key="index">
                <div class="chip" :tabIndex="index">
                  {{ item }}
                  <button
                    type="button"
                    name="btnRemoveLookingFor"
                    class="close"
                    @click="removeLookingFor($event, item)"
                  ></button>
                </div>
              </template>

              <label class="form-group inline-input">
                <input
                  name="lookingFor"
                  class="form-control"
                  v-model="edit.lookingFor"
                  :placeholder="resource.placeholder_user_profile_looking_for"
                  maxLength="100"
                />
                <button
                  type="button"
                  id="btnAddLookingFor"
                  name="btnAddLookingFor"
                  class="btn-add"
                  @click="addLookingFor($event)"
                ></button>
              </label>
            </section>
            <footer>
              <button
                type="button"
                id="btnSaveLookingFor"
                name="btnSaveLookingFor"
                @click="saveChanges($event)"
              >
                {{ resource.save }}
              </button>
            </footer>
          </div>

          <div class="card">
            <header>
              <i class="material-icons highlight">chat</i>
              {{ resource.user_profile_social }}
              <button
                type="button"
                id="btnSocial"
                name="btnSocial"
                :hidden="isEditing"
                class="btn-edit"
              ></button>
            </header>
            <div>
              <a
                v-if="user.facebookLink"
                :href="'https://facebookcom/' + user.facebookLink"
                title="facebook"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-facebook"></i>
                <span>facebook</span>
              </a>
              <a
                v-if="user.skypeLink"
                :href="'https://skype.com/' + user.skypeLink"
                title="Skype"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-skype"></i>
                <span>Skype</span>
              </a>

              <a
                v-if="user.twitterLink"
                :href="'https://twitter.com/' + user.twitterLink"
                title="Twitter"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-twitter"></i>
                <span>Twitter</span>
              </a>

              <a
                v-if="user.instagramLink"
                :href="'https://instagram.com/' + user.instagramLink"
                title="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-instagram"></i>
                <span>Instagram</span>
              </a>

              <a
                v-if="user.linkedinLink"
                :href="'https://linkedin.com/' + user.linkedinLink"
                title="Linked in"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-linkedin"></i>
                <span>Linked in</span>
              </a>

              <a
                v-if="user.googleLink"
                :href="'https://plus.google.com/' + user.googleLink"
                title="Google"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-google"></i>
                <span>Google</span>
              </a>

              <a
                v-if="user.dribbbleLink"
                :href="'https://dribbble.com/' + user.dribbbleLink"
                title="dribbble"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-dribbble"></i>
                <span>dribbble</span>
              </a>

              <a
                v-if="user.customLink01"
                :href="user.customLink01"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fab fa-globe-asia"></i>
              </a>

              <a
                v-if="user.customLink02"
                :href="user.customLink02"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fab fa-globe-asia"></i>
              </a>

              <a
                v-if="user.customLink03"
                :href="user.customLink03"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fab fa-globe-asia"></i>
              </a>

              <a
                v-if="user.customLink04"
                :href="user.customLink04"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fab fa-globe-asia"></i>
              </a>

              <a
                v-if="user.customLink05"
                :href="user.customLink05"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fab fa-globe-asia"></i>
              </a>

              <a
                v-if="user.customLink06"
                :href="user.customLink06"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fab fa-globe-asia"></i>
              </a>

              <a
                v-if="user.customLink07"
                :href="user.customLink07"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fab fa-globe-asia"></i>
              </a>

              <a
                v-if="user.customLink08"
                :href="user.customLink08"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fab fa-globe-asia"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col m12 l8">
          <div class="card border-bottom-highlight">
            <header>
              <i class="material-icons highlight">person</i>
              {{ resource.user_profile_bio }}
              <button
                type="button"
                id="btnBio"
                name="btnBio"
                :hidden="isEditing && !isEditingBio"
                :class="!isEditingBio ? 'btn-edit' : 'btn-close'"
                @click="toggleBio($event)"
              ></button>
            </header>

            <p v-if="!isEditingBio">{{ user.bio }}</p>
            <textarea
              v-if="isEditingBio"
              name="bio"
              v-model="user.bio"
            ></textarea>

            <footer v-if="isEditingBio">
              <button
                type="button"
                id="btnSaveBio"
                name="btnSaveBio"
                @click="saveChanges($event)"
              >
                {{ resource.save }}
              </button>
            </footer>
          </div>
          <div class="card border-bottom-highlight">
            <header>
              <i class="material-icons highlight">flash_on</i>
              {{ resource.interests }}
              <button
                type="button"
                id="btnInterest"
                name="btnInterest"
                :hidden="isEditing && !isEditingInterest"
                :class="!isEditingInterest ? 'btn-edit' : 'btn-close'"
                @click="toggleInterest($event)"
              ></button>
            </header>

            <section class="row" v-if="!isEditingInterest">
              <template v-for="(item, index) of user.interests" :key="index">
                <span class="col s4">{{ item }}</span>
              </template>
            </section>

            <section class="row" v-if="isEditingInterest">
              <template v-for="(item, index) of user.interests" :key="index">
                <div class="chip" :tabIndex="index">
                  {{ item }}
                  <button
                    type="button"
                    name="btnRemoveInterest"
                    class="close"
                    @click="removeInterest($event, item)"
                  ></button>
                </div>
              </template>

              <label class="col s12 inline-input">
                <input
                  type="text"
                  name="interest"
                  :placeholder="resource.placeholder_user_profile_interest"
                  v-model="edit.interest"
                  maxLength="100"
                />
                <button
                  type="button"
                  id="btnAddInterest"
                  name="btnAddInterest"
                  class="btn-add"
                  @click="addInterest($event)"
                ></button>
              </label>
            </section>

            <footer v-if="isEditingInterest">
              <button
                type="button"
                id="btnSaveInterest"
                name="btnSaveInterest"
                @click="saveChanges($event)"
              >
                {{ resource.save }}
              </button>
            </footer>
          </div>

          <div class="card border-bottom-highlight">
            <header>
              <i class="material-icons highlight">beenhere</i>
              {{ resource.achievements }}
              <button
                type="button"
                id="btnAchievement"
                name="btnAchievement"
                :hidden="isEditing && !isEditingAchievement"
                :class="!isEditingAchievement ? 'btn-edit' : 'btn-close'"
                @click="toggleAchievement($event)"
              ></button>
            </header>

            <template v-if="!isEditingAchievement && user.achievements">
              <template
                v-for="(achievement, index) of user.achievements"
                :key="index"
              >
                <section>
                  <h3>
                    {{ achievement.subject }}
                    <i
                      v-if="achievement.highlight"
                      class="star highlight float-right"
                    ></i>
                  </h3>
                  <p class="description">{{ achievement.description }}</p>
                  <hr />
                </section>
              </template>
            </template>

            <template v-if="isEditingAchievement && user.achievements">
              <template
                v-for="(achievement, index) of user.achievements"
                :key="index"
              >
                <section>
                  <h3>
                    {{ achievement.subject }}
                    <i class="star highlight" v-if="achievement.highlight"></i>
                  </h3>
                  <p class="description">{{ achievement.description }}</p>
                  <button
                    type="button"
                    class="btn-remove"
                    @click="removeAchievement($event, achievement.subject)"
                  ></button>
                  <hr />
                </section>
              </template>
            </template>
            <section v-if="isEditingAchievement">
              <div class="form-group">
                <input
                  type="text"
                  name="subject"
                  class="form-control"
                  v-model="edit.subject"
                  :placeholder="
                    resource.placeholder_user_profile_achievement_subject
                  "
                  maxLength="50"
                  required="true"
                />
                <input
                  type="text"
                  name="description"
                  class="form-control"
                  v-model="edit.description"
                  :placeholder="
                    resource.placeholder_user_profile_achievement_description
                  "
                  maxLength="100"
                  required="true"
                />
              </div>
              <label class="checkbox-container">
                <input
                  type="checkbox"
                  id="highlight"
                  name="highlight"
                  v-model="edit.highlight"
                />
                {{ resource.user_profile_highlight_achievement }}
              </label>
              <div class="btn-group">
                <button
                  type="button"
                  id="btnAddAchievement"
                  name="btnAddAchievement"
                  class="btn-add"
                ></button>
                {{ resource.button_add_achievement }}
              </div>
            </section>
            <footer v-if="isEditingAchievement">
              <button
                type="button"
                id="btnSaveAchievement"
                name="btnSaveAchievement"
                @click="saveChanges($event)"
              >
                {{ resource.save }}
              </button>
            </footer>
            <div v-if="resource">
              <vue-final-modal
                v-model="modalIsOpen"
                content-class="modal-portal-content"
              >
                <general-info-component
                  :resource="resource"
                  :user="user"
                  @onSave="saveEmit"
                  @closeModalFn="closeModal"
                />
              </vue-final-modal>
            </div>
            <div>
              <vue-final-modal
                v-model="modalConfirmIsOpen"
               content-class="modal-portal-content small-width-height"
              >
                <div class="view-container profile-info">
                  <form model-name="data">
                    <header>
                      <h2>Edit About</h2>
                      <button
                        type="button"
                        id="btnClose"
                        name="btnClose"
                        class="btn-close"
                        @click="closeModalConfirm"
                      />
                    </header>
                    <div>
                      <section class="row">
                        <div>
                          Data will not be saved, are you sure to continue?
                        </div>
                      </section>
                    </div>

                    <footer>
                      <button
                        type="button"
                        id="btnSave"
                        name="btnSave"
                        @click="revertBioChages"
                      >
                        OK
                      </button>
                    </footer>
                  </form>
                </div>

              </vue-final-modal>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { getResource, storage, StringMap, UserAccount } from "uione";
import { Options, Vue } from "vue-class-component";
import GeneralIfoComponent from "./general-info.vue";
import { useMyProfileService, User } from "./my-profile/index";
import { Achievement, MyProfileService } from "./my-profile/user";
interface Edit {
  hireable: boolean;
  lookingFor: string;
  interest: string;
  highlight: boolean;
  description: string;
  subject: string;
}

@Options({
  components: { "general-info-component": GeneralIfoComponent },
})
export default class MyProfileComponent extends Vue {
  user: User = {} as any;
  resource: StringMap;
  isOpen = false;
  isEditing = false;
  isEditingBio = false;
  isEditingInterest = false;
  isEditingLookingFor = false;
  isEditingSkill = false;
  isEditingAchievement = false;
  bio = "";
  skill = "";
  interest = "";
  lookingFor = "";
  description = "";
  highlight = false;
  modalIsOpen = false;
  followers = "7 followers";
  following = "7 following";
  edit: Edit = {
    hireable: false,
    lookingFor: "",
    interest: "",
    highlight: false,
    description: "",
    subject: "",
  };
  
  service: MyProfileService;
  modalConfirmIsOpen = false;
  created() {
    this.service = useMyProfileService();
    const id = storage.getUserId();
    if (id) {
      this.service.getMyProfile(id).then((user) => {
      if (user) {
        this.user = user;
        this.bio = this.user.bio || "";
      }
    });
    }
    this.resource = getResource().resource();
  }
  toggleSkill(event: any): void {
    event.preventDefault();
    this.isEditingSkill = !this.isEditingSkill;
    this.isEditing = !this.isEditing;
  }
  toggleLookingFor(event: any): void {
    event.preventDefault();
    this.isEditingLookingFor = !this.isEditingLookingFor;
    this.isEditing = !this.isEditing;
  }
  removeSkill(event: any, skill: string) {
    event.preventDefault();
    this.user.skills = this.user.skills.filter((item) => item.skill !== skill);
    this.isEditing = !this.isEditing;
  }
  removeLookingFor(event: any, lookingForContent: string): void {
    event.preventDefault();
    this.user.lookingFor = this.user.lookingFor.filter(
      (item) => item !== lookingForContent
    );
  }
  toggleBio(event: any): void {
    event.preventDefault();
    if (this.user.bio !== this.bio) {
      this.modalConfirmIsOpen = true;
    } else {
      this.isEditingBio = !this.isEditingBio;
      this.isEditing = !this.isEditing;
    }
  }
  revertBioChages() {
    this.user.bio = this.bio;
    this.isEditingBio = !this.isEditingBio;
    this.isEditing = !this.isEditing;
    this.modalConfirmIsOpen = false;
  }
  toggleInterest(event: any): void {
    event.preventDefault();
    this.isEditingInterest = !this.isEditingInterest;
    this.isEditing = !this.isEditing;
  }
  removeInterest(event: any, subject: string): void {
    event.preventDefault();
    if (this.user.interests) {
      const interests = this.user.interests.filter(
        (item: string) => item !== subject
      );
      this.user.interests = interests;
    }
  }
  addInterest(event: any): void {
    event.preventDefault();
    const interests = this.user.interests ? this.user.interests : [];
    if (this.edit.interest && this.edit.interest.trim() !== "") {
      if (!inArray(interests, this.edit.interest)) {
        interests.push(this.edit.interest);
        this.user.interests = interests;
        this.edit.interest = "";
      } else {
        // UIUtil.alertError(ResourceManager.getString('error_duplicated_interest'), ResourceManager.getString('error'));
      }
    }
  }

  addLookingFor(event: any): void {
    event.preventDefault();
    const lookingForUser = this.user.lookingFor ? this.user.lookingFor : [];
    if (this.edit.lookingFor && this.edit.lookingFor.trim() != "") {
      if (!inArray(lookingForUser, this.edit.lookingFor)) {
        lookingForUser.push(this.edit.lookingFor);
        this.user.lookingFor = lookingForUser;
        this.lookingFor = "";
      } else {
        // UIUtil.alertError(ResourceManager.getString('error_duplicated_looking_for'), ResourceManager.getString('error'));
      }
    }
  }
  toggleAchievement(event: any) {
    event.preventDefault();
    this.isEditingAchievement = !this.isEditingAchievement;
    this.isEditing = !this.isEditing;
  }
  removeAchievement(event: any, subject: string): void {
    event.preventDefault();
    if (this.user.achievements) {
      const achievements = this.user.achievements.filter(
        (item: Achievement) => item["subject"] !== subject
      );
      this.user.achievements = achievements;
    }
  }
  close() {
    if (this.isEditingBio) {
      this.isEditingBio = !this.isEditingBio;
    }
    if (this.isEditingInterest) {
      this.isEditingInterest = !this.isEditingInterest;
    }
    if (this.isEditingLookingFor) {
      this.isEditingLookingFor = !this.isEditingLookingFor;
    }

    if (this.isEditingSkill) {
      this.skill = "";
      this.isEditingSkill = !this.isEditingSkill;
    }
    if (this.isEditingAchievement) {
      this.edit.subject = "";
      this.edit.highlight = false;
      this.edit.description = "";
      this.isEditingAchievement = !this.isEditingAchievement;
    }
    this.isEditing = !this.isEditing;
  }
  closeModalConfirm() {
    this.modalConfirmIsOpen = false;
  }
  saveChanges(event: any): void {
    event.preventDefault();
    const id = "XU3rkqafp";
    if (this.isEditing) {
      this.service.saveMyProfile(this.user).then((successs) => {
        if (successs) {
          // this.initData();
          this.close();
          // UIUtil.showToast(ResourceManager.getString('success_save_my_profile'));
          console.log("success");
        } else {
          console.log("fail");
          // UIUtil.alertError(ResourceManager.getString('fail_save_my_profile'), ResourceManager.getString('error'));
        }
      });
    }
  }
  closeModal() {
    this.modalIsOpen = false;
  }
  showModal() {
    this.modalIsOpen = true;
  }
  saveChangesBio(event: any): void {
    this.saveChanges(event);
    this.bio = this.user.bio || "";
  }
  saveEmit(rs: any) {
    if (rs.status === "success" && rs.data) {
      this.user = rs.user;

      //   this.setState({ user: ReflectionUtil.clone(rs.data) });
      // UIUtil.showToast(ResourceManager.getString('success_save_my_profile'));
    } else {
      console.log("fail");

      // UIUtil.alertError(ResourceManager.getString('fail_save_my_profile'), ResourceManager.getString('error'));
    }
  }
}

export function inArray(arr: string[], item: string): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist = arr.filter((itemFilter) => itemFilter === item).length > 0;
  return isExist;
}

export function inAchievements(arr: Achievement[], item: Achievement): boolean {
  if (!arr || arr.length === 0) {
    return false;
  }
  const isExist =
    arr.filter((itemFilter) => itemFilter.subject === item.subject).length > 0;
  return isExist;
}
</script>

<style>
</style>