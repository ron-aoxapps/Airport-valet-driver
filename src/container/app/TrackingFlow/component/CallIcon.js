import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Images} from '../../../../constants';
import {commonStyle} from '../../../../styles/styles';
import {Text} from '../../../../components';
import {scale} from 'react-native-size-matters';

const CallIcon = ({mobileNumber}) => {
  const onPress = () => {
    let phoneNumber = '';
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${mobileNumber}`;
    } else {
      phoneNumber = `tel:${mobileNumber}`;
    }

    return Linking.openURL(phoneNumber);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image style={styles.icon} source={Images.callIconWhite} />
      <Text textColor={'white'} bold medium>
        Call
      </Text>
    </TouchableOpacity>
  );
};

export default CallIcon;

const styles = StyleSheet.create({
  container: {
    ...commonStyle.row,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: scale(10),
  },
  icon: {
    ...commonStyle.smallImg,
    height: scale(18),
    width: scale(18),
    tintColor: 'white',
  },
});
