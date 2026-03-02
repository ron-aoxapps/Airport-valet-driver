import {Image, Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, Text} from '..';
import {navigationRef} from '../../navigation/rootNavigation';
import {scale} from 'react-native-size-matters';
import {commonStyle} from '../../styles/styles';
import {Images} from '../../constants';

const SuccessModal = ({visible, text, onButtonClick, buttonText}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalcontainer}>
        <View style={styles.container}>
          <Image source={Images.succcessIcon} style={styles.image} />

          <Text style={styles.text}>{text}</Text>

          <View style={commonStyle.screenTopPadding} />
          <Button
            style={styles.button}
            title={buttonText || 'Ok'}
            onPress={() => {
              if (onButtonClick) {
                onButtonClick();
              } else {
                navigationRef.goBack();
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  modalcontainer: {
    flex: 1,
    justifyContent: 'center',
    padding: scale(20),
    backgroundColor: '#00000080',
  },
  container: {
    backgroundColor: 'white',
    padding: scale(20),
    borderRadius: scale(20),
  },
  text: {
    textAlign: 'center',
  },
  image: {
    height: scale(70),
    width: scale(70),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: scale(20),
  },
  button: {
    alignSelf: 'center',
    width: 190,
  },
});
