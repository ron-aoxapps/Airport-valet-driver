import {createAction} from '@reduxjs/toolkit';

export const parkingHistoryRequest = createAction('parkingHistory/request');
export const parkingHistorySuccess = createAction('parkingHistory/success');

export const goOnlieOfflineRequest = createAction('goOnlieOffline/request');

export const createCarParkingRequest = createAction('carParking/request');
export const carParkingSuccess = createAction('carParking/success');

export const tripDetailRequest = createAction('tripDetail/request');
export const tripDetailSuccess = createAction('tripDetail/success');

// Actions for multiple requests
export const addNewTripRequest = createAction('ADD_NEW_TRIP_REQUEST');
export const selectTripRequest = createAction('SELECT_TRIP_REQUEST');
export const removeTripRequest = createAction('REMOVE_TRIP_REQUEST');

// Action for selecting trip detail from a separate request
export const selectTripDetailSuccess = createAction('SELECT_TRIP_DETAIL_SUCCESS');

export const closeRequestModalAction = createAction('closeRequestModal');

export const acceptRequest = createAction('acceptRequest/request');
export const rejectRequest = createAction('rejectRequest/request');

// Specific actions for different statuses
export const pickupInRouteRequest = createAction('pickupInRoute/request');
export const arrivedAtCustomerLocationRequest = createAction('arrivedAtCustomerLocation/request');
export const carParkedRequest = createAction('carParked/request');
export const returnAcceptRequest = createAction('returnAccept/request');
export const returnArrivedRequest = createAction('returnArrived/request');
export const completeTripRequest = createAction('completeTrip/request'); // New action for trip completion

export const tripStatusChangeAction = createAction('tripStatusChange/request');
export const driverArrivedAction = createAction('driverArrived/request');
export const carPickedUpAction = createAction('carPickedUp/request');
export const carParkedAction = createAction('carParked/request');

export const verifyTripOTPRequest = createAction('verifyTripOTP/request');