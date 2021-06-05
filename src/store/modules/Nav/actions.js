import { TOOGLE_NAV, CHANGE_NAV } from './constants';

export const NavToogleAction = () => ({
  type: TOOGLE_NAV
});

export const NavChangeAction = status => ({
  type: CHANGE_NAV,
  payload: status
});
