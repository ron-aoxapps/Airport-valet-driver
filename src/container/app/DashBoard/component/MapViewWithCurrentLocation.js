import { StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView from 'react-native-maps';
import { customMapStyle, getCurrentLocation } from '../../../../utils/commonFunction';
import { useSelector } from 'react-redux';
import { useMyLocationHook } from '../../../../module/Common/reducer';



const MapViewWithCurrentLocation = () => {
  const mapViewRef = useRef();
  const { location } = useMyLocationHook()

  useEffect(() => {
    // console.log('location', location)
  }, [location])


  useEffect(() => {
    getCurrentLocation(location => {
      // console.log('location', location);
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00921,
      };
      // mapViewRef?.current?.animateToRegion(region);
      mapViewRef.current.animateCamera({
        center: region,
        pitch: 60,
        heading: 0,
    })

    });
  }, []);

  return (
    <MapView
    
      ref={mapViewRef}
      style={{ flex: 1 }}
      initialRegion={{
        ...location,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      }}

      showsUserLocation
      showsMyLocationButton={false}
      customMapStyle={customMapStyle}

    //   initialCamera={{
    //     center: { latitude: 0, longitude: 0 },
    //     pitch: 0,
    //     zoom: 12,
    //     heading: 0,
    //     altitude: 0
    // }}


      onMapLoaded={()=>{

      //   mapViewRef.current.animateCamera({
      //     center: location,
      //     pitch: 10,
      //     zoom: 1,
      //     heading: 0,
      //     altitude: 0
      // })


      }}

      
      
    >
    </MapView>
  );
};

export default MapViewWithCurrentLocation;

const styles = StyleSheet.create({});
