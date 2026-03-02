import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from '../config';

import {AddVehicle, Page, TrackingFlow} from '../container/app';
import MyDrawer from './drawerNavigation';
import {useDispatch} from 'react-redux';
import {profileRequest} from '../module/Profile/actions';
import {useEffect} from 'react';
import { getCurrentLocation } from '../utils/commonFunction';
import { setCurrentLocationAction } from '../module/Common/actions';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profileRequest());
    _getCurrentLocation();
  }, []);

  const _getCurrentLocation = () => {
    getCurrentLocation(location => {
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      dispatch(setCurrentLocationAction(region));
    });
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name={SCREEN_NAMES.DrawerNavigation} component={MyDrawer} />
      <Stack.Screen name={SCREEN_NAMES.TrackingFlow} component={TrackingFlow} />
      <Stack.Screen name={SCREEN_NAMES.AddVehicle} component={AddVehicle} />
      <Stack.Screen name={SCREEN_NAMES.Page} component={Page} />
    </Stack.Navigator>
  );
};

export default AppNavigation;