import {createAction} from '@reduxjs/toolkit';

export const registerRequest = createAction('registerNewUser/request');

export const loginRequestAction = createAction('login/request');
export const loginSuccessAction = createAction('login/success');
export const loginFailAction = createAction('login/fail');

export const loginByPasswordRequest = createAction('loginByPassword/request');

export const verifyOtpRequestAction = createAction('verifyOtpLogin/request');

export const resetPasswordRequest = createAction('resetPassword/request');

// Add these if you need them
export const clearLoginData = createAction('login/clear');