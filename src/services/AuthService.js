import { Base64 } from 'js-base64';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_TOKEN } from './constants';
import { getCookie, setCookie, removeCookie } from '../helpers/cookies';

import { api } from './api';

class AuthService {
  static async login(username, password) {
    const email = username;

    return api
      .post(`/auth/login`, {
        email,
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

    if (authCookie) {
      return JSON.parse(decodeURIComponent(Base64.decode(authCookie)));
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
