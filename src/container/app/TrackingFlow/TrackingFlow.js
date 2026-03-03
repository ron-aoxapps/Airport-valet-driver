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
  Alert,
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
  carParkedRequest,
  returnAcceptRequest,
  returnArrivedRequest,
  completeTripRequest, // Make sure to import this
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
  console.log('full profile', profile); 

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
    isOtpFilled: false,
  });

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
  
  const _onButtonPress = () => {
    console.log('Button pressed with trip status:', tripDetail?.tripStatus);
    
    if (tripDetail?.tripStatus === CONSTANTS.Accepted && profile?.driverStatus === 'FindingTrips') {
      dispatch(pickupInRouteRequest({
        tripId: tripDetail?._id,
        data: { tripId: tripDetail?._id },
        callback: (response) => { 
          console.log('✅ Pickup In Route completed:', response);
        }
      }));
    } 
    else if (tripDetail?.tripStatus === CONSTANTS.PickupInRoute) {
      dispatch(arrivedAtCustomerLocationRequest({
        tripId: tripDetail?._id,
        data: { tripId: tripDetail?._id },
        callback: (response) => {
          console.log('✅ Arrived At Customer Location completed:', response);
        }
      }));
    }
    else if (tripDetail?.tripStatus === CONSTANTS.ParkingInRoute) {
      dispatch(carParkedRequest({ 
        tripId: tripDetail?._id,
        data: { tripId: tripDetail?._id },
        callback: (response) => {
          console.log('✅ Car Parked completed:', response);
          navigationRef.navigate('MyBooking');
        }
      }));
    }
    else if(tripDetail?.tripStatus === CONSTANTS.ReturnInRoute) {
      dispatch(returnArrivedRequest({
        tripId: tripDetail?._id,
        data: { tripId: tripDetail?._id },
        callback: (response) => {
          console.log('✅ Return Arrived completed:', response);
        }
      }));
    }
    else if(tripDetail?.tripStatus === CONSTANTS.ReturnArrived) {
      // Check if OTP is filled
      if (!state.code || state.code.length < 4) {
        Alert.alert('OTP Required', 'Please enter the 4-digit OTP to complete the trip.');
        return;
      }
      
      console.log('📤 Sending OTP:', state.code, 'for trip completion');
      
      dispatch(completeTripRequest({
        tripId: tripDetail?._id,
        otp: state.code, // Send OTP in the request body
        data: { 
          tripId: tripDetail?._id,
          otp: state.code 
        },
        callback: (response) => {
          console.log('✅ Complete Trip completed:', response);
          Alert.alert('Success', 'Trip completed successfully!');
          navigationRef.navigate('MyBooking');
        },
        onError: (error) => {
          console.log('❌ Complete Trip failed:', error);
          Alert.alert('Error', error || 'Failed to complete trip');
        }
      }));
    }
  };
  
  const _onParkedModalClick = () => {
    setState(prev => ({ ...prev, carParkedSuccessModal: false }));
    navigationRef.goBack();
    dispatch(profileRequest());
  };

  // Handle OTP change
  const handleOtpChange = (code) => {
    setState(prev => ({ 
      ...prev, 
      code,
      isOtpFilled: code.length === 4
    }));
  };

  const useButton = () => {
    // Determine if button should be disabled
    const isOtpRequired = tripDetail?.tripStatus === CONSTANTS.ReturnArrived;
    const isOtpValid = state.code && state.code.length === 4;
    const isDisabled = isOtpRequired ? !isOtpValid : false;
    
    return (
      <View style={{ marginTop: 10 }}>
        <Button
          loading={loading && (
            loadingRequest === pickupInRouteRequest ||
            loadingRequest === arrivedAtCustomerLocationRequest ||
            loadingRequest === carParkedRequest ||
            loadingRequest === returnAcceptRequest ||
            loadingRequest === returnArrivedRequest ||
            loadingRequest === completeTripRequest ||
            loadingRequest === tripStatusChangeAction
          )}
          disabled={isDisabled}
          style={[
            isDisabled && { backgroundColor: Colors.gray, opacity: 0.7 },
          ]}
          title={buttonText(tripDetail, state.isOtpFilled)}
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
      tripDetail?.tripStatus === CONSTANTS.ReturnArrived && 
      !tripDetail?.verifiy
    )
      return (
        <View>
          <View style={commonStyle.sepratorStyle} />
          <View style={{ marginVertical: 10 }}>
            <Text style={{ textAlign: 'center', marginBottom: 5 }}>
              Enter OTP to complete the trip
            </Text>
          </View>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <OTPInputView
              pinCount={4}
              style={{ width: '60%', height: 60 }}
              code={state.code}
              onCodeChanged={handleOtpChange}
              autoFocusOnLoad={true}
              placeholderCharacter="0"
              placeholderTextColor={Colors.placeholderTextColor}
              codeInputFieldStyle={[
                styles.underlineStyleBase,
                state.code.length === 4 && { borderColor: Colors.success || 'green' }
              ]}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={code => {
                console.log(`Code is ${code}, you are good to go!`);
              }}
            />
            
            {/* Show OTP status indicator */}
            {state.code.length === 4 ? (
              <View style={{ 
                backgroundColor: Colors.success || 'green', 
                paddingHorizontal: 10, 
                paddingVertical: 5, 
                borderRadius: 15 
              }}>
                <Text style={{ color: 'white', fontSize: 12 }}>OTP Ready ✓</Text>
              </View>
            ) : (
              <View style={{ 
                backgroundColor: Colors.gray, 
                paddingHorizontal: 10, 
                paddingVertical: 5, 
                borderRadius: 15 
              }}>
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {4 - (state.code?.length || 0)} digits left
                </Text>
              </View>
            )}
          </Row>
        </View>
      );

    else return null;
  };

  const origin = {
    ...location,
  };
  
  const destination = {
    longitude: tripDetail?.pickup?.location?.coordinates?.[0] || 0,
    latitude: tripDetail?.pickup?.location?.coordinates?.[1] || 0,
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
              latitude: tripDetail?.driverRefId?.driverLocation?.coordinates?.[1] || origin.latitude,
              longitude: tripDetail?.driverRefId?.driverLocation?.coordinates?.[0] || origin.longitude,
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

function buttonText(trip, isOtpFilled = false) {
  if (!trip) return '';
  
  const isParked = trip?.parked;

  switch (trip?.tripStatus) {
    case CONSTANTS.Accepted:
      if (isParked) {
        return 'Accept Return';
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
      return isOtpFilled ? 'Complete Trip ✓' : 'Complete Trip';
    default:
      return '';
  }
}