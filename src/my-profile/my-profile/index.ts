import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { Client, QueryClient } from 'web-clients';
import { MyProfileService, User, UserFilter, userModel, UserService, UserSettings } from './user';
import { QueryService } from 'onecore';

export * from './user';

const httpRequest = new HttpRequest(axios, options);

export class UserClient extends Client<User, string, UserFilter> implements UserService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, userModel);
    this.searchGet = true;
  }
  getUsersByRole(id: string): Promise<User[]> {
    const url = `${this.serviceUrl}?roleId=${id}`;
    return this.http.get<User[]>(url);
  }
}
export class MyProfileClient implements MyProfileService {
  constructor(private http: HttpRequest, private url: string) {
    this.getMyProfile = this.getMyProfile.bind(this);
    this.getMySettings = this.getMySettings.bind(this);
  }
  getMyProfile(id: string): Promise<User | null> {
    const url = this.url + '/' + id;
    return this.http.get<User>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
  getMySettings(id: string): Promise<UserSettings | null> {
    const url = this.url + '/' + id + '/settings';
    return this.http.get<UserSettings>(url).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }

  saveMySettings(id: string, settings: UserSettings): Promise<number> {
    return this.http.patch<number>(this.url + '/' + id + '/settings', settings).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }
  saveMyProfile(data: User): Promise<number> {
    return this.http.patch<number>(this.url, data).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return 0;
      }
      throw err;
    });
  }

}
export interface Config {
  myprofile_url: string;
  interest_url: string;
  looking_for_url: string;
  skill_url: string;
}
class ApplicationContext {
  userService?: MyProfileService;
  interestService?: QueryService<string>;
  lookingForService?: QueryService<string>;
  skillService?: QueryService<string>;
  getConfig(): Config {
    return storage.config();
  }
  getMyProfileService(): MyProfileService {
    if (!this.userService) {
      const c = this.getConfig();
      this.userService = new MyProfileClient(httpRequest, c.myprofile_url);
    }
    return this.userService;
  }

  getInterestService(): QueryService<string> {
    
    if (!this.interestService) {
      const c = this.getConfig();
      this.interestService = new QueryClient<string>(httpRequest, c.interest_url);
    }
    return this.interestService;
  }

  getLookingForService(): QueryService<string> {
    
    if (!this.lookingForService) {
      const c = this.getConfig();
      this.lookingForService = new QueryClient<string>(httpRequest, c.looking_for_url);
    }
    return this.lookingForService;
  }

  getSkillService(): QueryService<string> {
    
    if (!this.skillService) {
      const c = this.getConfig();
      this.skillService = new QueryClient<string>(httpRequest, c.skill_url);
    }
    return this.skillService;
  }

}

export const context = new ApplicationContext();
export function useMyProfileService(): MyProfileService {
  return context.getMyProfileService();
}

export function useInterestService(): QueryService<string> {
  return context.getInterestService();
}

export function useLookingForService(): QueryService<string> {
  return context.getLookingForService();
}

export function useSkillService(): QueryService<string> {
  return context.getSkillService();
}
