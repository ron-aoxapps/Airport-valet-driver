import {createAction} from '@reduxjs/toolkit';

export const sendOtpRequest = createAction('otp/request');
export const sendOTPSuccess = createAction('otp/success');
export const sendOTPFail = createAction('otp/fail');

export const getBasicSettingInfoRequest = createAction(
  'getBasicSettingInfo/request',
);
export const getBasicSettingInfoSuccess = createAction(
  'getBasicSettingInfo/success',
);

export const verifyOtpRequest = createAction('veifyOtp/request');
export const verifyOTPSuccess = createAction('veifyOtp/success');
export const verifyOTPFail = createAction('veifyOtp/fail');

export const uploadImageRequest = createAction('uploadImage/request');
export const uploadImageSuccess = createAction('uploadImage/success');
export const uploadImageFail = createAction('uploadImage/fail');

export const sendSupportRequest = createAction('support/request');

export const showLoader = createAction('showLoader');
export const hideLoader = createAction('hideLoader');

export const trackAction = createAction('track-loading-state');

export const termAndConditionRequest = createAction(
  'Term-and-condtion/request',
);
export const termAndConditionSuccess = createAction(
  'Term-and-condtion/success',
);
export const privaryPolicyRequest = createAction('privacy-policy/request');
export const privaryPolicySuccess = createAction('privacy-policy/success');
export const setCurrentLocationAction = createAction('setCurrentLocation');


export const saveAlertData = createAction('saveAlertData');
