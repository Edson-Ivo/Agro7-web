import { combineReducers } from 'redux';

import AuthReducer from './Auth/reducer';

export default combineReducers({
  auth: AuthReducer
});
