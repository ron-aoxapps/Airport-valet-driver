import {View, Text} from 'react-native';
import React from 'react';

export default function EmptyList({text}) {
  return (
    <View
      style={{
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{text || `No Vehicles Added`}</Text>
    </View>
  );
}
