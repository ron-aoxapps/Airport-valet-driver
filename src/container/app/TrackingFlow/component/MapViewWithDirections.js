import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { ENV } from '../../../../config';
import { Colors, Images } from '../../../../constants';
import MapView, { Marker } from 'react-native-maps';
import FastImage from 'react-native-fast-image';

const MapViewWithDirections = ({
  origin,
  destination,
  type = 'pickup',
  driverOnly,
  onReady,
  directionsVisible = true,
  destinationIcon = Images.car_top_2,
  sourceIcon = Images.captain,
  sourceIconStyle,
}) => {


  console.log('origin', { origin, destination })


  return (
    <>

      <Marker identifier={'Source'} flat={false} coordinate={origin}>
        <View style={sourceIconStyle}>
          <Image
            resizeMode="contain"
            source={sourceIcon}
            style={{
              height: 35,
              width: 35,
              resizeMode: 'contain',
              // tintColor: 'black',
            }}
          />
        </View>
      </Marker>
  {driverOnly ? null : 
      <Marker identifier={'Source'} flat={false} coordinate={destination}>
        <View
          >
          <FastImage
            resizeMode="contain"
            source={destinationIcon}
            style={{ height: 35, width: 35, resizeMode: 'contain' }}
          />
        </View>
      </Marker>}

      {driverOnly ? null : 
      <MapViewDirections
        origin={origin}
        destination={destination}
        apikey={ENV.GOOGLE_MAPS_APIKEY}

        strokeWidth={5}
        strokeColors={[Colors.primary]}
        onReady={distance => onReady(distance)}
      /> }

    </>
  );
};

export default MapViewWithDirections;

const styles = StyleSheet.create({});
