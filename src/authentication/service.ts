import {AuthenClient, AuthenticationClient, AuthInfo} from 'authen-client';
import axios from 'axios';
import {HttpRequest} from 'axios-core';
import {CookieService} from 'cookie-core';
import config from '../config';

const httpRequest = new HttpRequest(axios);
export function useAuthen(): AuthenClient<AuthInfo> {
  const authenticator = new AuthenticationClient<AuthInfo>(httpRequest, config.authentication_url + '/authenticate');
  return authenticator;
}
export function useCookie(): CookieService {
  const cookieService = new CookieService(document);
  return cookieService;
}
