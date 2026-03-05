import { takeEvery, put } from 'redux-saga/effects';
import { CONSTANTS, SUCCESS } from '../../config';
import { COMPLETED_BOOKINGS, PENDING_BOOKINGS, ACCEPTED_BOOKINGS } from '../../container/app/mybooking/MyBooking';
import { navigationRef } from '../../navigation/rootNavigation';
import { get, postAPI } from '../../utils/api';
import { hideLoader, showLoader } from '../Common/actions';
import { profileSuccess } from '../Profile/actions';
import {
  acceptRequest,
  addNewTripRequest,
  arrivedAtCustomerLocationRequest,
  carParkedRequest,
  returnAcceptRequest,
  returnArrivedRequest,
  completeTripRequest,
  createCarParkingRequest,
  goOnlieOfflineRequest,
  parkingHistoryRequest,
  parkingHistorySuccess,
  pickupInRouteRequest,
  rejectRequest,
  removeTripRequest,
  selectTripDetailSuccess,
  selectTripRequest,
  tripDetailRequest,
  tripDetailSuccess,
  tripStatusChangeAction,
  verifyTripOTPRequest,
} from './actions';

function* onGoOnlineOffline({ payload }) {
  yield put(showLoader({ showLoader: true }));
  try {
    const response = yield postAPI('driver/go-online', payload.data, false);
    
    if (response?.data) {
      yield put(profileSuccess(response.data.data));
    }
  } catch (error) {
    console.error('Error in go online/offline:', error);
  } finally {
    yield put(hideLoader());
  }
}

