import React from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CommonSize} from '../config/CommonSize';

const colordef = 'black';

const VectorIcons = {
  AntDesign,
  MaterialIcons,
  EvilIcons,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  Zocial,
  Feather,
  Octicons,
  SimpleLineIcons,
};

const VectorIcon = ({type, name, size, style, color, onPress}) => {
  const Icon = VectorIcons[type];
  return (
    <Icon
      onPress={onPress}
      name={name}
      size={size || 20}
      style={style}
      color={color != null ? color : colordef}
    />
  );
};

export default VectorIcon;
