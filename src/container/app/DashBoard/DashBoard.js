import { Platform, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLoaderSelector } from '../../../module/customSelector';
import { scale } from 'react-native-size-matters';
import OnlineOfflineDriver from './component/OnlineOfflineDriver';
import RequestView from './component/RequestView';
import socketServices from '../../../utils/socket';
import {
  parkingHistoryRequest,
  tripDetailRequest,
} from '../../../module/App/actions';
import MapViewWithCurrentLocation from './component/MapViewWithCurrentLocation';
import { useIsFocused } from '@react-navigation/native';
import { CONSTANTS, SCREEN_NAMES } from '../../../config';
import { navigationRef } from '../../../navigation/rootNavigation';
import { notifyService } from '../../../components/Notification/notifyService';
import { fcmService } from '../../../components/Notification/FCMService';
import Geolocation from 'react-native-geolocation-service';
import { setCurrentLocationAction } from '../../../module/Common/actions';
import { profileRequest } from '../../../module/Profile/actions';

const DashBoard = () => {
  const dispatch = useDispatch();
  const appStore = useSelector(state => state.app);
  const { requestVisible, tripDetail } = appStore;
  const isFocused = useIsFocused();

  // Safe access with optional chaining and default value
  const profile = useSelector(state => state.profile?.profileData);
  const loadingState = useLoaderSelector();
  
  console.log('Full profile:', profile);

  useEffect(() => {
    console.log('Fetching profile on mount/focus');
    dispatch(profileRequest());
  }, [isFocused]);

  // Handle trip navigation
  useEffect(() => {
    if (isFocused && tripDetail) {
      currentTripNavigation();
    }
  }, [tripDetail, isFocused]);

  useEffect(() => {
    if (!profile?._id) {
      console.log('Profile not loaded yet, skipping location watch');
      return;
    }

    console.log('Starting location watch for driver:', profile._id);

    const watchId = Geolocation.watchPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const data = {
          angle: position.coords.heading,
          driverId: profile._id,
          driverLocation: {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          },
        };

        socketServices?.emit('driversocket', data, (res) => {
          console.log('Location emitted');
        });
        
        dispatch(setCurrentLocationAction(region));
      },
      (error) => {
        console.error('Location watch error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000,
      }
    );

    return () => {
      Geolocation?.clearWatch(watchId);
      Geolocation?.stopObserving();
    };
  }, [profile?._id]);

  const currentTripNavigation = () => {
    if (!tripDetail) return;
    
    const validStatuses = [
      CONSTANTS.Accepted,
      CONSTANTS.PickupInRoute,
      CONSTANTS.PickupArrived,
      CONSTANTS.ParkingInRoute,
      CONSTANTS.ReturnInRoute,
      CONSTANTS.ReturnArrived,
    ];

    if (validStatuses.includes(tripDetail.tripStatus)) {
      navigationRef.navigate(SCREEN_NAMES.TrackingFlow);
    }
  };

  const init = async () => {
    dispatch(parkingHistoryRequest());
  };

  // Show loading screen while profile is loading
  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapViewWithCurrentLocation />
      {profile?.driverStatus === 'Offline' ? null : <RequestView />}
      <OnlineOfflineDriver driverStatus={profile?.driverStatus} />
    </View>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    paddingHorizontal: scale(10),
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});