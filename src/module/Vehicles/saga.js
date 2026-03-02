import {takeEvery, put} from 'redux-saga/effects';
import {ENDPOINT, SUCCESS} from '../../config';
import {navigationRef} from '../../navigation/rootNavigation';
import {get, postAPI} from '../../utils/api';
import {popupType, showPopup} from '../../utils/commonFunction';
import {hideLoader, showLoader} from '../Common/actions';
import {
  addNewVehicleRequest,
  deleteVehicleRequest,
  vehicleListRequest,
  vehicleListSuccess,
} from './actions';

function* onAddNewVehicleRequest({payload}) {
  yield put(showLoader());
  try {
    const response = yield postAPI(ENDPOINT.addNewVehicle, payload.data, false);

    if (response.data.status == SUCCESS) {
      const callback = () => {
        navigationRef.goBack();
      };

      showPopup(
        popupType.success,
        'New vehicle added successfully.',
        'Vehicle',
        callback,
      );

      yield put(vehicleListRequest());

      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}
function* onVehicleListRequest({payload}) {
  yield put(showLoader({showLoader: false}));
  try {
    const response = yield get(ENDPOINT.getcarsList, undefined, false);

    if (response.data.status == SUCCESS) {
      yield put(vehicleListSuccess(response.data.data));
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}
function* onDeleteVehicleRequest({payload}) {
  yield put(showLoader({showLoader: true}));
  try {
    const response = yield postAPI(ENDPOINT.removecar, payload.data);
    if (response.data.status == SUCCESS) {
      yield put(vehicleListRequest());
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}

function* sagaProfile() {
  yield takeEvery(addNewVehicleRequest, onAddNewVehicleRequest);
  yield takeEvery(vehicleListRequest, onVehicleListRequest);
  yield takeEvery(deleteVehicleRequest, onDeleteVehicleRequest);
}
export default sagaProfile;
