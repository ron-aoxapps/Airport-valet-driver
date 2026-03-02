import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

import {scale} from 'react-native-size-matters';
import {Colors} from '../../constants';
import {Text} from '..';
import {commonStyle, fontSize} from '../../styles/styles';

const Loader = () => {
  const loader = useSelector(state => state.common);
  return (
    <Modal
      transparent
      visible={loader.loading && loader.showLoader}
      animationType="fade">
      <View style={styles.container}>
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text bold style={styles.text}>
            Loading...
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  loadingView: {
    // height: 100,
    padding: scale(20),
    width: '80%',
    backgroundColor: 'white',
    borderRadius: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    ...commonStyle.shadow,
  },
  text: {
    marginLeft: scale(10),
    fontSize: fontSize.Medium4_5,
    color: Colors.textColor,
  },
});
