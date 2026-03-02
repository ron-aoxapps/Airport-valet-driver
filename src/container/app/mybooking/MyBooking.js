import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
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

    if (pagination?.hasNextPage && !isLoadingMore) {
      const nextPage = currentPageNum + 1;
      fetchTrips(nextPage, true);
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

  const renderItem = ({ item }) => {
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
            {item?.vehicleId?.carName || item?.bookingId?.vehicle?.make || 'Vehicle'} |{' '}
            <Text
              semibold
              style={{ paddingLeft: 10, ...commonStyle.uppercaseText }}>
              {item?.vehicleId?.plateNumber || item?.bookingId?.vehicle?.regno || 'N/A'}
            </Text>
          </Text>
        </View>
        <View style={commonStyle.sepratorStyle} />
        <Text semibold medium style={{ marginVertical: 5 }}>
          {item?.servieId?.name || item?.parkingSpaceId?.name || 'Parking Service'}
        </Text>

        <View style={styles.route}>
          <IconOcticons
            name="dot-fill"
            size={20}
            color="green"
            style={{ marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <Text semibold>
              {item?.pickupLocation?.address || 
               item?.parkingSpaceId?.locationId?.address || 
               'Address not available'}
            </Text>
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
                Return : {moment(item.returnDate, 'DD-MM-YYYY').format("DD MMM YYYY")} {item.returnTime}
              </Text>
            ) : (
              <Text semibold medium>
                Pickup : {moment(item.pickupDate, 'DD-MM-YYYY').format("DD MMM YYYY")} {item.pickupTime}
              </Text> 
            )}
          </View>
        </View>
        <View style={commonStyle.sepratorStyle} />
        <Row>
          <Text bold large>
            $ {Number(item.estimatedCost || item?.bookingId?.pricing?.total || 0).toFixed(2)}
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
        data={currentData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={localStyles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export const CurrentBooking = ({ currentBooking = [], dispatch }) => {
  if (currentBooking.length > 0) {
    const item = currentBooking[0];

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
                {item?.vehicleId?.carName || item?.bookingId?.vehicle?.make || 'Vehicle'} |{' '}
                <Text semibold style={{ paddingLeft: 10, ...commonStyle.uppercaseText }}>
                  {item?.vehicleId?.plateNumber || item?.bookingId?.vehicle?.regno || 'N/A'}
                </Text>
              </Text>
            </View>
            <View style={commonStyle.sepratorStyle} />
            <Text semibold medium style={{ marginVertical: 5 }}>
              {item?.servieId?.name || item?.parkingSpaceId?.name || 'Parking Service'}
            </Text>

            <View style={styles.route}>
              <IconOcticons
                name="dot-fill"
                size={20}
                color="green"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text semibold>
                  {item?.pickupLocation?.address || 
                   item?.parkingSpaceId?.locationId?.address || 
                   'Address not available'}
                </Text>
              </View>
            </View>

            <View style={commonStyle.sepratorStyle} />
            <Row>
              <Text bold large>
                $ {Number(item.estimatedCost || item?.bookingId?.pricing?.total || 0).toFixed(2)}
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