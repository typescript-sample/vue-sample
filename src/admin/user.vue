<script lang="ts">
import { clone } from "reflectx";
import { alertError, confirm } from "ui-alert";
import { toast } from "ui-toast";
import {
  emailOnBlur,
  getLocale,
  initForm,
  phoneOnBlur,
  registerEvents,
  storage,
} from "uione";
import { Options } from "vue-class-component";
import { buildId, createModel, EditComponent } from "../common";
import { useMasterData, useUser } from "./service";
import { User } from "./service";

@Options({})
export default class UserComponent extends EditComponent<User, string> {
  statusList = [];
  checkedCtrl: string[] = [];
  userService = useUser();
  masterDataService = useMasterData();
  user: User = {} as any;

  created() {
    this.checkedCtrl = [];
    this.onCreated(
      this.userService,
      storage.resource(),
      storage.ui() as any,
      getLocale,
      toast,
      alertError,
      confirm,
      storage.loading()
    );
    this.patchable = false;
  }

  mounted() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    if(this.service.keys){
    const id = buildId(this.service.keys(), this.$route);
    this.load(id);
    }
  }
  updatePhoneState() {}

  createModel(): User {
    const user = createModel<User>(this.metadata);
    user.status = "A";
    return user;
  }
  getModel(): User {
    const obj = clone(this.user);
    return obj;
  }
  showModel(obj: User) {
    this.user = obj;
  }
  emailOnBlur = (event: any) => {
    emailOnBlur(event);
  };
  phoneOnBlur = (event: any) => {
    phoneOnBlur(event);
  };
  check = (e: any) => {
    e.preventDefault();
    console.log(this.user);
  };
}
</script>
<template>
  <div class="view-container">
    <form id="userForm" name="userForm" ref="form">
      <header>
        <button type="button" class="btn-back" @click="back(event)"></button>
        <h2>
          {{ newMode ? resource.button_create : resource.button_edit }}
          {{ resource.user }}
        </h2>
      </header>
      <div class="row">
        <label class="col s12 m6">
          {{ resource.user_id }}
          <input
            type="text"
            id="userId"
            name="userId"
            v-model="user.userId"
            @change="updateState"
            maxlength="40"
            :required="true"
            :placeholder="resource.user_id"
          />
        </label>
        <label class="col s12 m6">
          {{ resource.display_name }}
          <input
            type="text"
            id="displayName"
            name="displayName"
            v-model="user.displayName"
            maxlength="50"
            :required="true"
            :placeholder="resource.display_name"
          />
        </label>
        <label class="col s12 m6">
          {{ resource.phone }}
          <input
            type="text"
            id="contactNo"
            name="contactNo"
            v-model="user.phone"
            @change="updateState"
            @blur="phoneOnBlur"
            maxlength="17"
            :placeholder="resource.phone"
          />
        </label>
        <label class="col s12 m12 l6">
          {{ resource.email }}
          <input
            type="text"
            id="email"
            name="email"
            v-model="user.email"
            data-type="email"
            @change="updateState"
            @blur="emailOnBlur"
            maxlength="255"
            :required="true"
            :placeholder="resource.email"
          />
        </label>
        <label className="col s12 m6 radio-section">
          {{ resource.status }}
          <div class="radio-group">
            <label>
              <input
                type="radio"
                id="active"
                name="status"
                value="A"
                v-model="user.status"
                @change="updateState"
                :checked="user.status === 'A'"
              />
              {{ resource.yes }}
            </label>
            <label>
              <input
                type="radio"
                id="inactive"
                name="status"
                value="I"
                v-model="user.status"
                @change="updateState"
                :checked="user.status === 'I'"
              />
              {{ resource.no }}
            </label>
          </div>
        </label>
      </div>
      <footer>
        <button type="submit" id="btnSave" name="btnSave" @click="save">
          {{ resource.save }}
        </button>
      </footer>
    </form>
  </div>
</template>
