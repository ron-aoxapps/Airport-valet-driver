import { createReducer, createSlice } from '@reduxjs/toolkit'

import { loginRequestAction, loginSuccessAction, loginFailAction } from './actions'

const initialState = {
    value: 0,
    loading: false,
    loginData: {},
    kycVerification: {}
}


const reducer = createReducer(initialState, (builder) => {
    builder.addCase(loginRequestAction, (state, action) => {
        return { ...state, loading: true }
    })
    builder.addCase(loginSuccessAction, (state, action) => {
        return { ...state, loading: false, loginData: action.payload }
    })
})



export default reducer