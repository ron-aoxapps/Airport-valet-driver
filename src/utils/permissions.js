import {PermissionsAndroid, Platform} from 'react-native';
import { PERMISSIONS, RESULTS, check, request, openSettings } from 'react-native-permissions';

const requestCameraPermission = async () => {
    let data = { isGraned: false, Message: 'message' };

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
                data = { isGraned: true, Message: 'Camera permission given' };
                return data;
            } else {
                data = { isGraned: false, Message: 'Camera permission denied' };
                console.log('Camera permission denied');
                return data;
            }
        } catch (err) {
            console.warn(err);
            data = { isGraned: false, Message: 'Error with camera' };

            return data;
        }
    } else {
        // iOS permission handling
        try {
            const permission = PERMISSIONS.IOS.CAMERA;
            const result = await check(permission);

            console.log('Camera permission status:', result);

            switch (result) {
                case RESULTS.UNAVAILABLE:
                    data = { isGraned: false, Message: 'Camera is not available on this device' };
                    Alert.alert('Camera Unavailable', 'Camera is not available on this device.');
                    return data;

                case RESULTS.DENIED:
                    // Permission has not been requested yet, request it
                    const requestResult = await request(permission);
                    if (requestResult === RESULTS.GRANTED) {
                        data = { isGraned: true, Message: 'Camera permission granted' };
                        return data;
                    } else {
                        data = { isGraned: false, Message: 'Camera permission denied' };
                        return data;
                    }

                case RESULTS.GRANTED:
                    data = { isGraned: true, Message: 'Camera permission granted' };
                    return data;

                case RESULTS.BLOCKED:
                    // Permission has been denied and cannot be requested again
                    data = { isGraned: false, Message: 'Camera permission blocked' };
                    Alert.alert(
                        'Camera Permission Required',
                        'Camera access is required to take photos. Please enable camera permission in Settings.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Open Settings', onPress: () => openSettings() }
                        ]
                    );
                    return data;

                case RESULTS.LIMITED:
                    data = { isGraned: true, Message: 'Camera permission limited' };
                    return data;

                default:
                    data = { isGraned: false, Message: 'Unknown permission status' };
                    return data;
            }
        } catch (err) {
            console.warn('Error checking camera permission:', err);
            data = { isGraned: false, Message: 'Error checking camera permission' };
            return data;
        }
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
