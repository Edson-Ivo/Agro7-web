import { Base64 } from 'js-base64';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_TOKEN } from './constants';
import { getCookie, setCookie, removeCookie } from '../helpers/cookies';

import { api } from './api';

class AuthService {
  static async login(document, password) {
    return api
      .post(`/auth/login`, {
        document,
        password
      })
      .then(response => {
        if (response.data.access_token) {
          const { access_token, user } = response.data;

          setCookie(AUTH_COOKIE_TOKEN, access_token);
          setCookie(AUTH_COOKIE_NAME, Base64.encode(JSON.stringify(user)));
        }

        return response.data;
      });
  }

  static logout() {
    removeCookie(AUTH_COOKIE_TOKEN);
    removeCookie(AUTH_COOKIE_NAME);
  }

  static getCurrentUser() {
    const authCookie = getCookie(AUTH_COOKIE_NAME);

    return this.decodeUserData(authCookie);
  }

  static decodeUserData(data) {
    if (data) {
      return JSON.parse(decodeURIComponent(Base64.decode(data)));
    }
    return {
      id: 0,
      name: '',
      email: '',
      types: ''
    };
  }
}

export default AuthService;
