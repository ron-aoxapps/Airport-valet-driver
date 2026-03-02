import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, Container, Row, EmptyList, GradientWrap, VectorIcon } from '../../../components';
import { styles } from './styles';
import { commonStyle } from '../../../styles/styles';
import { Colors, Images } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  parkingHistoryRequest,
  tripDetailSuccess,
} from '../../../module/App/actions';
import Tabs from './component/Tabs';
import IconOcticons from 'react-native-vector-icons/Octicons';
import { CONSTANTS, SCREEN_NAMES } from '../../../config';
import { navigationRef } from '../../../navigation/rootNavigation';
import { useIsFocused } from '@react-navigation/native';
import { bookingStatus } from '../../../config/constants';
import moment from 'moment';

export const PENDING_BOOKINGS = 'PENDING';
export const COMPLETED_BOOKINGS = 'COMPLETED';

const PAGE_SIZE = 10;

const MyBooking = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(PENDING_BOOKINGS);
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    upcomingBooking, 
    pastBooking,
    upcomingBookingPagination,
    pastBookingPagination,
    upcomingBookingCurrentPage,
    pastBookingCurrentPage,
    isLoadingMore 
  } = useSelector(state => state.app);

  const isFocused = useIsFocused();
  const flatListRef = useRef(null);

  // Initial load and tab change
  useEffect(() => {
    fetchTrips(1, false);
  }, [selectedTab, isFocused]);

  const fetchTrips = useCallback((page = 1, isLoadMore = false) => {
    dispatch(parkingHistoryRequest({
      type: selectedTab,
      page: page,
      limit: PAGE_SIZE,
      isLoadMore: isLoadMore
    }));
  }, [selectedTab, dispatch]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTrips(1, false);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [fetchTrips]);

  // Handle load more
  const onLoadMore = useCallback(() => {
    const pagination = selectedTab === PENDING_BOOKINGS 
      ? upcomingBookingPagination 
      : pastBookingPagination;
    
    const currentPageNum = selectedTab === PENDING_BOOKINGS 
      ? upcomingBookingCurrentPage 
      : pastBookingCurrentPage;

    // Check if there are more pages to load
    const hasMorePages = pagination?.hasNextPage === true;
    if (hasMorePages && !isLoadingMore) {
      const nextPage = currentPageNum + 1;
      fetchTrips(nextPage, true);
    } else {
      console.log('⏹️ No more pages to load or already loading');
    }
  }, [selectedTab, upcomingBookingPagination, pastBookingPagination, 
      upcomingBookingCurrentPage, pastBookingCurrentPage, isLoadingMore, fetchTrips]);

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={localStyles.footerLoader}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={localStyles.footerText}>Loading more trips...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <EmptyList text={`No ${selectedTab.toLowerCase()} bookings found`} />
  );

  // Helper function to get vehicle info safely
  const getVehicleInfo = (item) => {
    if (item?.vehicleId) {
      return {
        name: item.vehicleId.carName || 'Vehicle',
        plate: item.vehicleId.plateNumber || 'N/A'
      };
    } else if (item?.bookingId?.vehicle) {
      return {
        name: `${item.bookingId.vehicle.make || ''} ${item.bookingId.vehicle.model || ''}`.trim() || 'Vehicle',
        plate: item.bookingId.vehicle.regno || 'N/A'
      };
    }
    return { name: 'Vehicle', plate: 'N/A' };
  };

  // Helper function to get service name safely
  const getServiceName = (item) => {
    if (item?.servieId?.name) return item.servieId.name;
    if (item?.parkingSpaceId?.name) return item.parkingSpaceId.name;
    return 'Parking Service';
  };

  // Helper function to get address safely
  const getAddress = (item) => {
    if (item?.pickup?.address) return item.pickup.address;
    if (item?.pickupLocation?.address) return item.pickupLocation.address;
    if (item?.parkingSpaceId?.locationId?.address) return item.parkingSpaceId.locationId.address;
    return 'Address not available';
  };

  // Helper function to get estimated cost safely
  const getEstimatedCost = (item) => {
    if (item?.estimatedCost) return item.estimatedCost;
    if (item?.bookingId?.pricing?.total) return item.bookingId.pricing.total;
    return 0;
  };

  // Helper function to get pickup date and time
  const getPickupInfo = (item) => {
    if (item?.bookingId?.from) {
      const date = moment(item.bookingId.from);
      return {
        date: date.format('DD MMM YYYY'),
        time: date.format('hh:mm A')
      };
    }
    return { date: 'N/A', time: 'N/A' };
  };

  // Helper function to get return date and time
  const getReturnInfo = (item) => {
    if (item?.bookingId?.to) {
      const date = moment(item.bookingId.to);
      return {
        date: date.format('DD MMM YYYY'),
        time: date.format('hh:mm A')
      };
    }
    return { date: 'N/A', time: 'N/A' };
  };

  const renderItem = ({ item, index }) => {
    const vehicleInfo = getVehicleInfo(item);
    const serviceName = getServiceName(item);
    const address = getAddress(item);
    const cost = getEstimatedCost(item);
    const pickupInfo = getPickupInfo(item);
    const returnInfo = getReturnInfo(item);

    return (
      <TouchableOpacity
        onPress={() => _onTripClick(item, dispatch)}
        style={styles.itemContainer}>
        <View style={[commonStyle.row]}>
          <Image
            style={[commonStyle.smallImg, { tintColor: Colors.textColor }]}
            source={Images.vehicle}
          />
          <Text semibold style={{ paddingLeft: 10 }}>
            {vehicleInfo.name} |{' '}
            <Text
              semibold
              style={{ paddingLeft: 10, ...commonStyle.uppercaseText }}>
              {vehicleInfo.plate}
            </Text>
          </Text>
        </View>
        <View style={commonStyle.sepratorStyle} />
        <Text semibold medium style={{ marginVertical: 5 }}>
          {serviceName}
        </Text>

        <View style={styles.route}>
          <IconOcticons
            name="dot-fill"
            size={20}
            color="green"
            style={{ marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <Text semibold>{address}</Text>
          </View>
        </View>

        <View style={commonStyle.sepratorStyle} />
        <View style={commonStyle.row}>
          <VectorIcon
            type='AntDesign'
            name='clockcircle'
            size={22}
            color={Colors.textColor}
          />
          <View style={styles.cardDetail}>
            {item.parked ? (
              <Text semibold medium>
                Return : {returnInfo.date} {returnInfo.time}
              </Text>
            ) : (
              <Text semibold medium>
                Pickup : {pickupInfo.date} {pickupInfo.time}
              </Text> 
            )}
          </View>
        </View>
        <View style={commonStyle.sepratorStyle} />
        <Row>
          <Text bold large>
            $ {Number(cost).toFixed(2)}
          </Text>
          <Text semibold medium textColor={Colors.primary}>
            {bookingStatus(item.tripStatus)}
          </Text>
        </Row>
      </TouchableOpacity>
    );
  };

  const currentData = selectedTab === COMPLETED_BOOKINGS ? pastBooking : upcomingBooking;

  return (
    <Container drawer title={'My Booking'}>
      <Tabs
        tabs={[PENDING_BOOKINGS, COMPLETED_BOOKINGS]}
        selectedTab={selectedTab}
        onChange={tab => setSelectedTab(tab)}
      />

      <FlatList
        ref={flatListRef}
        data={currentData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={localStyles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </Container>
  );
};

export const CurrentBooking = ({ currentBooking = [], dispatch }) => {
  if (currentBooking.length > 0) {
    const item = currentBooking[0];

    const getVehicleInfo = (item) => {
      if (item?.vehicleId) {
        return {
          name: item.vehicleId.carName || 'Vehicle',
          plate: item.vehicleId.plateNumber || 'N/A'
        };
      } else if (item?.bookingId?.vehicle) {
        return {
          name: `${item.bookingId.vehicle.make || ''} ${item.bookingId.vehicle.model || ''}`.trim() || 'Vehicle',
          plate: item.bookingId.vehicle.regno || 'N/A'
        };
      }
      return { name: 'Vehicle', plate: 'N/A' };
    };

    const getServiceName = (item) => {
      if (item?.servieId?.name) return item.servieId.name;
      if (item?.parkingSpaceId?.name) return item.parkingSpaceId.name;
      return 'Parking Service';
    };

    const getAddress = (item) => {
      if (item?.pickup?.address) return item.pickup.address;
      if (item?.pickupLocation?.address) return item.pickupLocation.address;
      if (item?.parkingSpaceId?.locationId?.address) return item.parkingSpaceId.locationId.address;
      return 'Address not available';
    };

    const getEstimatedCost = (item) => {
      if (item?.estimatedCost) return item.estimatedCost;
      if (item?.bookingId?.pricing?.total) return item.bookingId.pricing.total;
      return 0;
    };

    const getPickupInfo = (item) => {
      if (item?.bookingId?.from) {
        const date = moment(item.bookingId.from);
        return {
          date: date.format('DD MMM YYYY'),
          time: date.format('hh:mm A')
        };
      }
      return { date: 'N/A', time: 'N/A' };
    };

    const getReturnInfo = (item) => {
      if (item?.bookingId?.to) {
        const date = moment(item.bookingId.to);
        return {
          date: date.format('DD MMM YYYY'),
          time: date.format('hh:mm A')
        };
      }
      return { date: 'N/A', time: 'N/A' };
    };

    const vehicleInfo = getVehicleInfo(item);
    const serviceName = getServiceName(item);
    const address = getAddress(item);
    const cost = getEstimatedCost(item);
    const pickupInfo = getPickupInfo(item);
    const returnInfo = getReturnInfo(item);

    return (
      <View>
        <TouchableOpacity
          onPress={() => _onTripClick(item, dispatch)}
          style={[styles.itemContainer, { padding: 0, overflow: "hidden" }]}>
          <GradientWrap style={{ padding: 10 }}>
            <Text style={{ alignSelf: "center" }} textColor={'white'} bold medium>
              CURRENT BOOKING
            </Text>
          </GradientWrap>

          <View style={{ padding: 10 }}>
            <View style={[commonStyle.row]}>
              <Image
                style={[commonStyle.smallImg, { tintColor: Colors.textColor }]}
                source={Images.vehicle}
              />
              <Text semibold style={{ paddingLeft: 10 }}>
                {vehicleInfo.name} |{' '}
                <Text semibold style={{ paddingLeft: 10, ...commonStyle.uppercaseText }}>
                  {vehicleInfo.plate}
                </Text>
              </Text>
            </View>
            <View style={commonStyle.sepratorStyle} />
            <Text semibold medium style={{ marginVertical: 5 }}>
              {serviceName}
            </Text>

            <View style={styles.route}>
              <IconOcticons
                name="dot-fill"
                size={20}
                color="green"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text semibold>{address}</Text>
              </View>
            </View>

            <View style={commonStyle.sepratorStyle} />
            <View style={commonStyle.row}>
              <VectorIcon
                type='AntDesign'
                name='clockcircle'
                size={22}
                color={Colors.textColor}
              />
              <View style={styles.cardDetail}>
                {item.parked ? (
                  <Text semibold medium>
                    Return : {returnInfo.date} {returnInfo.time}
                  </Text>
                ) : (
                  <Text semibold medium>
                    Pickup : {pickupInfo.date} {pickupInfo.time}
                  </Text> 
                )}
              </View>
            </View>
            <View style={commonStyle.sepratorStyle} />
            <Row>
              <Text bold large>
                $ {Number(cost).toFixed(2)}
              </Text>
              <Text semibold medium textColor={Colors.primary}>
                {bookingStatus(item.tripStatus)}
              </Text>
            </Row>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
};

const _onTripClick = (trip, dispatch) => {
  const tripStatus = trip.tripStatus;
  console.log('Trip clicked:', trip._id, 'Status:', tripStatus);
  let payload = {
    detail: trip,
    requestVisible: tripStatus == CONSTANTS.FindingDrivers ? true : false,
  };
  dispatch(tripDetailSuccess(payload));

  if (
    tripStatus == CONSTANTS.Accepted ||
    tripStatus == CONSTANTS.PickupInRoute ||
    tripStatus == CONSTANTS.PickupArrived ||
    tripStatus == CONSTANTS.ParkingInRoute ||
    tripStatus == CONSTANTS.ReturnInRoute ||
    tripStatus == CONSTANTS.ReturnArrived
  ) {
    navigationRef.navigate(SCREEN_NAMES.TrackingFlow, { tripId: trip._id });
  } else if (tripStatus == CONSTANTS.FindingDrivers) {
    navigationRef.navigate(SCREEN_NAMES.DashBoard);
  }
};

const localStyles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 10,
    color: Colors.textColor,
    fontSize: 14,
  },
});

export default MyBooking;