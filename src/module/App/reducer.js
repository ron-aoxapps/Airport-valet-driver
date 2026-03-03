import { createReducer } from '@reduxjs/toolkit';
import {
  closeRequestModalAction,
  parkingHistorySuccess,
  tripDetailSuccess,
  addNewTripRequest,
  selectTripRequest,
  removeTripRequest,
  parkingHistoryRequest,
  selectTripDetailSuccess,
} from './actions';
import { PENDING_BOOKINGS, COMPLETED_BOOKINGS } from '../../container/app/mybooking/MyBooking';

const initialState = {
  requestVisible: false,
  tripDetail: {},
  selectedTripDetail: {},
  pendingRequests: [],
  upcomingBooking: [],
  pastBooking: [],
  upcomingBookingPagination: { currentPage: 1, totalPages: 1, totalCount: 0, hasNextPage: false },
  pastBookingPagination: { currentPage: 1, totalPages: 1, totalCount: 0, hasNextPage: false },
  upcomingBookingCurrentPage: 1,
  pastBookingCurrentPage: 1,
  isLoadingMore: false,
};

const reducer = createReducer(initialState, builder => {
  builder.addCase(parkingHistoryRequest, (state, action) => {
    const { type, isLoadMore } = action.payload || {};
    if (isLoadMore) {
      return {
        ...state,
        isLoadingMore: true
      };
    }
    return state;
  });

  builder.addCase(parkingHistorySuccess, (state, action) => {
    const { type, trips = [], pagination = {}, isLoadMore = false, page = 1 } = action.payload;
    
    console.log('📦 Reducer - Type:', type, 'Trips count:', trips.length, 'Load More:', isLoadMore, 'Page:', page);
    
    if (type === COMPLETED_BOOKINGS) {
      return {
        ...state,
        pastBooking: isLoadMore ? [...state.pastBooking, ...trips] : trips,
        pastBookingPagination: pagination,
        pastBookingCurrentPage: page,
        isLoadingMore: false,
      };
    } else {
      return {
        ...state,
        upcomingBooking: isLoadMore ? [...state.upcomingBooking, ...trips] : trips,
        upcomingBookingPagination: pagination,
        upcomingBookingCurrentPage: page,
        isLoadingMore: false,
      };
    }
  });

  builder.addCase(selectTripDetailSuccess, (state, action) => {
    const selectedDetail = action.payload?.detail;
    
    console.log('🎯 selectTripDetailSuccess:', selectedDetail?._id);
    
    if (!selectedDetail?._id) return state;
    
    return {
      ...state,
      selectedTripDetail: selectedDetail,
      tripDetail: selectedDetail,
    };
  });

  builder.addCase(closeRequestModalAction, (state, action) => {
    return {
      ...state,
      requestVisible: false,
    };
  });

  builder.addCase(addNewTripRequest, (state, action) => {
    const newRequest = action.payload;
    console.log('➕ addNewTripRequest:', newRequest?._id, 'new:', newRequest, 'status:', newRequest?.tripStatus);

    // Allow Parked status to be added to pending requests
    if (newRequest.tripStatus !== 'FindingDrivers' && 
        newRequest.tripStatus !== 'FindingDriver' && 
        newRequest.tripStatus !== 'Parked') {  // Added Parked status
      console.log('⏭️ Not adding - status not FindingDrivers, FindingDriver, or Parked');
      return state;
    }
    
    const exists = state.pendingRequests.some(
      req => req?._id === newRequest?._id
    );
    
    if (!exists && newRequest?._id) {
      console.log('✅ Adding new request to pending for status:', newRequest?.tripStatus);
      const updatedPendingRequests = [...state.pendingRequests, newRequest];
      return {
        ...state,
        pendingRequests: updatedPendingRequests,
        tripDetail: state.pendingRequests.length === 0 ? newRequest : state.tripDetail,
        requestVisible: true, // Always show modal for Parked status as well
      };
    }
    return state;
  });

  builder.addCase(tripDetailSuccess, (state, action) => {
    const updatedRequest = action.payload?.detail;
    const requestVisible = action.payload?.requestVisible || false;
    
    if (!updatedRequest?._id) return state;

    console.log('📝 tripDetailSuccess:', updatedRequest._id, 'status:', updatedRequest.tripStatus);
    console.log('📝 Current pending count:', state.pendingRequests.length);

    // Only remove from pending if status is not FindingDrivers, FindingDriver, or Parked
    if (updatedRequest.tripStatus !== 'FindingDrivers' && 
        updatedRequest.tripStatus !== 'FindingDriver' &&
        updatedRequest.tripStatus !== 'Parked') {  // Keep Parked in pending
      console.log('🗑️ Removing trip from pending (status changed to:', updatedRequest.tripStatus);
      const filteredRequests = state.pendingRequests.filter(
        req => req?._id !== updatedRequest._id
      );
      console.log('📊 After filtering - pending count:', filteredRequests.length);
      return {
        ...state,
        pendingRequests: filteredRequests,
        tripDetail: filteredRequests.length > 0 ? filteredRequests[0] : {},
        requestVisible: filteredRequests.length > 0,
      };
    }

    const requestExists = state.pendingRequests.some(
      req => req?._id === updatedRequest._id
    );

    let updatedPendingRequests;
    if (requestExists) {
      updatedPendingRequests = state.pendingRequests.map(req =>
        req?._id === updatedRequest._id ? updatedRequest : req
      );
      console.log('🔄 Updated existing request for status:', updatedRequest.tripStatus);
    } else {
      updatedPendingRequests = [...state.pendingRequests, updatedRequest];
      console.log('➕ Added new request from tripDetailSuccess for status:', updatedRequest.tripStatus);
    }

    return {
      ...state,
      tripDetail: updatedRequest,
      pendingRequests: updatedPendingRequests,
      requestVisible: requestVisible, // This will be true for Parked status
    };
  });

  builder.addCase(selectTripRequest, (state, action) => {
    console.log('🎯 selectTripRequest:', action.payload);
    const selectedRequest = state.pendingRequests.find(
      req => req?._id === action.payload
    );
    if (selectedRequest) {
      return {
        ...state,
        tripDetail: selectedRequest,
        requestVisible: true,
      };
    }
    return state;
  });

  builder.addCase(removeTripRequest, (state, action) => {
    const tripIdToRemove = action.payload;
    console.log('🗑️ removeTripRequest called for:', tripIdToRemove);
    console.log('📊 Before removal - pending count:', state.pendingRequests.length);
    
    const filteredRequests = state.pendingRequests.filter(
      req => req?._id !== tripIdToRemove
    );
    
    console.log('📊 After removal - pending count:', filteredRequests.length);
    
    return {
      ...state,
      pendingRequests: filteredRequests,
      tripDetail: filteredRequests.length > 0 ? filteredRequests[0] : {},
      requestVisible: filteredRequests.length > 0,
    };
  });
});

export default reducer;