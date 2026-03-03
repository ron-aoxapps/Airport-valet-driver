import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { AnimatedRegion, MarkerAnimated } from 'react-native-maps';
import BottomSheet from './component/BottomSheet';
import {
  Button,
  Header,
  Row,
  Text,
  VectorIcon,
} from '../../../components';
import { Colors, Images } from '../../../constants';

import CallIcon from './component/CallIcon';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './styles';
import {
  selectTripRequest,
  tripDetailRequest,
  tripStatusChangeAction,
  verifyTripOTPRequest,
  pickupInRouteRequest,
  arrivedAtCustomerLocationRequest,
} from '../../../module/App/actions';
import { CONSTANTS } from '../../../config';
import { useLoaderSelector, useProfileSelector } from '../../../module/customSelector';
import { commonStyle } from '../../../styles/styles';
import { useIsFocused, useRoute } from '@react-navigation/native';
import SuccessModal from '../../../components/Common/SuccessModal';
import { navigationRef } from '../../../navigation/rootNavigation';
import { profileRequest } from '../../../module/Profile/actions';

import OTPInputView from '@twotalltotems/react-native-otp-input';
import MapViewWithDirections from './component/MapViewWithDirections';
import { useMyLocationHook } from '../../../module/Common/reducer';
import { getCurrentLocation } from '../../../utils/commonFunction';
import socketServices from '../../../utils/socket';
import { showLocation } from 'react-native-map-link';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const TrackingFlow = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const mapviewref = useRef();
  const userLiveMarkerRef = useRef();
  const driverMarkerRef = useRef();
  const isFocused = useIsFocused();
  const profile = useProfileSelector();
  const { tripId } = route.params || {};
  const { loading, loadingRequest } = useLoaderSelector();
  const { tripDetail, selectedTripDetail } = useSelector(state => state.app);
  console.log('tripDetail', selectedTripDetail)
  const { location } = useMyLocationHook();

  const [driverLiveLocation, setDriverLiveLocation] = useState(
    new AnimatedRegion({
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
    })
  );

  const [customerLiveLocation, setCustomerLiveLocation] = useState(
    new AnimatedRegion({
      latitude: tripDetail?.customerRefId?.userLocation?.coordinates?.[1] || 0,
      longitude: tripDetail?.customerRefId?.userLocation?.coordinates?.[0] || 0,
    })
  );

  useEffect(() => {
    if (tripId) {
      dispatch(selectTripRequest({ data: { tripId } }));
    }
  }, [tripId, dispatch]);

  const [myLocation, setMyLocation] = useState({
    ...location,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [state, setState] = useState({
    carParkedSuccessModal: false,
    text: '',
    code: '',
  });

  useEffect(() => {
    if (isFocused) {
      if (tripDetail?.tripStatus == CONSTANTS.Parked) {
        setState(prev => ({
          ...prev,
          carParkedSuccessModal: true,
          text: 'Vehicle Parked Successfully.',
        }));
      } else if (tripDetail?.tripStatus == CONSTANTS.Completed) {
        setState(prev => ({
          ...prev,
          carParkedSuccessModal: true,
          text: 'Vehicle Returned Successfully.',
        }));
      }
    }
  }, [tripDetail]);

  // Watch driver's location
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const newCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        if (Platform.OS == 'android') {
          if (driverMarkerRef?.current) {
            driverMarkerRef?.current?.animateMarkerToCoordinate(newCoordinate, 1000);
          }
        } else {
          driverLiveLocation.timing(newCoordinate).start();
        }

        const data = {
          driverId: profile?._id,
          driverLocation: {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          },
        };
        socketServices?.emit('driversocket', data, res => {
          console.log('+++driversocket+++', res);
        });
      },
      error => console.log('Watch position error:', error),
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
    );

    return () => {
      Geolocation?.clearWatch(watchId);
      Geolocation?.stopObserving();
    };
  }, []);

  useEffect(() => {
    _getCurrentLocation();
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00921,
    };
    
    mapviewref.current.animateCamera({
      center: region,
      pitch: 60,
      heading: 0,
    });

    socketServices?.on('customer_location_change', (res) => {
      console.log('+++customer_location_change+++', res);
      const region = {
        latitude: res?.userLocation?.coordinates[1],
        longitude: res?.userLocation?.coordinates[0],
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00921,
      };

      const newCoordinate = {
        latitude: region.latitude,
        longitude: region.longitude
      };

      if (Platform.OS == 'android') {
        if (userLiveMarkerRef?.current) {
          userLiveMarkerRef?.current?.animateMarkerToCoordinate(region, 5000);
        }
      } else {
        customerLiveLocation.timing(newCoordinate).start();
      }
    });

    return () => {
      socketServices.removeListener('customer_location_change');
    };
  }, []);

  const _getCurrentLocation = () => {
    getCurrentLocation(location => {
      const data = {
        driverId: profile?._id,
        driverLocation: {
          lng: location.coords.longitude,
          lat: location.coords.latitude,
        },
      };

      socketServices?.emit('driversocket', data, res => {
        console.log('+++driversocket+++', res);
      });
    });
  };

  const _verifyCode = () => {
    const data = {
      tripId: tripDetail._id,
      tripOTP: state.code,
    };

    dispatch(verifyTripOTPRequest({ data }));
  };
  
  const _onButtonPress = () => {
    let data = {
      tripId: tripDetail?._id,
    };
    console.log('Button Pressed with tripStatus:', tripDetail?.tripStatus);
    // Use specific action for PickupInRoute
    if (tripDetail?.tripStatus === CONSTANTS.Accepted) {
      alert('Pickup In Route', 'Are you sure you want to mark as arrived for pickup?');
      dispatch(pickupInRouteRequest({
        tripId: tripDetail?._id,
        callback: (response) => { 
          console.log('✅ Pickup In Route completed:', response);
        }
      }));
    } 
    else if (tripDetail?.tripStatus === CONSTANTS.PickupInRoute) {
      alert('Arrived for Pickup', 'Are you sure you want to mark as arrived for pickup?');
      dispatch(arrivedAtCustomerLocationRequest({
        tripId: tripDetail?._id,
        callback: (response) => {
          console.log('✅ Arrived At Customer Location completed:', response);
        }
      }));
    }
    
    else {
      // Use general status change for other statuses
      dispatch(tripStatusChangeAction({ data }));
    }
  };
  
  const _onParkedModalClick = () => {
    setState(prev => ({ ...prev, carParkedSuccessModal: false }));
    navigationRef.goBack();
    dispatch(profileRequest());
  };

  const useButton = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <Button
          loading={loading && (loadingRequest == tripStatusChangeAction || loadingRequest == pickupInRouteRequest)}
          disabled={
            // (tripDetail?.tripStatus == CONSTANTS.PickupArrived && !tripDetail?.verifiy) ||
            (tripDetail?.tripStatus == CONSTANTS.ReturnArrived && !tripDetail?.verifiy)
          }
          style={[
            (
              // tripDetail?.tripStatus == CONSTANTS.PickupArrived ||
              tripDetail?.tripStatus == CONSTANTS.ReturnArrived) &&
            !tripDetail?.verifiy && { backgroundColor: Colors.gray },
          ]}
          title={buttonText(tripDetail)}
          onPress={_onButtonPress}
        />
      </View>
    );
  };

  const UserandCall = () => {
    return (
      <Row>
        <Row>
          <Image style={styles.smallImg} source={Images.profileBlack} />
          <Text bold>
            {` `}
            {tripDetail?.customerId?.name}
          </Text>
        </Row>
        <CallIcon mobileNumber={tripDetail?.customerId?.phoneNumber} />
      </Row>
    );
  };

  const VehicleDetail = () => {
    return (
      <>
        <Row style={styles.pickupLocation}>
          <Image style={styles.smallImg} source={Images.vehicle} />
          <Text bold>
            {` `} {tripDetail?.bookingId?.vehicle.make} {tripDetail?.bookingId?.vehicle.model} | {' '}
            <Text bold style={commonStyle.uppercaseText}>
              {tripDetail?.bookingId?.vehicle.regno}
            </Text>
          </Text>
        </Row>
        <View style={commonStyle.sepratorStyle} />
      </>
    );
  };

  const PickupLocation = () => {
    return (
      <>
        <Row style={styles.pickupLocation}>
          <Image style={styles.smallImg} source={Images.locationIcon} />
          <View>
            <Text bold>Picked Up Location</Text>
            <Text>
              {tripDetail?.pickup?.address}
            </Text>
          </View>
        </Row>

        <View style={commonStyle.row}>
          <VectorIcon
            type='AntDesign'
            name='clockcircle'
            size={18}
            color={Colors.textColor}
          />

          <View style={{ marginLeft: 5 }}>
            {tripDetail?.parked ?
              <Text semibold medium>Return : {moment(tripDetail?.bookingId?.to, 'DD-MM-YYYY').format("DD-MM-YYYY")} {tripDetail?.returnTime}</Text>
              :
              <Text semibold medium>Pickup Date: {moment(tripDetail?.bookingId?.from, 'DD-MM-YYYY').format("DD-MM-YYYY")} {tripDetail?.pickupTime}</Text>
            }
          </View>
        </View>
      </>
    );
  };

  const OTP = () => {
    if (
      (tripDetail?.tripStatus == CONSTANTS.ReturnArrived ) &&
      !tripDetail?.verifiy
    )
      return (
        <View>
          <View style={commonStyle.sepratorStyle} />
          <Row>
            <OTPInputView
              pinCount={4}
              style={{ width: '50%', height: 50 }}
              code={state.code}
              onCodeChanged={code => {
                setState(prev => ({ ...prev, code }));
              }}
              autoFocusOnLoad={false}
              placeholderCharacter="0"
              placeholderTextColor={Colors.placeholderTextColor}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={code => {
                console.log(`Code is ${code}, you are good to go!`);
              }}
            />
            {(loading && loadingRequest == verifyTripOTPRequest)
              ?
              <View>
                <ActivityIndicator
                  color={Colors.primary}
                />
              </View>
              :
              <TouchableOpacity style={styles.verifyButton} onPress={_verifyCode}>
                <Text textColor={Colors.primary}>Verify</Text>
              </TouchableOpacity>
            }
          </Row>
        </View>
      );

    else return null;
  };

  const origin = {
    ...location,
  };
  
  const destination = {
    longitude: tripDetail?.pickup?.location.coordinates[0],
    latitude: tripDetail?.pickup?.location.coordinates[1],
  };

  const floatingComponent = () => {
    return (
      <View
        style={{
          position: 'absolute',
          right: 10,
          bottom: 20,
          flexDirection: 'row',
          display: 'flex',
        }}>
        <TouchableOpacity
          onPress={() => {
            showLocation({
              latitude: origin.latitude,
              longitude: origin.longitude,
              sourceLatitude: destination.latitude,
              sourceLongitude: destination.longitude,
              title: 'AirPort valet',
              googleForceLatLon: false,
              alwaysIncludeGoogle: true,
              directionsMode: 'car',
            });
          }}
          style={{
            backgroundColor: 'white',
            padding: 10,
            ...commonStyle.shadow,
            ...commonStyle.row,
            borderRadius: 30,
            backgroundColor: 'black',
          }}>
          <Image
            source={Images.navigation}
            style={{
              height: 25,
              width: 25,
              marginRight: 10,
              resizeMode: 'contain',
              tintColor: Colors.White,
            }}
          />
          <Text bold textColor="white">
            Navigate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const region = {
              latitude: tripDetail?.driverRefId?.driverLocation?.coordinates[1],
              longitude: tripDetail?.driverRefId?.driverLocation?.coordinates[0],
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00921,
            };

            mapviewref.current.animateCamera({
              center: region,
              pitch: 60,
              heading: 0,
            });
          }}
          style={{
            marginLeft: 10,
            backgroundColor: 'white',
            padding: 10,
            ...commonStyle.shadow,
            borderRadius: 30,
          }}>
          <Image
            source={Images.locationIcon}
            style={{
              height: 25,
              width: 25,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <ScrollView
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapviewref}
            style={{ flex: 1 }}
            initialRegion={{
              longitude: 76.7860317,
              latitude: 30.6679559,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            
            <MapViewWithDirections
              type={tripDetail?.parked ? 'return' : 'pickup'}
              driverOnly={
                tripDetail?.tripStatus == CONSTANTS.PickupArrived ||
                tripDetail?.tripStatus == CONSTANTS.ReturnArrived ||
                tripDetail?.tripStatus == CONSTANTS.ParkingInRoute
              }
              sourceIcon={Images.car_top_2}
              sourceIconStyle={{
                backgroundColor: "white",
                borderColor: Colors.primary,
                borderWidth: 2,
                borderRadius: 30,
                overflow: "hidden",
                padding: 2
              }}
              destinationIcon={(tripDetail?.parked) ? Images.locationpin : Images.car_top_2}
              origin={origin}
              destination={destination}
              onReady={result => {
                console.log('source', result);
                mapviewref?.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: width / 20,
                    bottom: height / 20,
                    left: width / 20,
                    top: height / 20,
                  },
                });
              }}
            />

            {/* Driver Marker - Car Icon */}
            <MarkerAnimated
              identifier={'Driver'}
              flat={true}
              coordinate={driverLiveLocation}
              ref={driverMarkerRef}
              anchor={{ x: 0.5, y: 0.5 }}>
              <View style={{
                backgroundColor: "white",
                borderColor: Colors.primary,
                borderWidth: 2,
                borderRadius: 30,
                overflow: "hidden",
                padding: 5,
                ...commonStyle.shadow
              }}>
                <Image
                  resizeMode="contain"
                  source={Images.car_top_2}
                  style={{
                    height: 40,
                    width: 40,
                    resizeMode: 'contain',
                    tintColor: Colors.primary
                  }}
                />
              </View>
            </MarkerAnimated>

            {/* Customer Marker - Person Icon */}
            {tripDetail?.tripStatus != CONSTANTS.ParkingInRoute && (
              <MarkerAnimated
                identifier={'Customer'}
                flat={false}
                coordinate={customerLiveLocation}
                ref={userLiveMarkerRef}>
                <View style={{
                  backgroundColor: "white",
                  borderColor: Colors.secondary || '#FF6B6B',
                  borderWidth: 2,
                  borderRadius: 25,
                  overflow: "hidden",
                  padding: 5,
                  ...commonStyle.shadow
                }}>
                  <Image
                    resizeMode="contain"
                    source={Images.customerIcon || Images.profileBlack}
                    style={{
                      height: 35,
                      width: 35,
                      resizeMode: 'contain',
                      tintColor: Colors.secondary || '#FF6B6B'
                    }}
                  />
                </View>
              </MarkerAnimated>
            )}
          </MapView>
          {floatingComponent()}
        </View>

        <View style={{ position: 'absolute', top: 0, left: 10, right: 10 }}>
          <SafeAreaView>
            <Header title={'Tracking'} />
          </SafeAreaView>
        </View>

        <BottomSheet coordinates={{ origin, destination }}>
          {VehicleDetail()}
          {UserandCall()}
          {PickupLocation()}
          {OTP()}
          {useButton()}
        </BottomSheet>
      </ScrollView>
      <SuccessModal
        visible={state.carParkedSuccessModal}
        text={state.text}
        onButtonClick={() => {
          _onParkedModalClick();
        }}
        buttonText=""
      />
    </KeyboardAvoidingView>
  );
};

export default TrackingFlow;

function buttonText(trip) {
  const isParked = trip?.parked;

  switch (trip?.tripStatus) {
    case CONSTANTS.Accepted:
      if (isParked) {
        return 'Return In Route';
      } else {
        return 'Pickup In Route';
      }
    case CONSTANTS.PickupInRoute:
      return 'Arrived';
    case CONSTANTS.PickupArrived:
      return 'Pickup';
    case CONSTANTS.ParkingInRoute:
      return 'Parked';
    case CONSTANTS.ReturnInRoute:
      return 'Return Arrived';
    case CONSTANTS.ReturnArrived:
      return 'Completed';
    default:
      return '';
  }
}