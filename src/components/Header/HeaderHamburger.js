import {StyleSheet, View, TouchableOpacity, SafeAreaView} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../constants';
import {scale} from 'react-native-size-matters';
import {Text} from '..';
import strings from '../../constants/languagesString';
import {wp} from '../../utils/commonFunction';
import {useNavigation} from '@react-navigation/native';

const HeaderHamburger = ({title, rightComponent, white}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.openDrawer();
          }}
          style={styles.HeaderHamburger}>
          <Icon name="menu" size={35} color={white ? 'white' : 'black'} />
        </TouchableOpacity>

        {title ? (
          <Text large bold style={styles.text}>
            {title}
          </Text>
        ) : null}

        {rightComponent ? (
          <View style={{}}>{rightComponent}</View>
        ) : (
          <View style={styles.button} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HeaderHamburger;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  HeaderHamburger: {},
  text: {
    color: Colors.grayLight,
    // flex: 1,
  },
  button: {
    width: 40,
  },
});
