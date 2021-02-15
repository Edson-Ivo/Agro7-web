import { Base64 } from 'js-base64';

import {
  AUTHENTICATE,
  DEAUTHENTICATE,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_TOKEN
} from './constants';

import { getCookie, setCookie, removeCookie } from '../../../helpers/cookies';

let INITIAL_STATE = {
  isLoggedIn: false,
  token: '',

  user: {
    id: 0,
    name: '',
    email: '',
    rules: ''
  }
};

if (typeof localStorage !== 'undefined') {
  const authCookie = getCookie(AUTH_COOKIE_NAME);
  const authToken = getCookie(AUTH_COOKIE_TOKEN);

  if (authCookie) {
    const data = JSON.parse(decodeURIComponent(Base64.decode(authCookie)));

    INITIAL_STATE = data;
    INITIAL_STATE.token = authToken;
  }
}

const AuthReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHENTICATE: {
      const authObject = {
        isLoggedIn: true,
        token: action.payload.token,
        user: action.payload.user
      };

      const data = Base64.encode(JSON.stringify(authObject));

      setCookie(AUTH_COOKIE_TOKEN, action.payload.token);
      setCookie(AUTH_COOKIE_NAME, data);

      return authObject;
    }

    case DEAUTHENTICATE: {
      removeCookie(AUTH_COOKIE_TOKEN);
      removeCookie(AUTH_COOKIE_NAME);

      return {
        isLoggedIn: false
      };
    }

    default:
      return state;
  }
};

export default AuthReducer;
