import { createAction } from "@reduxjs/toolkit";


export const profileRequest = createAction('profile/request')
export const profileSuccess = createAction('profile/success')
export const profileFail = createAction('profile/fail')


export const updateProfileRequest = createAction('updateProfile/request')

export const changePasswordRequest = createAction('changePassword/request')

export const updateProfileImageRequest = createAction('updateProfileImage/request')
export const savePaymentMethodRequest = createAction('savePaymentMethod/request')


export const deleteProfileRequest = createAction('deleteProfile/request')
