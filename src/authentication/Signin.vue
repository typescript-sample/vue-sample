<template>
  <div class="view-container central-full">
    <form
      id="signinForm"
      name="signinForm"
      ref="form"
      novalidate
      autocomplete="off"
    >
      <div>
        <img class="logo" src="@/assets/images/logo.png" />
        <h2>{{ resource.signin }}</h2>
        <div class="{message: true, alertClass: alertClass }">
          {{ message }}
          <span @click="hideMessage" :hidden="!message || message == ''"></span>
        </div>
        <label>
          {{ resource.email }}
          <input
            type="text"
            id="username"
            name="username"
            v-model="user.username"
            maxlength="255"
            required
            :placeholder="resource.email"
          />
        </label>
        <label>
          {{ resource.password }}
          <input
            type="password"
            id="password"
            name="password"
            v-model="user.password"
            maxlength="255"
            required
            :placeholder="resource.password"
          />
        </label>
        <label class="col s12 checkbox-container">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            v-model="remember"
          />
          {{ resource.signin_remember_me }}
        </label>
        <button
          type="submit"
          id="btnSignin"
          name="btnSignin"
          @click="signin($event)"
        >
          {{ resource.button_signin }}
        </button>
        <a id="btnForgotPassword" @click="forgotPassword">
          {{ resource.forgot_password }}
        </a>
        <a id="btnSignup" name="btnSignup" @click.prevent="signup()">
          {{ resource.button_signup }}
        </a>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import {
  AuthInfo,
  AuthResult,
  getMessage,
  handleCookie,
  initFromCookie,
  Status,
} from "authen-client";
import { Base64 } from "js-base64";
import { element } from "ui-plus";
import { options } from "uione";
import { storage } from "uione";
import { initForm, registerEvents } from "uione";
import { Options, Vue } from "vue-class-component";
import { messageByHttpStatus, navigate, readOnly } from "../common";
import { useAuthen, useCookie } from "./service";

export const map = {
  "3": "fail_authentication",
  "4": "fail_wrong_password",
  "5": "fail_expired_password",
  "6": "fail_access_time_locked",
  "7": "fail_suspended_account",
  "8": "fail_locked_account",
  "9": "fail_disabled_account",
  "10": "fail_disabled_account",
};
const status: Status = {
  success: 1,
  two_factor_required: 2,
  fail: 3,
  password_expired: 5,
};

@Options({})
export default class SigninComponent extends Vue {
  // authenticationService = new AuthenticationClient<AuthInfo>(httpRequest, config.authentication_url + '/authenticate');
  cookieService = useCookie();
  user: AuthInfo = {
    username: "",
    password: "",
  };
  txtUserName: any;
  txtPassword: any;
  chkRemember: any;
  remember = false;
  message = "";
  alertClass = "";
  resource: any = storage.resource().resource();
  running: any;
  protected form: any;
  protected alertError(
    msg: string,
    title: string,
    detail?: string,
    callback?: () => void
  ) {
    storage.alert(msg, title, detail, callback);
  }

  handleError(err: any) {
    this.running = false;
    storage.loading().hideLoading();

    const r = storage.resource();
    const title = r.value("error");
    let msg = r.value("error_internal");
    if (!err) {
      this.alertError(msg, title);
      return;
    }
    const data = err && err.response ? err.response : err;
    if (data) {
      const s = data.status;
      if (s && !isNaN(s)) {
        msg = messageByHttpStatus(s, r.value);
      }
      if (s === 403) {
        msg = r.value("error_forbidden");
        readOnly(this.form);
        this.alertError(msg, title);
      } else if (s === 401) {
        msg = r.value("error_unauthorized");
        readOnly(this.form);
        this.alertError(msg, title);
      } else {
        this.alertError(msg, title);
      }
    } else {
      this.alertError(msg, title);
    }
  }
  created() {
    this.resource = storage.resource().resource();
  }

  public mounted() {
    this.initForm();
    this.remember = initFromCookie(
      "data",
      this.user,
      this.cookieService,
      Base64
    );
  }

  
  initForm() {
    this.form = initForm(this.$refs.form as any, registerEvents);
    this.txtUserName = element(this.form, "userName");
    this.txtPassword = element(this.form, "password");
    this.chkRemember = element(this.form, "remember");
  }

  protected navigateToHome() {
    navigate(this.$router, "/admin/users");
  }
  showMessage(msg: string) {
    this.alertClass = "alert alert-success";
    this.message = msg;
  }

  showWarning(msg: string) {
    this.alertClass = "alert alert-warning";
    this.message = msg;
  }

  showInfo(msg: string) {
    this.alertClass = "alert alert-info";
    this.message = msg;
  }

  showDanger(msg: string) {
    this.alertClass = "alert alert-danger";
    this.message = msg;
  }

  hideMessage() {
    this.alertClass = "";
    this.message = "";
  }

  forgotPassword() {
    navigate(this.$router, "forgot-password");
  }

  signup(event:Event) {
    event.preventDefault();
    navigate(this.$router, "signup");
  }

  signin(event:Event) {
    event.preventDefault();
    this.txtUserName = element(this.form, "username");
    this.txtPassword = element(this.form, "password");
    this.chkRemember = element(this.form, "remember");
    let valid = true;
    const r = storage.resource();
    if (this.txtUserName.value === "") {
      valid = false;
      const message = r.format("error_required", "user_name");
      this.showDanger(message);
    } else if (this.txtPassword.value === "") {
      valid = false;
      const message = r.format("error_required", "password");
      this.showDanger(message);
    }
    if (valid === false) {
      return;
    }
    const remember = this.chkRemember.checked;
    const authenticator = useAuthen();
    authenticator
      .authenticate(this.user)
      .then((result: AuthResult) => {
        const s = result.status;
        // tslint:disable-next-line:triple-equals
        if (s === status.success || s === status.success_and_reactivated) {
          handleCookie(
            "data",
            this.user,
            remember,
            this.cookieService,
            60 * 24 * 3,
            Base64
          );
          /*
        const expiredDays = dayDiff(result.user.passwordExpiredTime, new Date());
        if (expiredDays > 0) {
          const message2 = r.value('msg_password_expired_soon', expiredDays);
          storage.message(message2);
        }
        */
          // tslint:disable-next-line:triple-equals
          if (s == status.success) {
            storage.setUser(result.user);
            this.navigateToHome();
          } else {
            const message3 = r.value("msg_account_reactivated");
            // storage.alert(message3, null, '', function () {
            storage.alert(message3, "", "", ()=> {
              storage.setUser(result.user);

              this.navigateToHome();
            });
          }
        } else {
          storage.setUser(null);
          const ms = getMessage(s, r.resource(), map);
          this.showDanger(ms);
        }
      })
      .catch(this.handleError);
  }
}
export function dayDiff(start: Date, end: Date): number | null {
  if (!start || !end) {
    return null;
  }
  return Math.floor(Math.abs((start.getTime() - end.getTime()) / 86400000));
}
export function addDays(date: Date, number: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + number);
  return newDate;
}
</script>
