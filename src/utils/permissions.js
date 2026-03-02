import {PermissionsAndroid, Platform} from 'react-native';

const requestCameraPermission = async () => {
  let data = {isGraned: false, Message: 'message'};

  if (Platform.OS == 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'Allow camera permission to upload profile picture.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        data = {isGraned: true, Message: 'Camera permission given'};
        return data;
      } else {
        data = {isGraned: false, Message: 'Camera permission denied'};
        console.log('Camera permission denied');
        return data;
      }
    } catch (err) {
      console.warn(err);
      data = {isGraned: false, Message: 'Error with camera'};

      return data;
    }
  } else {
    data = {isGraned: true, Message: 'ios'};
    return data;
  }
};

const requestLocationPermission = async () => {
  let data = {isGraned: false, Message: 'message'};

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
        data = {isGraned: true, Message: 'Camera permission given'};
        return data;
      } else {
        data = {isGraned: false, Message: 'Camera permission denied'};
        console.log('Camera permission denied');
        return data;
      }
    } catch (err) {
      console.warn(err);
      data = {isGraned: false, Message: 'Error with camera'};

      return data;
    }
  } else {
    data = {isGraned: true, Message: 'ios'};
    return data;
  }
};

const requestContactPermission = async () => {
  let data = {isGraned: false, Message: 'message'};

  if (Platform.OS == 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'contacts Permission',
          message: 'APlease grant permission to access contacts.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        data = {isGraned: true, Message: 'permission given'};
        return data;
      } else {
        data = {isGraned: false, Message: 'permission denied'};
        console.log('contacts permission denied');
        return data;
      }
    } catch (err) {
      console.warn(err);
      data = {isGraned: false, Message: 'Error with contacts'};

      return data;
    }
  } else {
    data = {isGraned: true, Message: 'ios'};
    return data;
  }
};

export {
  requestCameraPermission,
  requestLocationPermission,
  requestContactPermission,
};
