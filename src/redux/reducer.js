import {combineReducers} from 'redux';
import commonReducer from '../module/Common/reducer';
import profileReducer from '../module/Profile/reducer';
import vehicleReducer from '../module/Vehicles/reducer';
import AppReducer from '../module/App/reducer';

const appReducer = combineReducers({
  common: commonReducer,
  profile: profileReducer,
  vehicle: vehicleReducer,
  app: AppReducer,
});
const initialState = appReducer({}, {});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
