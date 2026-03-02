import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import RootNavigation from './src/navigation/rootNavigation';
import SplashScreen from 'react-native-splash-screen';

import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import Loader from './src/components/Loader/Loader';
import { RNAlert, fcmService } from './src/components';
import { setConfiguration } from './src/utils/configuration';
import { setFcmToken } from './utils/authentication';
import NetInfo from '@react-native-community/netinfo';
import { ENV } from './config';

console.disableYellowBox = true;

// import notifee from '@notifee/react-native';

// notifee.registerForegroundService((notification) => {
//   return new Promise(() => {
//     // Long running task...
//   });
// });



const App = () => {
  const [isConnected, setConnection] = useState(true);

  useEffect(() => {
    SplashScreen.hide();
    _initFcmToken();

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Is connected?', state.isConnected);
      setConnection(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const _initFcmToken = () => {
    // fcmService.registerAppWithFCM();
    // fcmService.register((token) => {
    //     if (token) {
    //         setFcmToken(token)
    //         setConfiguration("fcmToken", token);
    //     } else {
    setConfiguration('fcmToken', 'none');
    //     }
    // });
  };

  return (
    <Provider store={store}>
      <RootNavigation />
      <Loader />
      <RNAlert />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
