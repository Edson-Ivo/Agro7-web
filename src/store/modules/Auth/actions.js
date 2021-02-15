import { AUTHENTICATE, DEAUTHENTICATE } from './constants';

export const AuthAction = user => ({
  type: AUTHENTICATE,
  payload: user
});

export const deAuthAction = () => ({
  type: DEAUTHENTICATE
});
