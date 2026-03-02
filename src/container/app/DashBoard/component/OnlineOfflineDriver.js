import {
  Image,
  Platform,
  PlatformColor,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { scale } from 'react-native-size-matters';
import { Button, HeaderHamburger } from '../../../../components';
import { Images } from '../../../../constants';
import { wp } from '../../../../utils/commonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { goOnlieOfflineRequest } from '../../../../module/App/actions';
import { useLoaderSelector } from '../../../../module/customSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CurrentBooking } from '../../mybooking/MyBooking';
import { CONSTANTS } from '../../../../config';


const status = [
  CONSTANTS.PickupInRoute,
  CONSTANTS.PickupArrived,
  CONSTANTS.ParkingInRoute,
  CONSTANTS.ReturnInRoute,
  CONSTANTS.ReturnArrived,
]


const OnlineOfflineDriver = ({ driverStatus }) => {

  const { bottom } = useSafeAreaInsets()
  const dispatch = useDispatch();
  const loadingState = useLoaderSelector();

  const { upcomingBooking } = useSelector(state => state.app);

  const currentBooking = upcomingBooking.filter(item => {
    if (status.some(i => i == item.tripStatus)) {
      return item
    }
  })

  const OnlineOfflineButton = () => {
  return (
    <Button
      loading={
        loadingState.loading &&
        loadingState.loadingRequest == goOnlieOfflineRequest
      }
      onPress={() => {
        const nextStatus = driverStatus === 'Offline' ? 'FindingTrips' : 'Offline';
        const data = {
          status: nextStatus,
        };
        dispatch(goOnlieOfflineRequest({ data }));
      }}
      title={driverStatus === 'Offline' ? 'Go Online' : 'Go Offline'}
    />
  );
};

  return (
    <>

      <View
        style={[
          styles.container,
          driverStatus == 'Offline' && {
            bottom: 0,
            backgroundColor: '#ffffffdd'
          },
        ]}>
        <HeaderHamburger title={'Driver'} />
        {driverStatus == 'Offline' && (
          <View style={styles.imageContainer}>
            <Image source={Images.offlineDriver} style={styles.offlineDriver} />
          </View>
        )}

        <CurrentBooking currentBooking={currentBooking} dispatch={dispatch} />

      </View>







      <View style={[styles.footer, { bottom: bottom == 0 ? 10 : bottom }]}>
        <OnlineOfflineButton />
      </View>
    </>
  );
};

export default OnlineOfflineDriver;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(10),
  },
  offlineDriver: {
    width: wp(50),
    height: wp(50),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center"
  },
});
