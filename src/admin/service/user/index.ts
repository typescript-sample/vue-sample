import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { UserFilter } from 'onecore';
import { options, storage } from 'uione';
import { Client } from 'web-clients';
import { User, userModel, UserService } from './user';

export * from './user';

const httpRequest = new HttpRequest(axios, options);

export class UserClient extends Client<User, string, UserFilter> implements UserService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, userModel);
    this.searchGet = true;
    this.getUsersByRole = this.getUsersByRole.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
  }
  getUsersByRole(id: string): Promise<User[]> {
    const url = `${this.serviceUrl}?roleId=${id}`;
    return this.http.get<User[]>(url);
  }
  getAllUsers(): Promise<User[]> {
    return this.http.get<User[]>(`${this.serviceUrl}`);
  }
}

// export interface Config {
//   user_url: string;
// }
// class ApplicationContext {
//   /*
//   constructor() {
//     this.getConfig = this.getConfig.bind(this);
//     this.getMasterDataService = this.getMasterDataService.bind(this);
//     this.getUserService = this.getUserService.bind(this);
//   }
//   private masterDataService: MasterDataService;
//   private userService: UserClient;
//   getConfig(): Config {
//     return storage.config();
//   }
//   getMasterDataService(): MasterDataService {
//     if (!this.masterDataService) {
//       this.masterDataService = new MasterDataClient();
//     }
//     return this.masterDataService;
//   }

//   getUserService(): UserClient {
//     if (!this.userService) {
//       const c = this.getConfig();
//       this.userService = new UserClient(httpRequest, c.user_url);
//     }
//     return this.userService;
//   }*/
//   readonly masterDataService: MasterDataService = new MasterDataClient();
//   readonly userService = new UserClient(httpRequest, config.user_url);
// }

// export const ctx = new ApplicationContext();
// export function useUser(): UserService {
//   return ctx.userService;
// }
// export function useMasterData(): MasterDataService {
//   return ctx.masterDataService;
// }
