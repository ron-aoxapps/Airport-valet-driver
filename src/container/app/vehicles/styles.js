import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Colors} from '../../../constants';
import {commonStyle} from '../../../styles/styles';

export const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    ...commonStyle.cardStyle,
  },
  carImge: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  carUploadImage: {
    height: 60,
    width: 60,
    // borderRadius: 30,
  },
  flex: {
    flex: 1,
    paddingLeft: scale(10),
  },
  outerView: {
    height: 30,
    width: 30,
    borderRadius: 15,
    // backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(10),
  },
  innerView: {
    height: '80%',
    width: '80%',
    borderRadius: 15,
    backgroundColor: Colors.primary,
  },
  deleteIcon: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 30,
  },
});
