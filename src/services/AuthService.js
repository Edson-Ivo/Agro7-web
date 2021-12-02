import Router from 'next/router';
import { Base64 } from 'js-base64';
import isValidJSON from '@/helpers/isValidJSON';
import isEmpty from '@/helpers/isEmpty';
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_TOKEN,
  REDIRECT_COOKIE_NAME
} from './constants';
import { getCookie, setCookie, removeCookie } from '../helpers/cookies';

import { api } from './api';

class AuthService {
  static async login(document, password, captcha) {
    return api
      .post(`/auth/login`, {
        document,
        password,
        captcha
      })
      .then(response => {
        if (response.data.access_token) {
          const { access_token: accessToken, user } = response.data;

          if (!user?.profile?.image_url)
            user.profile = {
              image_url: ''
            };

          setCookie(AUTH_COOKIE_TOKEN, accessToken);
          this.setUserDataCookie(user);
        }

        const redirect = this.getSavePage();
        removeCookie(REDIRECT_COOKIE_NAME);

        return { data: response.data, redirect };
      });
  }

  static logout(savePage = false) {
    if (savePage) this.savePage();

    removeCookie(AUTH_COOKIE_TOKEN);
    removeCookie(AUTH_COOKIE_NAME);
  }

  static getCurrentUser() {
    const authCookie = getCookie(AUTH_COOKIE_NAME);

    return this.decodeUserData(authCookie);
  }

  static encodeUserData(data) {
    return Base64.encode(JSON.stringify(data));
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

  static savePage() {
    setCookie(REDIRECT_COOKIE_NAME, Base64.encode(Router.router.asPath));
  }

  static getSavePage() {
    const page = getCookie(REDIRECT_COOKIE_NAME);

    return !isEmpty(page) ? Base64.decode(page) : '/';
  }

  static setUserDataCookie(data) {
    setCookie(AUTH_COOKIE_NAME, this.encodeUserData(data));
  }

  static async forgotPassword(email, captcha) {
    try {
      const response = await api.post(`/auth/forgot-password`, {
        email,
        captcha
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async changePassword(data) {
    try {
      const response = await api.post(`/auth/change-password`, { ...data });

      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async confirmEmail(token, captcha) {
    try {
      const response = await api.post(`/auth/confirm-email`, {
        token,
        captcha
      });

      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default AuthService;
