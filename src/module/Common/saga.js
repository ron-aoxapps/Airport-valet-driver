import {StackActions} from '@react-navigation/native';
import {takeEvery, put} from 'redux-saga/effects';
import {ENDPOINT, SCREEN_NAMES, SUCCESS} from '../../config';
import {navigationRef} from '../../navigation/rootNavigation';
import {get, postAPI} from '../../utils/api';
import {popupType, showPopup} from '../../utils/commonFunction';

import {
  sendOtpRequest,
  sendOTPFail,
  sendOTPSuccess,
  showLoader,
  hideLoader,
  verifyOtpRequest,
  uploadImageRequest,
  sendSupportRequest,
  termAndConditionRequest,
  privaryPolicyRequest,
  privaryPolicySuccess,
  termAndConditionSuccess,
  getBasicSettingInfoRequest,
  getBasicSettingInfoSuccess,
} from './actions';

const popAction = StackActions.pop(2);
// adminSetting/getBasicSettingInfo
function* onImageUpload({payload}) {
  try {
    const data = payload.data;   
    const response = yield postAPI(ENDPOINT.upload, data);
    if (response.data.status == SUCCESS) {
      payload.callback({status: 'success', response: response.data.data});
    } else {
      payload.callback({status: 'failed', response: null});
    }
  } catch (error) {
    console.log('error uploding image', error);
    payload.callback({status: 'failed', response: null});
  }
}
function* onGetBasicSettingInfoRequest({payload}) {
 
  try {
    const response = yield get(`admin/getbasicinfo`);
    if (response.data.status == SUCCESS) {
      yield put(getBasicSettingInfoSuccess(response.data));
    } else {
    }
  } catch (error) {}
}

function* onSendSupportMessage({payload}) {
  yield put(showLoader());
  try {
    console.log('payload', payload);
    const response = yield postAPI(ENDPOINT.support, JSON.stringify(payload));

    if (response.data.status == SUCCESS) {
      const callback = () => {
        navigationRef.dispatch(popAction);
      };
      showPopup(
        popupType.success,
        'Support message sent,support team will connect you soon.',
        'Support Message',
        callback,
      );

      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}

function* onTermAndConditionRequest({payload}) {
  yield put(showLoader());
  try {
    const response = yield postAPI(ENDPOINT.terms);

    if (response.data.status == true) {
      yield put(termAndConditionSuccess(response.data?.data?.terms));

      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}
function* onPrivaryPolicyRequest({payload}) {
  yield put(showLoader());
  try {
    const response = yield postAPI(ENDPOINT.privacyPolicy);
    console.log('response', response);
    if (response.data.status == true) {
      yield put(privaryPolicySuccess(response.data?.data?.policy));
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}

// verifyOtpRequest
function* sagaCommon() {
  yield takeEvery(getBasicSettingInfoRequest, onGetBasicSettingInfoRequest);
  yield takeEvery(uploadImageRequest, onImageUpload);
  yield takeEvery(sendSupportRequest, onSendSupportMessage);

  yield takeEvery(termAndConditionRequest, onTermAndConditionRequest);
  yield takeEvery(privaryPolicyRequest, onPrivaryPolicyRequest);
}
export default sagaCommon;
