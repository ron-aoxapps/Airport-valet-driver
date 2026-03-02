import { Image, Modal, SafeAreaView, StyleSheet, View, TouchableOpacity, Animated, Dimensions, LayoutAnimation, UIManager, Platform, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MapView from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { Header, Text } from '../../../../components';
import { scale } from 'react-native-size-matters';
import { commonStyle } from '../../../../styles/styles';
import { Colors, Images } from '../../../../constants';
import IconOcticons from 'react-native-vector-icons/Octicons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import {
  acceptRequest,
  rejectRequest,
  closeRequestModalAction,
} from '../../../../module/App/actions';
import { useLoaderSelector } from '../../../../module/customSelector';
import { useMyLocationHook } from '../../../../module/Common/reducer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const RequestView = () => {
  const { location } = useMyLocationHook();
  const { loading, loadingRequest } = useLoaderSelector();
  const appStore = useSelector(state => state.app);
  const dispatch = useDispatch();
  const { requestVisible, pendingRequests = [], tripDetail } = appStore;

  const [expandedId, setExpandedId] = useState(null);
  const [newRequestIds, setNewRequestIds] = useState([]);
  const flatListRef = useRef(null);
  const slideAnims = useRef({}).current;

  console.log('🔍 RequestView - requestVisible:', requestVisible);
  console.log('🔍 RequestView - pendingRequests count:', pendingRequests.length);
  console.log('🔍 RequestView - pending IDs:', pendingRequests.map(r => r._id));
  console.log('🔍 RequestView - current tripDetail:', tripDetail?._id);

  // Monitor pending requests changes
  useEffect(() => {
    console.log('📋 Pending requests updated:', pendingRequests.length);
    console.log('📋 Current IDs:', pendingRequests.map(r => r._id));
    
    if (pendingRequests.length === 0) {
      console.log('🚫 No pending requests left');
    }
  }, [pendingRequests]);

  // Monitor tripDetail changes
  useEffect(() => {
    console.log('🎯 Current tripDetail:', tripDetail?._id);
  }, [tripDetail]);

  // Initialize animations for new requests
  useEffect(() => {
    if (requestVisible && pendingRequests.length > 0) {
      const newIds = pendingRequests
        .filter(req => !slideAnims[req._id])
        .map(req => req._id);
      
      if (newIds.length > 0) {
        newIds.forEach(id => {
          if (!slideAnims[id]) {
            slideAnims[id] = new Animated.Value(SCREEN_WIDTH);
          }
        });
        
        setNewRequestIds(newIds);
        
        newIds.forEach(id => {
          Animated.spring(slideAnims[id], {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }).start(() => {
            setNewRequestIds(prev => prev.filter(reqId => reqId !== id));
          });
        });
      }
    }
  }, [requestVisible, pendingRequests]);

  const _onAccept = (tripId) => {
    console.log('🟢 Accept button pressed for trip:', tripId);
    if (!tripId) return;
    dispatch(acceptRequest(tripId));
  };

  const _onReject = (tripId) => {
    console.log('🔴 Reject button pressed for trip:', tripId);
    if (!tripId) return;
    dispatch(rejectRequest(tripId));
  };

  const toggleExpand = (tripId) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setExpandedId(expandedId === tripId ? null : tripId);
  };

  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    return address.length > 60 ? address.substring(0, 57) + '...' : address;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const renderRequestCard = ({ item: tripDetail, index }) => {
    const isNew = newRequestIds.includes(tripDetail._id);
    const isExpanded = expandedId === tripDetail._id;
    
    const cardAnimation = slideAnims[tripDetail._id] || new Animated.Value(0);

    const cardContent = (
      <View style={styles.floatingCard}>
        {/* Card Header - Always Visible */}
        <TouchableOpacity 
          style={styles.cardHeader}
          onPress={() => toggleExpand(tripDetail._id)}
          activeOpacity={0.7}
        >
          <View style={styles.headerLeft}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarSmallText}>
                {tripDetail?.customerId?.name?.charAt(0).toUpperCase() || 'C'}
              </Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.customerName} numberOfLines={1}>
                {tripDetail?.customerId?.name || 'Customer'}
              </Text>
              <View style={styles.ratingRow}>
                <Image source={Images.ActiveStar} style={styles.smallStarIcon} />
                <Text style={styles.ratingSmall}>
                  {tripDetail?.customerId?.rating || '0.0'}
                </Text>
                {tripDetail?.createdAt && (
                  <>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.timeText}>{formatTime(tripDetail.createdAt)}</Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.priceHeader} numberOfLines={1}>
              ${tripDetail?.bookingId?.pricing?.total || '0'}
            </Text>
            <Image 
              source={isExpanded ? Images.chevronUp : Images.chevronDown} 
              style={styles.chevronIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Expanded Content - Only shown when expanded */}
        {isExpanded && (
          <>
            <View style={styles.basicInfoContainer}>
              <View style={styles.basicInfoRow}>
                <Image source={Images.callIcon} style={styles.smallIcon} />
                <Text style={styles.basicInfoText}>{tripDetail?.customerId?.phoneNumber || 'N/A'}</Text>
              </View>
              <View style={styles.basicInfoRow}>
                <Image source={Images.vehicle} style={styles.smallIcon} />
                <Text style={styles.basicInfoText} numberOfLines={1}>
                  {tripDetail?.bookingId?.vehicle?.make || 'Vehicle'} | {tripDetail?.bookingId?.vehicle?.model || 'Vehicle'}
                  {tripDetail?.bookingId?.vehicle?.regno ? ` | ${tripDetail.bookingId.vehicle.regno}` : ''}
                </Text>
              </View>
            </View>

            <View style={styles.pickupPreview}>
              <IconOcticons name="dot-fill" size={16} color="#4CAF50" />
              <Text style={styles.previewText} numberOfLines={1}>
                {formatAddress(tripDetail?.parkingSpaceId?.locationId?.address)}
              </Text>
            </View>

            <View style={styles.expandedContent}>
              <View style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Service</Text>
                <Text style={styles.serviceText}>
                  {tripDetail?.parkingSpaceId?.name || 'Parking Service'}
                </Text>
              </View>

              {tripDetail?.extraServiceArr && tripDetail.extraServiceArr.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Extra Services</Text>
                  {tripDetail.extraServiceArr.map((item, idx) => (
                    <Text key={idx} style={styles.extraServiceText}>
                      • {item.name || item.serviceName || item}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pickup Location</Text>
                <View style={styles.locationRow}>
                  <IconOcticons name="dot-fill" size={20} color="#4CAF50" style={styles.locationDot} />
                  <Text style={styles.locationText}>
                    {tripDetail?.parkingSpaceId?.locationId?.address || 'Address not available'}
                  </Text>
                </View>
              </View>

              {tripDetail?.notes && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  <Text style={styles.notesText}>{tripDetail.notes}</Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.cardButtonContainer}>
                <TouchableOpacity
                  style={[styles.cardButton, styles.rejectCardButton]}
                  onPress={() => _onReject(tripDetail._id)}
                  disabled={loading && loadingRequest === rejectRequest}
                >
                  {loading && loadingRequest === rejectRequest ? (
                    <ActivityIndicator size="small" color={Colors.textColor} />
                  ) : (
                    <Text style={styles.rejectCardButtonText}>Reject</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cardButton, styles.acceptCardButton]}
                  onPress={() => _onAccept(tripDetail._id)}
                  disabled={loading && loadingRequest === acceptRequest}
                >
                  {loading && loadingRequest === acceptRequest ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.acceptCardButtonText}>Accept</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    );

    if (isNew) {
      return (
        <Animated.View 
          style={[
            styles.cardWrapper,
            {
              transform: [{ translateX: cardAnimation }],
              marginBottom: scale(12),
            }
          ]}
        >
          {cardContent}
        </Animated.View>
      );
    }

    return (
      <View style={[styles.cardWrapper, { marginBottom: scale(12) }]}>
        {cardContent}
      </View>
    );
  };

  const ListHeaderComponent = () => (
    <View style={styles.listHeader}>
      <Text style={styles.headerTitle}>
        {pendingRequests.length} Pending Request{pendingRequests.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No pending requests</Text>
    </View>
  );

  if (!requestVisible) {
    return null;
  }

  return (
    <Modal visible={requestVisible} transparent animationType="fade">
      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: location?.latitude || 37.78825,
            longitude: location?.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />

        <SafeAreaView style={styles.container}>
          <Header
            title="Trip Requests"
            back={false}
            rightComponent={
              <TouchableOpacity 
                onPress={() => dispatch(closeRequestModalAction())}
                style={styles.closeButton}
              >
                <IconMaterial name="close" size={24} color="#000" />
              </TouchableOpacity>
            }
          />
          
          <FlatList
            ref={flatListRef}
            data={pendingRequests}
            renderItem={renderRequestCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={ListEmptyComponent}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default RequestView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(10),
  },
  listContent: {
    paddingBottom: scale(20),
  },
  listHeader: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  cardWrapper: {
    width: '100%',
  },
  floatingCard: {
    backgroundColor: 'white',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...commonStyle.shadow,
    elevation: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(16),
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarSmall: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  avatarSmallText: {
    color: '#fff',
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#000',
    marginBottom: scale(4),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallStarIcon: {
    width: scale(14),
    height: scale(14),
    marginRight: scale(4),
  },
  ratingSmall: {
    fontSize: scale(13),
    color: '#666',
    fontWeight: '500',
  },
  dotSeparator: {
    fontSize: scale(13),
    color: '#666',
    marginHorizontal: scale(4),
  },
  timeText: {
    fontSize: scale(12),
    color: '#999',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceHeader: {
    fontSize: scale(18),
    fontWeight: '700',
    color: Colors.primary,
    marginRight: scale(8),
  },
  chevronIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#666',
  },
  basicInfoContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  basicInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  smallIcon: {
    width: scale(16),
    height: scale(16),
    tintColor: '#666',
    marginRight: scale(8),
  },
  basicInfoText: {
    fontSize: scale(14),
    color: '#333',
    flex: 1,
  },
  pickupPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingBottom: scale(12),
    backgroundColor: '#FAFAFA',
  },
  previewText: {
    fontSize: scale(13),
    color: '#666',
    marginLeft: scale(8),
    flex: 1,
  },
  expandedContent: {
    padding: scale(16),
    backgroundColor: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: scale(12),
  },
  section: {
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#999',
    marginBottom: scale(6),
    textTransform: 'uppercase',
  },
  serviceText: {
    fontSize: scale(15),
    color: '#333',
    fontWeight: '500',
  },
  extraServiceText: {
    fontSize: scale(14),
    color: '#666',
    marginBottom: scale(4),
    marginLeft: scale(4),
  },
  notesText: {
    fontSize: scale(14),
    color: '#666',
    fontStyle: 'italic',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDot: {
    marginRight: scale(10),
    marginTop: scale(2),
  },
  locationText: {
    flex: 1,
    fontSize: scale(14),
    color: '#333',
    lineHeight: scale(20),
  },
  cardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
    marginTop: scale(8),
  },
  cardButton: {
    flex: 1,
    paddingVertical: scale(14),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  acceptCardButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rejectCardButton: {
    backgroundColor: 'transparent',
    borderColor: '#CCCCCC',
  },
  acceptCardButtonText: {
    color: '#fff',
    fontSize: scale(15),
    fontWeight: '700',
  },
  rejectCardButtonText: {
    color: '#666',
    fontSize: scale(15),
    fontWeight: '600',
  },
  closeButton: {
    padding: scale(4),
  },
  emptyContainer: {
    padding: scale(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: scale(16),
    color: '#666',
    textAlign: 'center',
  },
});