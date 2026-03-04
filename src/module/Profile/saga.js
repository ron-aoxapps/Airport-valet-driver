import SplashScreen from 'react-native-splash-screen';
import {takeEvery, put} from 'redux-saga/effects';
import {ENDPOINT, SUCCESS} from '../../config';
import {navigationRef} from '../../navigation/rootNavigation';
import {get, postAPI, put as putAPI} from '../../utils/api';
import {getUserId} from '../../utils/authentication';
import {popupType, showPopup} from '../../utils/commonFunction';
import {hideLoader, sendOTPFail, showLoader} from '../Common/actions';
import {
  changePasswordRequest,
  deleteProfileRequest,
  profileRequest,
  profileSuccess,
  savePaymentMethodRequest,
  updateProfileImageRequest,
  updateProfileRequest,
} from './actions';
import {Platform} from 'react-native';
import {tripDetailRequest} from '../App/actions';

function* onProfileRequest({payload}) {
  // yield put(showLoader())

  try {
    const response = yield get('driver/profile', undefined, false);
    console.log(response.data,'responseprofile')
    if (response?.data?.success === true) {
      yield put(profileSuccess(response.data.data));
      const tripId = response?.data?.data?.currentTripId;

      if (tripId) {
        yield put(tripDetailRequest({data: {tripId}}));
      }

      SplashScreen.hide();
    } else {
      SplashScreen.hide();
    }
  } catch (error) {
    SplashScreen.hide();
  }
}

function* onchangePasswordRequest({payload}) {
  yield put(showLoader());
  try {
    const user_id = yield getUserId();
    const form = new FormData();
    form.append('client_id', user_id);
    form.append('oldPassword', payload.currentPassword);
    form.append('newPassword', payload.newPassword);
    form.append('cNewPassword', payload.newPassword);

    const response = yield postAPI(ENDPOINT.changePassword, form, true);

    if (response.data.status == true) {
      const callback = () => {
        navigationRef.goBack();
      };
      showPopup(
        popupType.success,
        'Password has been changed successfully.',
        'Change Passowrd',
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

// function* onUpdateProfile({payload}) {
//   yield put(showLoader());
//   try {
//     const response = yield postAPI('driver/updateprofile', payload.data, false);
//     if (response.data.status == SUCCESS) {
//       showPopup(
//         popupType.success,
//         'Profile has been updated successfully.',
//         'Update Profile',
//       );
//       yield put(profileRequest());
//       yield put(hideLoader());
//     } else {
//       yield put(hideLoader());
//     }
//   } catch (error) {
//     yield put(hideLoader());
//   }
// }

function* onUpdateProfile({payload}) {
  yield put(showLoader());
  try {
    // Create FormData
    const form = new FormData();
    form.append('countryCode', payload.data.countryCode);
    form.append('phoneNumber', payload.data.phoneNumber);
    form.append('address', payload.data.address);
    form.append('name', payload.data.name);
    
    // Handle profile image if it exists and is a new image (starts with file://)
    if (payload.data.profileImage && payload.data.profileImage.startsWith('file://')) {
      const imageUri = payload.data.profileImage;
      const imageName = imageUri.split('/').pop();
      const imageType = `image/${imageName.split('.').pop()}`;
      
      form.append('profilePicture', {
        uri: imageUri,
        type: imageType,
        name: imageName,
      });
    } else {
      // If no new image, send empty string or existing image URL
      form.append('profilePicture', payload.data.profileImage || '');
    }

    console.log('FormData being sent:', form);
    
    // Use putAPI for PUT request
    const response = yield putAPI(ENDPOINT.common_settings, form, true);

    if (response.data.success) {
      showPopup(
        popupType.success,
        'Profile has been updated successfully.',
        'Update Profile',
      );
      yield put(profileRequest()); // Refresh profile data
      yield put(hideLoader());
    } else {
      showPopup(
        popupType.error,
        response.data.message || 'Failed to update profile',
        'Error',
      );
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('Update Profile Error:', error);
    showPopup(
      popupType.error,
      'An error occurred while updating profile',
      'Error',
    );
    yield put(hideLoader());
  }
}

function* onUpdateProfileImage({payload}) {
  yield put(showLoader());
  try {
    const user_id = yield getUserId();
    const form = new FormData();
    form.append('client_id', user_id);

    form.append('profile-pic', {
      uri: payload.uri,
      type:
        Platform.OS == 'android' ? payload.type : payload.type.split('/')[1],
      name: payload.fileName,
    });

    console.log('form', JSON.stringify(form));
    const response = yield postAPI(ENDPOINT.update_user_logo, form, true);

    console.log('response', response);
    if (response.data.status == true) {
      showPopup(
        popupType.success,
        'Profile Image has been updated successfully.',
        'Update Profile',
      );
      yield put(profileRequest());
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}
function* onSavePaymentMethod({payload}) {
  yield put(showLoader());
  try {
    const user_id = yield getUserId();
    const form = new FormData();
    form.append('client_id', user_id);
    form.append('paymentType', payload.paymentType);
    form.append('paymentAccount', payload.paymentAccount);

    const response = yield postAPI(ENDPOINT.save_payment_detail, form, true);
    if (response.data.status == true) {
      const callback = () => {
        navigationRef.goBack();
      };

      showPopup(
        popupType.success,
        'Payment account updated successfully.',
        'Account',
        callback,
      );
      yield put(profileRequest());

      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}
function* onDeleteProfileRequest({payload}) {
  yield put(showLoader());
  try {
    const user_id = yield getUserId();
    const form = new FormData();
    form.append('client_id', user_id);
    form.append('password', payload.password);

    const response = yield postAPI(ENDPOINT.delete_account, form, true);
    if (response.data.status == true) {
      payload.callback('success');
      yield put(hideLoader());
    } else {
      payload.callback('failed');
      yield put(hideLoader());
    }
  } catch (error) {
    payload.callback('failed');
    yield put(hideLoader());
  }
}

function* sagaProfile() {
  yield takeEvery(profileRequest, onProfileRequest);
  yield takeEvery(changePasswordRequest, onchangePasswordRequest);
  yield takeEvery(updateProfileRequest, onUpdateProfile);
  yield takeEvery(updateProfileImageRequest, onUpdateProfileImage);
  yield takeEvery(savePaymentMethodRequest, onSavePaymentMethod);
  yield takeEvery(deleteProfileRequest, onDeleteProfileRequest);
}
export default sagaProfile;
