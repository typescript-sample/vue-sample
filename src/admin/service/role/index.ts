import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { RoleFilter } from 'onecore';
import { options } from 'uione';
import { Client } from 'web-clients';
import { Privilege, Role, roleModel, RoleService } from './role';
import config from '../../../config'
export * from './role';

const httpRequest = new HttpRequest(axios, options);

export class RoleClient extends Client<Role, string, RoleFilter> implements RoleService {
  constructor(http: HttpRequest, protected url: string, protected privilegeUrl: string) {
    super(http, url, roleModel);
    this.assign = this.assign.bind(this);
    this.getPrivileges = this.getPrivileges.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.searchGet = true;

  }
  assign(roleId: string, users: string[]): Promise<number> {
    return this.http.put<number>(`${this.serviceUrl}/${roleId}/assign`, users);
  }
  getPrivileges(): Promise<Privilege[]> {
    return this.http.get<Privilege[]>(this.privilegeUrl);
  }
  getRoles(): Promise<Role[]> {
    return this.http.get<Role[]>(this.url);
  }

}

class ApplicationContext {
  readonly roleService = new RoleClient(httpRequest, config.role_url, config.privilege_url);
}

export const ctx = new ApplicationContext();
export function useRole(): RoleService {
  return ctx.roleService;
}
