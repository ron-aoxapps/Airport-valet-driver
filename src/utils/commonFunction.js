import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {ENV} from '../config';
import {navigationRef} from '../navigation/rootNavigation';
import {clearAuthenticationToken, clearUserId} from './authentication';
import {setConfiguration} from './configuration';
import Geolocation from 'react-native-geolocation-service';

export const wp = val => {
  return widthPercentageToDP(val);
};

export const confirmAlert = (title = '', text = '', callback, confirmText) => {
  Alert.alert(title, text, [
    {text: confirmText || 'Ok', onPress: callback},
    {text: 'Cancel', onPress: () => {}, style: 'destructive'},
  ]);
};

export const googleAutocomplete = async (Location, curLat, curLong) => {
  const apiUrl =
    'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
    Location +
    '&key=' +
    ENV.GOOGLE_MAPS_APIKEY +
    //   '&components=country:in|country:us' +
    '&location=' +
    curLat +
    ',' +
    curLong +
    '&radius=' +
    1000;
  // console.log(apiUrl);
  const result = await fetch(apiUrl);
  const json = await result.json();
  return json;
};

export const popupType = {
  success: 'Success',
  warning: 'Warning',
  error: 'Danger',
};

export const showPopup = (type, message = '', screenTitle = '', callback) => {
  // Popup.show({
  //     type: type,
  //     title: screenTitle,
  //     button: true,
  //     textBody: message,
  //     buttonText: 'Ok',
  //     callback: () => {
  //         Popup.hide();
  //         callback && callback();
  //     }
  // })
  Alert.alert(
    screenTitle,
    message,
    [
      {
        text: 'Ok',
        onPress: () => {
          if (callback) {
            callback();
          }
        },
      },
    ],
    {cancelable: true},
  );
};

export const showToast = (type, title = '', rightIcon = false, leftIcon) => {
  let titletemp = typeof title == 'string' ? title : title[0];
  Alert.alert('Alert', titletemp, [], {cancelable: true});

  // Toast.show({
  //     type: type,
  //     title: title,
  //     rightIcon: rightIcon
  //     // type: config.type,
  // })
};

export const onLogout = async () => {
  navigationRef.reset({routes: [{name: 'Auth'}]});
  await clearAuthenticationToken();
  await clearUserId();
  setConfiguration('token', '');
  setConfiguration('user_id', '');
};

export const requestLocationPermission = async () => {
  let data = {isGranted: false, Message: 'message'};

  if (Platform.OS == 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Allow Location permission to show Near by driver.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        data = {isGranted: true, Message: 'Location permission given'};
        return data;
      } else {
        data = {isGranted: false, Message: 'Location permission denied'};
        console.log('Location permission denied');
        return data;
      }
    } catch (err) {
      console.warn(err);
      data = {isGranted: false, Message: 'Error with camera'};

      return data;
    }
  } else {
    data = {isGranted: true, Message: 'ios'};
    return data;
  }
};

export const getCurrentLocation = async callback => {
  if (Platform.OS == 'ios') {
    Geolocation.requestAuthorization('always');
  }

  Geolocation.getCurrentPosition(
    position => {
      console.log('getCurrentPosition');
      callback(position);
    },
    error => {
      console.log('error -  getCurrentPosition', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    },
  );
};

export const calculateEstimateCost = (service, extraServices) => {
  return '';
};

const TripStatus = () => {};


export const customMapStyle = [

  // {
  //   "featureType": "landscape",
  //   "elementType": "geometry",
  //   "stylers": [
  //     {
  //       "color": "#000000"
  //     }, {
  //       "lightness": 20
  //     }
  //   ]
  // },

  {
    "featureType": "administrative.locality",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station.airport",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.station.airport",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#960201"
      },

    ]
  },
  {
    "featureType": "transit.station.airport",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },


  {
    "featureType": "transit.station.airport",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "hue": "#ff0000"
      }
    ]
  },

]

