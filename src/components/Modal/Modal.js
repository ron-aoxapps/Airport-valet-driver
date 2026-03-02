import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import { VectorIcon } from '..';
import { commonStyle } from '../../styles/styles';

const RNModal = ({cross,visible, onDismiss, children,style}) => {
  return (
    <Modal visible={visible} transparent>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onDismiss}
        style={styles.modal}>
        <TouchableOpacity activeOpacity={1} style={[styles.contentContainer,style]}>
          {children}
        {cross && <TouchableOpacity
              onPress={onDismiss}
              style={styles.closeButton}>
              <VectorIcon
                type={'Entypo'}
                name="cross"
                size={25}
                color="red"
              />
            </TouchableOpacity>}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default RNModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#00000080',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(30),
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: scale(20),
    minHeight:400
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    borderRadius: 20,
    padding: 5,
    backgroundColor: 'white',
    ...commonStyle.shadow,
  },
});
