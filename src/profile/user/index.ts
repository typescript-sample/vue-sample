import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { Client } from 'web-clients';
import { ProfileService, UserService, User, UserSettings, UserFilter, userModel } from './user';
import { AppreciationService, AppreciationClient} from '../appreciation/index';
import { AppreciationReplyService, AppreciationReplyClient} from '../appreciation-reply';

export * from './user';

const httpRequest = new HttpRequest(axios, options);
export class UserClient extends Client<User, string, UserFilter> implements UserService{
  constructor(http:HttpRequest, url: string){
    super(http,url,userModel);
    this.searchGet=false;
  }
  postOnly(s: UserFilter): boolean {
    return true;
  }
  
}
export class ProfileClient implements ProfileService {
  constructor( private http: HttpRequest,private url: string) {
    this.getMyProfile = this.getMyProfile.bind(this);
    this.getMySettings = this.getMySettings.bind(this);
  }
  getMyProfile(id: string): Promise<User | null> {
    const url = this.url + '/' + id;
    return this.http.get<User>(url).catch(err => {
      const data = (err &&  err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  getMySettings(id: string): Promise<UserSettings | null> {
    const url = this.url + '/' + id + '/settings';
    return this.http.get<UserSettings>(url).catch(err => {
      const data = (err &&  err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
}
export interface Config {
  myprofile_url: string;
  user_url:string;
  profile_url:string;
  appreciation_url:string;
  appreciation_reply_url:string;
  
}
class ApplicationContext {
  profileService?: ProfileService;
  userService?:UserService;
  appreciationService?:AppreciationService;
  appreciationReplyService?:AppreciationReplyService;
  getConfig(): Config {
    return storage.config();
  }
  getMyProfileService(): ProfileService {
    if (!this.profileService) {
      const c = this.getConfig();
      this.profileService = new ProfileClient(httpRequest, c.myprofile_url);
    }
    return this.profileService;
  }
  getUserService():UserService{
    if (!this.userService) {
      const c = this.getConfig();
      this.userService = new UserClient(httpRequest, c.profile_url);
    }
    return this.userService;
  }

  getAppreciationService(): AppreciationService {
    if (!this.appreciationService) {
      const c = this.getConfig();
      this.appreciationService = new AppreciationClient(httpRequest, c.appreciation_url);
    }
    return this.appreciationService;
  }
  
  getAppreciationReplyService(): AppreciationReplyService {
    if (!this.appreciationReplyService) {
      const c = this.getConfig();
  
      this.appreciationReplyService = new AppreciationReplyClient(httpRequest, c.appreciation_reply_url);
    }
    return this.appreciationReplyService;
  }
}

export const context = new ApplicationContext();
export function getMyProfileService(): ProfileService {
  return context.getMyProfileService();
}

export function getUserService():UserService{
  return context.getUserService();
}

export function useAppreciationService(): AppreciationService {
  return context.getAppreciationService();
}


export function useAppreciationReplyService(): AppreciationReplyService | undefined {
  return context.getAppreciationReplyService();
}