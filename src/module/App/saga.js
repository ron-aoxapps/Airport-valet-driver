import { takeEvery, put } from 'redux-saga/effects';
import { CONSTANTS, SCREEN_NAMES, SUCCESS } from '../../config';
import { COMPLETED_BOOKINGS } from '../../container/app/mybooking/MyBooking';
import { navigationRef } from '../../navigation/rootNavigation';
import { get, postAPI } from '../../utils/api';
import { hideLoader, showLoader } from '../Common/actions';
import { profileSuccess } from '../Profile/actions';
import {
  acceptRequest,
  addNewTripRequest,
  createCarParkingRequest,
  goOnlieOfflineRequest,
  parkingHistoryRequest,
  parkingHistorySuccess,
  rejectRequest,
  removeTripRequest,
  tripDetailRequest,
  tripDetailSuccess,
  tripStatusChangeAction,
  verifyTripOTPRequest,
} from './actions';

function* onGoOnlineOffline({ payload }) {
  yield put(showLoader({ showLoader: true }));
  try {
    const response = yield postAPI('driver/go-online', payload.data, false);
    console.log('API Response:', response);
    
    if (response?.data) {
      yield put(profileSuccess(response.data.data));
    } else {
      throw new Error(response?.message || 'Failed to update status');
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
    const status = type === COMPLETED_BOOKINGS ? 'Completed' : '';
    
    // Use the single endpoint with status parameter
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
      console.log('❌ Failed to fetch trips:', response.data);
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('🔴 Parking history error:', error);
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
  console.log('🔍 Fetching trip details for tripId:', payload.data.tripId);
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
      if (tripData.tripStatus === 'FindingDrivers') {
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



function* onAcceptRequest(action) {
  console.log('🔵 Accepting trip:', action.payload);
  yield put(showLoader({ showLoader: true }));

  try {
    console.log('🔵 Making API call to:', `driver/trip/accept/${action.payload}`);
    const response = yield postAPI(`driver/trip/accept/${action.payload}`, undefined, false);
    console.log('🔵 Full accept response:', JSON.stringify(response, null, 2));

    if (response.data && response.data.success === true) {
      console.log('🔵 Accept successful, response data:', response.data.data);
      console.log('🔵 Trip status after accept:', response.data.data?.tripStatus);
      
      yield put(removeTripRequest(action.payload));
      
      yield new Promise(resolve => setTimeout(resolve, 100));
      
      if (response.data.data) {
        const payload = {
          detail: response.data.data,
          requestVisible: false,
        };

        if (response.data.data?.tripStatus === 'FindingDriver' || 
            response.data.data?.tripStatus === 'FindingDrivers') {
          console.log('🔵 Trip still in FindingDrivers status');
          payload.requestVisible = true;
        } else {
          console.log('🔵 Trip status changed to:', response.data.data?.tripStatus);
        }

        yield put(tripDetailSuccess(payload));
      }
      
      yield put(hideLoader());
      console.log('🔵 Accept process completed');
    } else {
      console.log('🔵 Accept failed - success flag is false or missing:', response.data);
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('🔴 Accept error:', error);
    yield put(hideLoader());
  }
}

function* onRejectRequest(action) {
  console.log('🔴 Rejecting trip:', action.payload);
  yield put(showLoader({ showLoader: true }));

  try {
    const response = yield postAPI(`driver/trip/reject/${action.payload}`, undefined, false);
    console.log('🔴 Reject response:', response);

    if (response.data && response.data.success === true) {
      console.log('🔴 Reject successful');
      
      yield put(removeTripRequest(action.payload));
      
      yield new Promise(resolve => setTimeout(resolve, 100));
      
      if (response.data.data) {
        const payload = {
          detail: response.data.data,
          requestVisible: false,
        };

        yield put(tripDetailSuccess(payload));
      }
      
      yield put(hideLoader());
    } else {
      console.log('🔴 Reject failed:', response);
      yield put(hideLoader());
    }
  } catch (error) {
    console.log('🔴 Reject error:', error);
    yield put(hideLoader());
  }
}

function* onTripStatusChangeAction({ payload }) {
  yield put(showLoader({ showLoader: false }));
  const makeStatus = payload.data.tripStatus;
  const parked = payload.data.parked;
  let url = '';
  switch (makeStatus) {
    case CONSTANTS.Accepted:
      if (parked) {
        url = 'trip/returnInRoute';
      } else {
        url = 'trip/pickupInRoute';
      }
      break;
    case CONSTANTS.PickupInRoute:
      url = 'trip/driverarrived';
      break;
    case CONSTANTS.PickupArrived:
      url = 'trip/parkingInRoute';
      break;
    case CONSTANTS.ParkingInRoute:
      url = 'trip/parked';
      break;
    case CONSTANTS.ReturnInRoute:
      url = 'trip/returnArrived';
      break;
    case CONSTANTS.ReturnArrived:
      url = 'trip/tripcompleted';
      break;
    default:
      url = '';
      break;
  }

  try {
    const response = yield postAPI(url, payload.data, false);

    if (response.data.status == SUCCESS) {
      console.log('response-111', response.data.data?.tripId);
      yield put(tripDetailRequest({ data: { tripId: payload.data.tripId } }));
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}

function* onVerifyTripOTPRequest({ payload }) {
  yield put(showLoader({ showLoader: false }));
  try {
    const response = yield postAPI('trip/driverOtpVerifiy', payload.data, false);

    if (response.data.status == SUCCESS) {
      console.log('response', response);
      yield put(tripDetailRequest(payload));
      yield put(hideLoader());
    } else {
      yield put(hideLoader());
    }
  } catch (error) {
    yield put(hideLoader());
  }
}

function* sagaProfile() {
  yield takeEvery(parkingHistoryRequest, onParkingHistoryRequest);
  yield takeEvery(createCarParkingRequest, onCarParkingRequest);
  yield takeEvery(goOnlieOfflineRequest, onGoOnlineOffline);
  yield takeEvery(tripDetailRequest, onTripDetailRequest);
  yield takeEvery(acceptRequest, onAcceptRequest);
  yield takeEvery(rejectRequest, onRejectRequest);
  yield takeEvery(tripStatusChangeAction, onTripStatusChangeAction);
  yield takeEvery(verifyTripOTPRequest, onVerifyTripOTPRequest);
}

export default sagaProfile;