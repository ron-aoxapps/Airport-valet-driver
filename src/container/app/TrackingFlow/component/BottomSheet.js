import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {commonStyle} from '../../../../styles/styles';
import {scale} from 'react-native-size-matters';
import {Images} from '../../../../constants';
import {showLocation} from 'react-native-map-link';

const BottomSheet = ({coordinates, children, navigationVisible}) => {
  // coordinates
  // console.log('coordinates', coordinates);

  const openMap = () => {
    showLocation({
      latitude: coordinates.origin.latitude,
      longitude: coordinates.origin.longitude,
      sourceLatitude: coordinates.destination.latitude, // optionally specify starting location for directions
      sourceLongitude: coordinates.destination.longitude, // not optional if sourceLatitude is specified

      title: 'AirPort valet', // optional
      googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
      // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58', // optionally specify the google-place-id
      alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
      // dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
      // dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
      // cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
      // appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
      // naverCallerName: 'com.example.myapp', // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
      // appTitles: { 'google-maps': 'My custom Google Maps title' }, // optionally you can override default app titles
      // app: 'uber',  // optionally specify specific app to use
      directionsMode: 'car', // optional, accepted values are 'car', 'walk', 'public-transport' or 'bike'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>{children}</View>

      {navigationVisible ? (
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => openMap()}>
          <Image source={Images.navigation} style={styles.image} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  safeArea: {
    margin: scale(20),
    // marginTop: scale(20),
  },
  image: {
    ...commonStyle.mediumImg,
    height: scale(45),
    width: scale(45),
  },
  navigationButton: {
    position: 'absolute',
    top: -scale(25),
    right: scale(25),
  },
});
