import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from '../../../../components';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconOcticons from 'react-native-vector-icons/Octicons';
import {Colors} from '../../../../constants';

const PickupDropoff = ({pickup, dropoff}) => {
  return (
    <View style={styles.container}>
      <View style={styles.route}>
        <IconOcticons
          name="dot-fill"
          size={20}
          color="green"
          style={{
            margin: 0,
            padding: 0,
            paddingTop: 0,
          }}
        />
        <View style={styles.line} />
        <IconAntDesign name="caretdown" size={15} color={Colors.textColor} />
      </View>
      <View style={{flex: 1}}>
        <Text semibold>
          111/2 Terminal, Air123 {'\n'}
          <Text>26/03/22 | 17:40</Text>
        </Text>
        <View style={{marginTop: 10}} />
        <Text semibold>
          110 front Terminal, Indigo167{'\n'}
          <Text>28/03/22 | 11:20 </Text>
        </Text>
      </View>
    </View>
  );
};

export default PickupDropoff;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  route: {
    width: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    width: 2,
    backgroundColor: Colors.textColor,
    flex: 1,
  },
});