function* onParkingHistoryRequest({ payload }) {
  yield put(showLoader({ showLoader: false }));

  try {
    const { type, page = 1, limit = 10, isLoadMore = false } = payload || {};  
    
    // Determine status based on tab type
    let status = '';
    if (type === PENDING_BOOKINGS) {
      status = 'FindingDrivers';
    } else if (type === ACCEPTED_BOOKINGS) {
      status = '';
    } else if (type === COMPLETED_BOOKINGS) {
      status = 'Completed';
    }
    
    const response = yield get(
      `driver/trips/available?page=${page}&limit=${limit}&status=${status}`, 
      undefined, 
      false
    );
    if (response.data && response.data.success === true) {
      const responseData = response.data.data || {};
      const trips = responseData.trips || [];
      const pagination = responseData.pagination || {
        currentPage: page,
        totalPages: 1,
        totalCount: trips.length,
      };
      const hasNextPage = page < pagination.totalPages;
      
      yield put(parkingHistorySuccess({
        type: type,
        trips: trips,
        pagination: {
          ...pagination,
          hasNextPage: hasNextPage,
          currentPage: page,
        },
        isLoadMore: isLoadMore,
        page: page
      }));
      
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('Parking history error:', error);
    yield put(hideLoader());
  }
}

function* onCarParkingRequest({ payload }) {
  yield put(showLoader({ showLoader: false }));
  try {
    const response = yield postAPI('trip/addtrip', payload.data, false);

    if (response.data.status == SUCCESS) {
      payload.callback(response.data.data);
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}

export function* onTripDetailRequest({ payload }) {
  yield put(showLoader({ showLoader: false }));
  try {
    const response = yield get(
      `driver/trip/${payload.data.tripId}`,
      undefined,
      false,
    );
    
    if (response.data) {
      const tripData = response.data.data;
      
      yield put(addNewTripRequest(tripData));
      
      let shouldShowModal = false;
      if (tripData.tripStatus === 'FindingDrivers' || tripData.tripStatus === 'Parked') {
        shouldShowModal = true;
      }
      
      yield put(tripDetailSuccess({
        detail: tripData,
        requestVisible: shouldShowModal,
      }));
      
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('Trip detail error:', error);
    yield put(hideLoader());
  }
}

export function* onTripSelectDetailRequest({ payload }) {
  yield put(showLoader({ showLoader: false }));
  try {
    const response = yield get(
      `driver/trip/${payload.data.tripId}`,
      undefined,
      false,
    );
    
    if (response.data) {
      const tripData = response.data.data;

      yield put(selectTripDetailSuccess({
        detail: tripData,
      }));
      
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('Trip detail error:', error);
    yield put(hideLoader());
  }
}

function* onPickupInRouteRequest({ payload }) {
  yield put(showLoader({ showLoader: true }));
  
  try {
    const response = yield postAPI(`driver/trip/pickup-in-route/${payload.tripId}`, payload.data, false);
    if (response.data && response.data.success) {
      yield put(tripDetailRequest({ data: { tripId: payload.tripId } }));
      
      if (response.data.data) {
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      if (payload.callback) {
        payload.callback(response.data.data);
      }
    }
  } catch (error) {
    console.log('Pickup In Route error:', error);
  } finally {
    yield put(hideLoader());
  }
}

function* onArrivedAtCustomerLocationRequest({ payload }) {
  yield put(showLoader({ showLoader: true }));
  
  try {
    const response = yield postAPI(`driver/trip/arrived-at-customer-location/${payload.tripId}`, payload.data, false);
    
    if (response.data && response.data.success) {
      yield put(tripDetailRequest({ data: { tripId: payload.tripId } }));
      
      if (response.data.data) {
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      if (payload.callback) {
        payload.callback(response.data.data);
      }
    }
  } catch (error) {
    console.log('Arrived At Customer Location error:', error);
  } finally {
    yield put(hideLoader());
  }
}

function* onCarParkedRequest({ payload }) {
  yield put(showLoader({ showLoader: true }));
  
  try {
    const response = yield postAPI(`driver/trip/car-parked/${payload.tripId}`, payload.data, false);
    
    if (response.data && response.data.success) {
      yield put(tripDetailRequest({ data: { tripId: payload.tripId } }));
      if (response.data.data) {
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      if (payload.callback) {
        payload.callback(response.data.data);
      }
    }
  } catch (error) {
    console.log('Car Parked error:', error);
  } finally {
    yield put(hideLoader());
  }
}

function* onReturnAcceptRequest({ payload }) {
  yield put(showLoader({ showLoader: true }));
  
  try {
    const response = yield postAPI(`driver/trip/return-accept/${payload.tripId}`, payload.data, false);
    
    if (response.data && response.data.success) {
      yield put(tripDetailRequest({ data: { tripId: payload.tripId } }));
      if (response.data.data) {
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      if (payload.callback) {
        payload.callback(response.data.data);
      }
    }
  } catch (error) {
    console.log('Return Accept error:', error);
  } finally {
    yield put(hideLoader());
  }
}

function* onReturnArrivedRequest({ payload }) {
  yield put(showLoader({ showLoader: true }));
  
  try {
    const response = yield postAPI(`driver/trip/return-arrived/${payload.tripId}`, payload.data, false);

    if (response.data && response.data.success) {
      yield put(tripDetailRequest({ data: { tripId: payload.tripId } }));
      if (response.data.data) {
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      if (payload.callback) {
        payload.callback(response.data.data);
      }
    }
  } catch (error) {
    console.log('Return Arrived error:', error);
  } finally {
    yield put(hideLoader());
  }
}

function* onCompleteTripRequest({ payload }) {
  yield put(showLoader({ showLoader: true }));
  
  try {
    const requestBody = {
      otp: payload.otp
    };
    
    const response = yield postAPI(`driver/trip/complete/${payload.tripId}`, requestBody, false);

    if (response.data && response.data.success) {
      yield put(tripDetailRequest({ data: { tripId: payload.tripId } }));
      if (response.data.data) {
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      if (payload.callback) {
        payload.callback(response.data.data);
      }
      
      if (payload.navigateToMyBooking) {
        navigationRef.navigate('MyBooking');
      }
    } else {
      if (payload.onError) {
        payload.onError(response.data?.message || 'Failed to complete trip');
      }
    }
  } catch (error) {
    if (payload.onError) {
      payload.onError(error.message || 'Network error');
    }
  } finally {
    yield put(hideLoader());
  }
}

function* onAcceptRequest(action) {
  yield put(showLoader({ showLoader: true }));

  try {
    const response = yield postAPI(`driver/trip/accept/${action.payload}`, undefined, false);

    if (response.data && response.data.success === true) {
      yield put(removeTripRequest(action.payload));
      
      yield new Promise(resolve => setTimeout(resolve, 100));
      
      if (response.data.data) {
        const payload = {
          detail: response.data.data,
          requestVisible: false,
        };

        if (response.data.data?.tripStatus === 'FindingDriver' || 
            response.data.data?.tripStatus === 'FindingDrivers') {
          payload.requestVisible = true;
        }

        yield put(tripDetailSuccess(payload));
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('Accept error:', error);
    yield put(hideLoader());
  }
}

function* onRejectRequest(action) {
  yield put(showLoader({ showLoader: true }));

  try {
    const response = yield postAPI(`driver/trip/reject/${action.payload}`, undefined, false);

    if (response.data && response.data.success === true) {
      yield put(removeTripRequest(action.payload));
      
      yield new Promise(resolve => setTimeout(resolve, 100));
      
      if (response.data.data) {
        const payload = {
          detail: response.data.data,
          requestVisible: false,
        };

        yield put(tripDetailSuccess(payload));
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('Reject error:', error);
    yield put(hideLoader());
  }
}

function* onTripStatusChangeAction({ payload }) {
  yield put(showLoader({ showLoader: false }));
  const makeStatus = payload.data.tripStatus;
  const parked = payload.data.parked;
  const tripId = payload.data.tripId;
  let url = '';
  
  switch (makeStatus) {
    case CONSTANTS.Accepted:
      if (parked) {
        url = `driver/trip/return-accept/${tripId}`;
      } else {
        url = 'trip/pickupInRoute';
      }
      break;
    case CONSTANTS.PickupInRoute:
      url = `driver/trip/pickup-in-route/${tripId}`;
      break;
    case CONSTANTS.PickupArrived:
      url = `driver/trip/arrived-at-customer-location/${tripId}`;
      break;
    case CONSTANTS.ParkingInRoute:
      url = `driver/trip/car-parked/${tripId}`;
      break;
    case CONSTANTS.ReturnInRoute:
      url = `driver/trip/return-arrived/${tripId}`;
      break;
    case CONSTANTS.ReturnArrived:
      url = `driver/trip/complete/${tripId}`;
      break;
    default:
      url = '';
      break;
  }

  try {
    let requestData = payload.data;
    if (makeStatus === CONSTANTS.ReturnArrived && payload.data.otp) {
      requestData = { otp: payload.data.otp };
    }
    
    const response = yield postAPI(url, requestData, false);

    if (response.data.status == SUCCESS) {
      yield put(tripDetailRequest({ data: { tripId: payload.data.tripId } }));
      if (response.data.data) {
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('Status change error:', error);
    yield put(hideLoader());
  }
}

function* onVerifyTripOTPRequest({ payload }) {
  yield put(showLoader({ showLoader: false }));
  try {
    const response = yield postAPI('trip/driverOtpVerifiy', payload.data, false);

    if (response.data.status == SUCCESS) {
      yield put(tripDetailRequest(payload));
      
      if (response.data.data) {
        yield put(selectTripDetailSuccess({
          detail: response.data.data,
        }));
      }
      
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('OTP verification error:', error);
    yield put(hideLoader());
  }
}

function* sagaProfile() {
  yield takeEvery(parkingHistoryRequest, onParkingHistoryRequest);
  yield takeEvery(createCarParkingRequest, onCarParkingRequest);
  yield takeEvery(goOnlieOfflineRequest, onGoOnlineOffline);
  yield takeEvery(tripDetailRequest, onTripDetailRequest);
  yield takeEvery(selectTripRequest, onTripSelectDetailRequest);
  yield takeEvery(acceptRequest, onAcceptRequest);
  yield takeEvery(rejectRequest, onRejectRequest);
  yield takeEvery(pickupInRouteRequest, onPickupInRouteRequest);
  yield takeEvery(arrivedAtCustomerLocationRequest, onArrivedAtCustomerLocationRequest);
  yield takeEvery(carParkedRequest, onCarParkedRequest);
  yield takeEvery(returnAcceptRequest, onReturnAcceptRequest);
  yield takeEvery(returnArrivedRequest, onReturnArrivedRequest);
  yield takeEvery(completeTripRequest, onCompleteTripRequest);
  yield takeEvery(tripStatusChangeAction, onTripStatusChangeAction);
  yield takeEvery(verifyTripOTPRequest, onVerifyTripOTPRequest);
}

export default sagaProfile;