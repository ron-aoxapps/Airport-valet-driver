import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {commonStyle} from '../../../../styles/styles';
import {Text} from '../../../../components';
import {Colors} from '../../../../constants';
import {scale} from 'react-native-size-matters';

const Tabs = ({tabs = [], selectedTab, onChange}) => {
  const Tab = ({name, selected}) => {
    return (
      <Pressable
        onPress={() => onChange(name)}
        style={({pressed}) => [
          styles.tab,
          selected && styles.active,
          pressed && styles.pressed,
        ]}>
        <Text bold>{name}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {tabs.map((item, index) => {
        return (
          <Tab key={index + ''} selected={selectedTab == item} name={item} />
        );
      })}
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    ...commonStyle.row,
    marginBottom: scale(5),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderBottomColor: Colors.lightFont,
    borderBottomWidth: 1,
    padding: scale(5),
  },
  active: {
    borderBottomColor: Colors.primary,
  },
  pressed: {
    backgroundColor: Colors.primary + 80,
  },
});
