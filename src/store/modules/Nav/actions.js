import { TOGGLE_NAV, CHANGE_NAV } from './constants';

export const NavToggleAction = () => ({
  type: TOGGLE_NAV
});

export const NavChangeAction = status => ({
  type: CHANGE_NAV,
  payload: status
});
