import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Container, Row, Text} from '../../../components';
import {commonStyle} from '../../../styles/styles';
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from '../../../constants';
import {navigationRef} from '../../../navigation/rootNavigation';
import {SCREEN_NAMES} from '../../../config';

const pages = [
  {page: 'Term and Conditions', type: 'terms'},
  {page: 'Privacy Policy', type: 'privacy'},
  {page: 'About us', type: 'aboutus'},
];

const Setting = () => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>
          navigationRef.navigate(SCREEN_NAMES.Page, {type: item.type})
        }
        style={styles.item}>
        <Row>
          <Text>{item.page}</Text>
          <Icon name="right" size={20} color={Colors.textColor} />
        </Row>
      </TouchableOpacity>
    );
  };
  return (
    <Container drawer title={'Setting'}>
      <FlatList data={pages} renderItem={renderItem} />
    </Container>
  );
};

export default Setting;

const styles = StyleSheet.create({
  item: {
    ...commonStyle.cardStyle,
    borderRadius: 0,
    marginVertical: 5,
  },
});
