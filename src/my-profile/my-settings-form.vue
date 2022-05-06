<script lang="ts">
import { confirm, getResource, handleError, message, StringMap } from "uione";
import { Options, Vue } from "vue-class-component";
import {
  MyProfileService,
  useMyProfileService,
  UserSettings,
} from "./my-profile";

@Options({})
export default class MySettingsComponent extends Vue {
  resource!: StringMap;
  service!: MyProfileService;
  settings: UserSettings = {
    userId: "",
    language: "",
    dateFormat: "",
    dateTimeFormat: "",
    timeFormat: "",
    notification: false,
    searchEnginesLinksToMyProfile: false,
    emailFeedUpdates: false,
    notifyFeedUpdates: false,
    emailPostMentions: false,
    notifyPostMentions: false,
    emailCommentsOfYourPosts: false,
    notifyCommentsOfYourPosts: false,
    emailEventInvitations: false,
    notifyEventInvitations: false,
    emailWhenNewEventsAround: false,
    notifyWhenNewEventsAround: false,
    followingListPublicOnMyProfile: false,
    showMyProfileInSpacesAroundMe: false,
    showAroundMeResultsInMemberFeed: false,
  };
  load(id: any) {
    this.service.getMySettings(id).then((settings) => {
      if (settings) {
        this.settings = settings;
      }
    });
  }
  created() {
    this.resource = getResource().resource();
    this.service = useMyProfileService();
    this.load("XU3rkqafp");
  }
  save(e: any) {
    e.preventDefault();
    confirm(
      this.resource.msg_confirm_save,
      this.resource.confirm,
      () => {
        this.service
          .saveMySettings("XU3rkqafp", this.settings)
          .then((res: number) => {
            const msg =
              res > 0
                ? this.resource.success_save_my_settings
                : this.resource.fail_save_my_settings;
            message(msg);
          })
          .catch(handleError);
      },
      this.resource.no,
      this.resource.yes
    );
  }
}
</script>
<template>
  <div class="view-container">
    <form id="mySettingsForm" name="mySettingsForm" model-name="settings">
      <header>
        <h2>{{ resource.my_settings }}</h2>
      </header>
      <div class="row">
        <section class="col s12 m12 l6">
          <h4>{{ resource.user_settings_member_profile_preferences }}</h4>
          <label class="switch-container">
            <input
              type="checkbox"
              id="searchEnginesLinksToMyProfile"
              name="searchEnginesLinksToMyProfile"
              v-model="settings.searchEnginesLinksToMyProfile"
            />
            {{ resource.user_settings_search_engines_links_to_my_profile }}
          </label>
          <label class="switch-container">
            <input
              type="checkbox"
              id="followingListPublicOnMyProfile"
              name="followingListPublicOnMyProfile"
              v-model="settings.followingListPublicOnMyProfile"
            />
            {{ resource.user_settings_search_engines_links_to_my_profile }}
          </label>
        </section>
        <section class="col s12 m12 l6">
          <h4>{{ resource.user_settings_around_me_references }}</h4>
          <label class="switch-container">
            <input
              type="checkbox"
              id="showMyProfileInSpacesAroundMe"
              name="showMyProfileInSpacesAroundMe"
              v-model="settings.showMyProfileInSpacesAroundMe"
            />
            {{ resource.user_settings_show_my_profile_in_spaces_around_me }}
          </label>
          <label class="switch-container">
            <input
              type="checkbox"
              id="showAroundMeResultsInMemberFeed"
              name="showAroundMeResultsInMemberFeed"
              v-model="settings.showAroundMeResultsInMemberFeed"
            />
            {{ resource.user_settings_show_around_me_results_in_member_feed }}
          </label>
        </section>
        <section class="col s12 m12 l6">
          <h4>{{ resource.user_settings_notification_preferences }}</h4>
          <label class="switch-container">
            <input
              type="checkbox"
              id="notification"
              name="notification"
              v-model="settings.notification"
            />
            {{ resource.user_settings_notifications }}
          </label>
          <div className="checkbox-section">
            {{ resource.user_settings_feed_updates }}
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  id="notifyFeedUpdates"
                  name="notifyFeedUpdates"
                  v-model="settings.notifyFeedUpdates"
                />
                {{ resource.notification }}
              </label>
              <label>
                <input
                  type="checkbox"
                  id="emailFeedUpdates"
                  name="emailFeedUpdates"
                  v-model="settings.emailFeedUpdates"
                />
                {{ resource.email }}
              </label>
            </div>
          </div>
          <div className="checkbox-section">
            {{ resource.user_settings_post_mentions }}
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  id="notifyPostMentions"
                  name="notifyPostMentions"
                  v-model="settings.notifyPostMentions"
                />
                {{ resource.notification }}
              </label>
              <label>
                <input
                  type="checkbox"
                  id="emailPostMentions"
                  name="emailPostMentions"
                  v-model="settings.emailPostMentions"
                />
                {{ resource.email }}
              </label>
            </div>
          </div>
          <div className="checkbox-section">
            {{ resource.user_settings_comments_of_your_posts }}
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  id="notifyCommentsOfYourPosts"
                  name="notifyCommentsOfYourPosts"
                  v-model="settings.notifyCommentsOfYourPosts"
                />
                {{ resource.notification }}
              </label>
              <label>
                <input
                  type="checkbox"
                  id="emailCommentsOfYourPosts"
                  name="emailCommentsOfYourPosts"
                  v-model="settings.emailCommentsOfYourPosts"
                />
                {{ resource.email }}
              </label>
            </div>
          </div>
          <div className="checkbox-section">
            {{ resource.user_settings_event_invitations }}
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  id="notifyEventInvitations"
                  name="notifyEventInvitations"
                  v-model="settings.notifyEventInvitations"
                />
                {{ resource.notification }}
              </label>
              <label>
                <input
                  type="checkbox"
                  id="emailEventInvitations"
                  name="emailEventInvitations"
                  v-model="settings.emailEventInvitations"
                />
                {{ resource.email }}
              </label>
            </div>
          </div>
          <div className="checkbox-section">
            {{ resource.user_settings_when_new_events_around }}
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  id="notifyWhenNewEventsAround"
                  name="notifyWhenNewEventsAround"
                  v-model="settings.notifyWhenNewEventsAround"
                />
                {{ resource.notification }}
              </label>
              <label>
                <input
                  type="checkbox"
                  id="emailWhenNewEventsAround"
                  name="emailWhenNewEventsAround"
                  v-model="settings.emailWhenNewEventsAround"
                />
                {{ resource.email }}
              </label>
            </div>
          </div>
        </section>
      </div>
      <footer>
        <button type="submit" id="btnSave" name="btnSave" @click="save($event)">
          {{ resource.save }}
        </button>
      </footer>
    </form>
  </div>
</template>