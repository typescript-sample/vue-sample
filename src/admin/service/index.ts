import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import config from '../../config';
import { MasterDataClient, MasterDataService } from './master-data';
import { UserClient, UserService } from './user';

export * from './user';
export * from './master-data';

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  user_url: string;
}
class ApplicationContext {
  /*
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getMasterDataService = this.getMasterDataService.bind(this);
    this.getUserService = this.getUserService.bind(this);
  }
  private masterDataService: MasterDataService;
  private userService: UserClient;
  getConfig(): Config {
    return storage.config();
  }
  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient();
    }
    return this.masterDataService;
  }

  getUserService(): UserClient {
    if (!this.userService) {
      const c = this.getConfig();
      this.userService = new UserClient(httpRequest, c.user_url);
    }
    return this.userService;
  }*/
  readonly masterDataService: MasterDataService = new MasterDataClient();
  readonly userService = new UserClient(httpRequest, config.user_url);
}

export const ctx = new ApplicationContext();
export function useUser(): UserService {
  return ctx.userService;
}
export function useMasterData(): MasterDataService {
  return ctx.masterDataService;
}
