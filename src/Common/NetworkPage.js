import {Image, Modal, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';

// import { Button, Text } from ".."
// import {Images} from '../../constants';

import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Button, Text} from '../components';
import {Images} from '../constants';

const NetworkPage = ({visible, children, onTryAgain}) => {
  if (visible)
    return (
      <>
        <View style={styles.container}>
          <Image source={Images.nointernet} style={styles.image} />
          <Text large bold>
            Connection Error
          </Text>
          <Text style={styles.text}>
            Oops!Looks like your device is not connected to the Internet.
          </Text>
          <Button
            onPress={onTryAgain}
            style={styles.button}
            title={'Try Again'}
          />
        </View>
      </>
    );
  else return children;
};

export default NetworkPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    marginTop: 30,
    borderRadius: 5,
    height: 45,
  },
  image: {
    width: widthPercentageToDP(30),
    height: widthPercentageToDP(30),
    resizeMode: 'contain',
    marginBottom: 30,
  },
});
