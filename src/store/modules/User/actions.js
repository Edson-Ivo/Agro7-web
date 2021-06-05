import { AUTHENTICATE, DEAUTHENTICATE } from './constants';

export const UserAuthAction = user => ({
  type: AUTHENTICATE,
  payload: user
});

export const UserDeAuthAction = () => ({
  type: DEAUTHENTICATE
});
