import { Base64 } from 'js-base64';
import isValidJSON from '@/helpers/isValidJSON';
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
          const { access_token: accessToken, user } = response.data;

          if (!user?.profile?.image_url)
            user.profile = {
              image_url: ''
            };

          setCookie(AUTH_COOKIE_TOKEN, accessToken);
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
      const decodedUser = Base64.decode(data);

      if (isValidJSON(decodedUser))
        return JSON.parse(decodeURIComponent(decodedUser));
    }
    return {
      id: 0,
      name: '',
      type: '',
      profile: {
        image_url: ''
      }
    };
  }
}

export default AuthService;
