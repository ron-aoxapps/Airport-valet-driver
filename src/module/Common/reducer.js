import { createAction, createReducer, createSlice } from '@reduxjs/toolkit'

import { sendOtpRequest, sendOTPFail, sendOTPSuccess, showLoader, hideLoader, trackAction, termAndConditionRequest, termAndConditionSuccess, privaryPolicySuccess, setCurrentLocationAction, saveAlertData } from './actions'
import { useSelector } from 'react-redux'

const initialState = {
    currency_symbol: "USD",
    otpData: {},
    loading: false,
    loadingRequest: "",
    showLoader: true,
    terms: "",
    policy: "",
    initialLocation: {
        longitude: 0,
        latitude: 0,
    },
    alertData: {}
}

export const useMyLocationHook = () => {

    const { initialLocation } = useSelector(state => state.common)
    console.log(initialLocation)
    return {
        location: {
            longitude: initialLocation.longitude,
            latitude: initialLocation.latitude

        }
    }
}


const resetAction = createAction('reset-tracked-loading-state')


const reducer = createReducer(initialState, (builder) => {

    builder.addCase(saveAlertData, (state, action) => {
        return { ...state, alertData: action.payload };
    });

    builder.addCase(sendOtpRequest, (state, action) => {
        return { ...state, otpData: {}, }
    })
    builder.addCase(sendOTPSuccess, (state, action) => {
        return { ...state, otpData: action.payload }
    })
    builder.addCase(sendOTPFail, (state, action) => {
        return { ...state, }
    })

    builder.addCase(termAndConditionSuccess, (state, action) => {
        return {
            ...state, loading: true,
            terms: action.payload
        }
    })

    builder.addCase(privaryPolicySuccess, (state, action) => {
        return {
            ...state, loading: true,
            policy: action.payload
        }
    })


    builder.addCase(showLoader, (state, action) => {
        return {
            ...state, loading: true,
            showLoader: action.payload?.showLoader == false ? false : true
        }
    })
    builder.addCase(hideLoader, (state, action) => {
        return {
            ...state, loading: false, loadingRequest: "",
            showLoader: true
        }
    })

    builder.addCase(setCurrentLocationAction, (state, action) => {
        return {
            ...state,
            initialLocation: action.payload,
        };
    });

    builder.addMatcher((action) => action?.type?.endsWith('/request'),
        (state, action) => {

            return { ...state, loadingRequest: action.type }
        }
    )

})


export default reducer