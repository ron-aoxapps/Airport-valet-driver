import React, { useEffect, useState } from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';

import AuthNavigation from './authNavigation';
import AppNavigation from './appNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyDrawer from './drawerNavigation';
import { getAuthenticationToken, getUserId } from '../utils/authentication';
import { setConfiguration } from '../utils/configuration';
import { useDispatch } from 'react-redux';
import { getBasicSettingInfoRequest } from '../module/Common/actions';
import socketServices from '../utils/socket';
import { requestLocationPermission } from '../utils/permissions';
import Geolocation from 'react-native-geolocation-service';

const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef();

const RootNavigation = () => {
  const [initialRoute, setinitialRoute] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getAuthState();

  }, []);

  const getAuthState = async () => {
    const user_id = await getUserId();
    const token = await getAuthenticationToken();
    console.log('root navigation token', user_id);
    if (user_id) {
      setinitialRoute('App');
      console.log(user_id,'testdriverid')
      socketServices.initializeSocket(token, user_id, dispatch);
      setConfiguration('token', token);
      setConfiguration('user_id', user_id);
    } else {
      setinitialRoute('Auth');
      setConfiguration('token', '');
      setConfiguration('user_id', '');
    }

    currentLocation();
  };

  const currentLocation = async () => {
    const res = await requestLocationPermission();
    console.log('location-res', res);
    if (res.isGraned) {
      Geolocation.getCurrentPosition(position => {
        console.log('location-position', position);
      });
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      {initialRoute ? (
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Auth" component={AuthNavigation} />
          <Stack.Screen name="App" component={AppNavigation} />
          {/* <Stack.Screen name='App' component={MyDrawer} /> */}
        </Stack.Navigator>
      ) : null}
    </NavigationContainer>
  );
};

export default RootNavigation;
