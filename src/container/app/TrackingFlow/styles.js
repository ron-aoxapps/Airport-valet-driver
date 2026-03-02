import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {commonStyle} from '../../../styles/styles';
import {scale} from 'react-native-size-matters';
import {Colors} from '../../../constants';

export const styles = StyleSheet.create({
  smallImg: {
    ...commonStyle.smallImg,
    height: scale(18),
    width: scale(18),
    tintColor: Colors.textColor,
    marginRight: scale(5),
  },
  pickupLocation: {
    justifyContent: 'flex-start',
    marginVertical: 8,
    alignItems: 'flex-start',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'gray',
    color: Colors.primary,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
    color: Colors.primary,
  },
});
