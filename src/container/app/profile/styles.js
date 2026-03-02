import {StyleSheet} from 'react-native';
import {Colors} from '../../../constants';

export const styles = StyleSheet.create({
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
    alignSelf: 'center',
  },
  camIcon: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 25,
    right: -5,
    padding: 3,
  },
});
