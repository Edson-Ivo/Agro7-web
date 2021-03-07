import AuthService from '../../../services/AuthService';

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
    default:
      return state;
  }
};

export default UserReducer;
