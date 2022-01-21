import { TOGGLE_NAV, CHANGE_NAV } from './constants';

const INITIAL_STATE = {
  open: false
};

const NavReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_NAV: {
      return { ...state, open: !state.open };
    }

    case CHANGE_NAV: {
      return { ...state, open: action.payload.status };
    }

    default:
      return state;
  }
};

export default NavReducer;
