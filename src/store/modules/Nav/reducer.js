import { TOOGLE_NAV } from './constants';

const INITIAL_STATE = {
  open: false
};

const NavReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOOGLE_NAV: {
      return { ...state, open: !state.open };
    }

    default:
      return state;
  }
};

export default NavReducer;
