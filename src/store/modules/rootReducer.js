import { combineReducers } from 'redux';

import NavReducer from './Nav/reducer';
import UserReducer from './User/reducer';

export default combineReducers({
  nav: NavReducer,
  user: UserReducer
});
