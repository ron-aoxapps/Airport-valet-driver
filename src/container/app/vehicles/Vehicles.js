import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Text, Container, Button} from '../../../components';
import {styles} from './styles';
import {Colors, Images} from '../../../constants';
import {commonStyle} from '../../../styles/styles';
import {navigationRef} from '../../../navigation/rootNavigation';
import {SCREEN_NAMES} from '../../../config';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteVehicleRequest,
  vehicleListRequest,
} from '../../../module/Vehicles/actions';
import {useEffect} from 'react';
import {confirmAlert} from '../../../utils/commonFunction';

const Vehicles = () => {
  const dispatch = useDispatch();

  const vehicles = useSelector(state => state.vehicle.vehicles);

  console.log('vehicles', vehicles);
  useEffect(() => {
    dispatch(vehicleListRequest());
  }, []);

  const removeCar = carId => {
    const data = {
      carId: carId,
    };
    confirmAlert(
      'Vehicle',
      'Are you sure you want to delete this vehicle',
      () => {
        dispatch(deleteVehicleRequest({data}));
      },
      'Yes',
    );
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          style={styles.carImge}
          source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}}
        />

        <View style={[commonStyle.row, {flex: 1}]}>
          <View style={styles.flex}>
            <Text medium semibold>
              {item.carName} {item.carModel}
            </Text>
            <Text small>{item.carColor}</Text>
            <Text small style={commonStyle.uppercaseText}>
              {item.plateNumber}
            </Text>
          </View>

          <View style={commonStyle.row}>
            {/* <View style={styles.outerView}>
              <View style={styles.innerView} />
            </View> */}

            <Pressable activeOpacity={0} onPress={() => removeCar(item._id)}>
              {({pressed}) => (
                <View
                  style={[
                    styles.deleteIcon,
                    pressed && {backgroundColor: Colors.primary + '50'},
                  ]}>
                  <Image style={commonStyle.smallImg} source={Images.delete} />
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>No Vehicles Added</Text>
      </View>
    );
  };

  return (
    <Container drawer title={'Manage Vehicles'}>
      <FlatList
        data={vehicles}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
      <Button
        onPress={() => {
          navigationRef.navigate(SCREEN_NAMES.AddVehicle);
        }}
        title={'Add New Vehicle'}
      />
    </Container>
  );
};

export default Vehicles;
