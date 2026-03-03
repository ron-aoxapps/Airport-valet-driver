import { takeEvery, put } from 'redux-saga/effects';
import { ENDPOINT, SUCCESS } from '../../config';
import {
  loginByPasswordRequest,
  loginRequestAction,
  loginSuccessAction,
  loginFailAction,
  registerRequest,
  resetPasswordRequest,
  verifyOtpRequestAction,
} from './actions';
import { setConfiguration } from '../../utils/configuration';
import { profileRequest, profileSuccess } from '../Profile/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hideLoader, showLoader } from '../Common/actions';
import { postAPI } from '../../utils/api';
import { popupType, showPopup, showToast } from '../../utils/commonFunction';
import { navigationRef } from '../../navigation/rootNavigation';
import { setAuthenticationToken, setUserId } from '../../utils/authentication';
import socketServices from '../../utils/socket';

function* onLoginRequested({ payload }) {
  yield put(showLoader());
  try {
    const response = yield postAPI(ENDPOINT.login, payload.data, false);

    if (response.data.status == SUCCESS) {
      console.log('success');
      const { data, exist } = response.data;

      if (!exist) {
        navigationRef.navigate('VerifyOtp', { serverResponse: data });
      } else {
        navigationRef.navigate('Password', { serverResponse: data });
      }

      yield put(hideLoader());
    } else {
      yield put(hideLoader());
      showToast(popupType.error, response.data.message || 'Login failed', true);
    }
  } catch (error) {
    yield put(hideLoader());
    showToast(popupType.error, error.message || 'Network error', true);
  }
}

function* onRegisterRequest({ payload }) {
  yield put(showLoader());
  try {
    const response = yield postAPI(ENDPOINT.register, payload.data, false);

    if (response.data) {
      const user = response.data.data;
      console.log(user,'userid')
      yield setConfiguration('token', user.token);
      yield setConfiguration('user_id', user._id);
      yield put(profileSuccess(response.data));
      yield put(hideLoader());
      navigationRef.reset({ routes: [{ name: 'App' }] });

      socketServices.initializeSocket(user.token, user._id, payload.dispatch);
    } else {
      yield put(hideLoader());
      showToast(popupType.error, response.data.message || 'Registration failed', true);
    }
  } catch (error) {
    yield put(hideLoader());
    showToast(popupType.error, error.message || 'Network error', true);
  }
}

function* onLoginByPasswordRequest({ payload }) {
  yield put(showLoader());
  try {
    const response = yield postAPI(ENDPOINT.login, payload.data, false);
    if (response.data.message ==  "Login successful.") {
      const user = response.data.data;
      console.log(response, 'dataresponse');
      
      // Store authentication data
      yield setAuthenticationToken(user.token);
      yield setUserId(user.user.id);
      yield setConfiguration('token', user.token);
      yield setConfiguration('user_id', user.user.id);
      console.log(response.data, 'loginresponse');
      
      socketServices.initializeSocket(user.token, user.user.id, payload.dispatch);
      
      // Update Redux state with user data
      yield put(loginSuccessAction(response.data));
      yield put(profileSuccess(response.data));
      
      yield put(hideLoader());
      
      // Navigate to main app
      if (navigationRef.isReady()) {
        navigationRef.reset({ routes: [{ name: 'App' }] });
        console.log('Navigation reset successful');
      } else {
        console.log('Navigation ref not ready');
        // Store a flag to navigate after ref is ready
      }
      
      showToast(popupType.success, 'Login successful!', true);
    } else {
      console.log('Login failed:', response);
      yield put(loginFailAction(response.data.message || 'Login failed'));
      yield put(hideLoader());
      showToast(popupType.error, response.data.message || 'Login failed', true);
    }
  } 
  catch (error) {
    console.log('Login error:', error);
    
    // Extract error message from the error object
    let errorMessage = 'Network error. Please try again.';
    
    // Check if error has response data (for 400 errors)
    if (error.response) {
      console.log('Error response:', error.response);
      
      // Extract message from response data
      if (error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }
    } 
    
    yield put(loginFailAction(errorMessage));
    yield put(hideLoader());
    showToast(popupType.error, errorMessage, true);
  }
}

function* onVerifyOtpRequestAction({ payload }) {
  yield put(showLoader());
  try {
    const response = yield postAPI(ENDPOINT.verifyOtp, payload.data, false);

    if (response.data.status == SUCCESS) {
      console.log('OTP verification success');
      yield put(hideLoader());
      
      if (payload.onSuccess) {
        payload.onSuccess(response.data);
      }
    } else {
      yield put(hideLoader());
      showToast(popupType.error, response.data.message || 'OTP verification failed', true);
    }
  } catch (error) {
    yield put(hideLoader());
    showToast(popupType.error, error.message || 'Network error', true);
  }
}

function* onResetPasswordRequested({ payload }) {
  yield put(showLoader());
  try {
    const formData = new FormData();
    formData.append('login_email', payload.email);
    const response = yield postAPI(ENDPOINT.reset_password, formData, true);

    if (response.data.status == true) {
      console.log('Reset password email sent');
      showToast(
        popupType.success,
        'A reset password link has been sent to ' + payload.email,
        true,
      );
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
      showToast(popupType.error, response.data.message || 'Failed to send reset email', true);
    }
  } catch (error) {
    yield put(hideLoader());
    showToast(popupType.error, error.message || 'Network error', true);
  }
}

function* sagaLogin() {
  yield takeEvery(registerRequest, onRegisterRequest);
  yield takeEvery(loginByPasswordRequest, onLoginByPasswordRequest);
  yield takeEvery(loginRequestAction, onLoginRequested);
  yield takeEvery(verifyOtpRequestAction, onVerifyOtpRequestAction);
  yield takeEvery(resetPasswordRequest, onResetPasswordRequested);
}

export default sagaLogin;