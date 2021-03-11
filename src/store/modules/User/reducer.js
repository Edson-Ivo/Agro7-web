import AuthService from '../../../services/AuthService';

import { AUTHENTICATE, DEAUTHENTICATE } from './constants';

let INITIAL_STATE = {
  id: 0,
  name: '',
  email: '',
  types: ''
};

if (typeof localStorage !== 'undefined') {
  const data = AuthService.getCurrentUser();

  if (data) {
    INITIAL_STATE = data;
  }
}

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHENTICATE: {
      const authObject = {
        ...action.payload.user
      };

      return authObject;
    }

    case DEAUTHENTICATE: {
      return {
        id: 0,
        name: '',
        email: '',
        types: ''
      };
    }

    default:
      return state;
  }
};

export default UserReducer;
