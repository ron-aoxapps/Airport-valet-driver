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
  Container,
  Header,
  Row,
  Text,
  TextInput,
  VectorIcon,
} from '../../../components';
import { Colors, Images } from '../../../constants';

import CallIcon from './component/CallIcon';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './styles';
import {
  tripStatusChangeAction,
  verifyTripOTPRequest,
} from '../../../module/App/actions';
import { CONSTANTS } from '../../../config';
import { useLoaderSelector, useProfileSelector } from '../../../module/customSelector';
import { commonStyle } from '../../../styles/styles';
import { useIsFocused } from '@react-navigation/native';
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
  const isFocused = useIsFocused();
  const profile = useProfileSelector();

  const { loading, loadingRequest } = useLoaderSelector();
  const { tripDetail } = useSelector(state => state.app);
  console.log('tripDetail', tripDetail)
  const { location } = useMyLocationHook();

  const [userLiveLocation, setUserLocation] = useState(
    new AnimatedRegion({
      latitude: tripDetail?.customerRefId?.userLocation?.coordinates[1],
      longitude: tripDetail?.customerRefId?.userLocation?.coordinates[0],
    })
  )

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
      if (tripDetail.tripStatus == CONSTANTS.Parked) {
        setState(prev => ({
          ...prev,
          carParkedSuccessModal: true,
          text: 'Vehicle Parked Successfully.',
        }));
      } else if (tripDetail.tripStatus == CONSTANTS.Completed) {
        setState(prev => ({
          ...prev,
          carParkedSuccessModal: true,
          text: 'Vehicle Returned Successfully.',
        }));
      }
    }
  }, [tripDetail]);

  // useEffect(() => {
  //   const watchId = Geolocation.watchPosition(position => {
  //     let angle = position.coords.heading;
  //     setMyLocation({
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //       angle: angle,
  //       error: null,
  //     });
  //     console.log('position', position);




  //   });

  //   return () => {
  //     Geolocation?.clearWatch(watchId);
  //     Geolocation?.stopObserving();
  //   };
  // }, []);


  useEffect(() => {
    _getCurrentLocation();
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00921,
    };
    // mapviewref?.current?.animateToRegion(region);
    mapviewref.current.animateCamera({
      center: region,
      pitch: 60,
      heading: 0,
  })


    socketServices?.on('customer_location_change', (res) => {
      console.log('+++customer_location_change+++', res)
      const region = {
        latitude: res?.userLocation?.coordinates[1],
        longitude: res?.userLocation?.coordinates[0],
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00921,
      }

      const newCoordinate = {
        latitude: region.latitude,
        longitude: region.longitude
      };

      if (Platform.OS == 'android') {
        if (userLiveMarkerRef?.current) {
          userLiveMarkerRef?.current?.animateMarkerToCoordinate(region, 5000)
        }
      } else {
        userLiveLocation.timing(newCoordinate).start()
      }

      // if (liveLocationRef.current)
      // mapviewref?.current?.animateToRegion(region);



    })

    return () => {
      socketServices.removeListener('customer_location_change')
    }

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
      tripId: tripDetail._id,
      tripStatus: tripDetail.tripStatus,
      parked: tripDetail.parked,
    };
    dispatch(tripStatusChangeAction({ data }));
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
          loading={loading && loadingRequest == tripStatusChangeAction}
          disabled={
            (tripDetail.tripStatus == CONSTANTS.PickupArrived && !tripDetail.verifiy) ||
            (tripDetail.tripStatus == CONSTANTS.ReturnArrived && !tripDetail.verifiy)
          }
          style={[
            (tripDetail.tripStatus == CONSTANTS.PickupArrived ||
              tripDetail.tripStatus == CONSTANTS.ReturnArrived) &&
            !tripDetail.verifiy && { backgroundColor: Colors.gray },
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
            {tripDetail?.name}
          </Text>
        </Row>
        <CallIcon mobileNumber={tripDetail?.mobileNumber} />
      </Row>
    );
  };

  const VehicleDetail = () => {


    return (
      <>
        <Row style={styles.pickupLocation}>
          <Image style={styles.smallImg} source={Images.vehicle} />
          <Text bold>
            {` `} {tripDetail?.make} |{' '}
            <Text bold style={commonStyle.uppercaseText}>
              {tripDetail?.plateNumber}
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
              {tripDetail?.pickupLocation?.address}

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
            {tripDetail.parked ?
              <Text semibold medium>Return : {moment(tripDetail.returnDate, 'DD-MM-YYYY').format("DD-MM-YYYY")} {tripDetail?.returnTime}</Text>
              :
              <Text semibold medium>Pickup : {moment(tripDetail.pickupDate, 'DD-MM-YYYY').format("DD-MM-YYYY")} {tripDetail?.pickupTime}</Text>
            }
          </View>
        </View>



      </>
    );
  };

  const OTP = () => {
    if (
      (tripDetail.tripStatus == CONSTANTS.ReturnArrived ||
        tripDetail.tripStatus == CONSTANTS.PickupArrived) &&
      !tripDetail.verifiy
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
    // longitude: 76.7860317,
    // latitude: 30.6679559,
  };
  const destination = {
    longitude: tripDetail?.pickupLocation?.location.coordinates[0],
    latitude: tripDetail?.pickupLocation?.location.coordinates[1],
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
              sourceLatitude: destination.latitude, // optionally specify starting location for directions
              sourceLongitude: destination.longitude, // not optional if sourceLatitude is specified

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
            // latitude: orderDetail?.driverRefId?.driverLocation?.coordinates[1],
            // longitude: orderDetail?.driverRefId?.driverLocation?.coordinates[0],

            const region = {
              latitude: tripDetail?.driverRefId?.driverLocation?.coordinates[1],
              longitude: tripDetail?.driverRefId?.driverLocation?.coordinates[0],
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00921,
            };

            // mapviewref?.current?.animateToRegion(region);
            mapviewref.current.animateCamera({
              center: region,
              pitch: 60,
              heading: 0,
          })

            // liveLocationRef.current = true


            // driverLiveLocation
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

              type={tripDetail.parked ? 'return' : 'pickup'}
              driverOnly={
                tripDetail.tripStatus == CONSTANTS.PickupArrived ||
                tripDetail.tripStatus == CONSTANTS.ReturnArrived ||
                tripDetail.tripStatus == CONSTANTS.ParkingInRoute
              }
              sourceIcon={(tripDetail.tripStatus == CONSTANTS.Accepted || tripDetail.tripStatus == CONSTANTS.ParkingInRoute || tripDetail.parked) ? Images.car_top_2 : Images.captain }
              sourceIconStyle={(tripDetail.tripStatus == CONSTANTS.Accepted || tripDetail.tripStatus == CONSTANTS.ParkingInRoute || tripDetail.parked) ? {} : {
                backgroundColor:"white",
                borderColor:Colors.primary+10,
                borderWidth:1,borderRadius:5
                ,overflow:"hidden"
              } }
              destinationIcon={(tripDetail.parked) ? Images.locationpin : Images.car_top_2 }


              origin={origin}
              destination={destination}

              // origin={tripDetail.parked ? origin : destination}
              // destination={tripDetail.parked ? destination : origin}
              // originIcon = {tripDetail.parked ? }

              onReady={result => {
                console.log('soure', result);

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


{tripDetail.tripStatus == CONSTANTS.ParkingInRoute  ? null : 
            <MarkerAnimated
              // rotation={rotation}
              identifier={'Source'}
              flat={false}
              coordinate={userLiveLocation}
              ref={userLiveMarkerRef}>
              <View style={{
                backgroundColor:"white",
                borderColor:Colors.primary+10,
                borderWidth:1,
                borderRadius:5,
                overflow:"hidden"}}>
                <Image
                  resizeMode="contain"
                  source={Images.customerIcon}
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </MarkerAnimated>}



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
  const isParked = trip.parked;

  switch (trip.tripStatus) {
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
      break;
  }
}
