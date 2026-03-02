import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {Text, Container, Row} from '../../../components';
import {Colors} from '../../../constants';
import {commonStyle} from '../../../styles/styles';
import {scale} from 'react-native-size-matters';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  promocodeListRequest,
} from '../../../module/App/actions';

const Coupons = () => {
  const dispath = useDispatch();
  const services = useSelector(state => state.app.services);

  // allPromosURL: 'api/v1/promo/visibleList',

  useEffect(() => {
    dispath(promocodeListRequest());
  }, []);

  const renderItem = () => {
    return (
      <View style={styles.itemContainer}>
        <Row>
          <Text large bold>
            Get 25% Off{' '}
          </Text>
          <Text large bold textColor={Colors.primary}>
            5 Day Left{' '}
          </Text>
        </Row>

        <Text style={{width: '50%', marginVertical: scale(5)}}>
          Get 25% Off UPTO $10 on your first 2 bookings.
        </Text>
        <Row>
          <Text medium bold>
            USE CODE: APRT2500
          </Text>
          <Text large bold textColor={'black'}>
            Apply{' '}
          </Text>
        </Row>
      </View>
    );
  };

  return (
    <Container drawer title={'Coupons'}>
      <FlatList data={['', '']} renderItem={renderItem}></FlatList>
    </Container>
  );
};

export default Coupons;

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 5,
    ...commonStyle.cardStyle,
    borderWidth: 0,
    ...commonStyle.shadow,
    borderRadius: 0,
  },
});
