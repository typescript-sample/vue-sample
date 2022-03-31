import { Attributes, Filter, Service, Tracking } from 'onecore';
import { Client, HttpRequest } from 'web-clients';

export interface UserFilter extends Filter {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  status: string[] | string;

  page?: number;
  limit?: number;
  firstLimit?: number;
  fields?: string[];
  sort?: string;

  q?: string;
  excluding?: any;
  refId?: string|number;
}
export interface User extends Tracking {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  imageURL?: string;
  status: string;
  gender?: string;
  phone?: string;
  title?: string;
  position?: string;
  roles?: string[];
}
export interface UserService extends Service<User, string, UserFilter> {
  getUsersByRole(id: string): Promise<User[]>;
}

export const userModel: Attributes = {
  userId: {
    length: 40,
    required: true,
    key: true
  },
  username: {
    length: 100,
    required: true
  },
  displayName: {
    length: 100,
    required: true
  },
  imageURL: {
    length: 255
  },
  gender: {
    length: 10
  },
  title: {
    length: 20
  },
  position: {
    length: 20
  },
  phone: {
    format: 'phone',
    length: 14
  },
  email: {
    length: 100
  },
  status: {
    length: 1
  },
  createdBy: {
    length: 40
  },
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {
    length: 40
  },
  updatedAt: {
    type: 'datetime'
  }
};
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
