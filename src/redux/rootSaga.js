import {all} from 'redux-saga/effects';
import sagaCommon from '../module/Common/saga';
import sagaLogin from '../module/Login/saga';
import sagaProfile from '../module/Profile/saga';
import sagaVehicle from '../module/Vehicles/saga';
import sagaApp from '../module/App/saga';

export default function* rootSaga() {
  yield all([
    sagaCommon(),
    sagaLogin(),
    sagaProfile(),
    sagaVehicle(),
    sagaApp(),
  ]);
}
