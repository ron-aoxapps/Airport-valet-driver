import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Colors} from '../constants';
import {wp} from '../utils/commonFunction';

export const commonStyle = StyleSheet.create({
  cardStyle: {
    borderRadius: scale(15),
    padding: scale(10),
    marginVertical: scale(10),
    borderColor: Colors.gray,
    borderWidth: 0.5,
    backgroundColor: 'white',
  },
  screenTopPadding: {
    paddingTop: scale(30),
  },
  borderRadius: {
    borderRadius: scale(10),
  },
  paddingHorizontal: {
    paddingHorizontal: scale(15),
  },
  sepratorStyle: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
    marginVertical: scale(5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallImg: {
    height: scale(22),
    width: scale(22),
    resizeMode: 'contain',
  },
  mediumImg: {
    height: scale(50),
    width: scale(50),
    resizeMode: 'contain',
  },
  shadow: {
    shadowColor: Colors.textColor,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,

    elevation: 5,
  },
  outerView: {
    height: scale(22),
    width: scale(22),
    borderRadius: scale(25),
    // backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(10),
  },
  innerView: {
    height: '70%',
    width: '70%',
    borderRadius: 15,
    backgroundColor: Colors.primary,
  },
  uppercaseText: {
    textTransform: 'uppercase',
  },
});

export const fontSize = {
  Medium3: wp('3%'),
  Medium3_5: wp('3.5%'),
  Medium4: wp('4%'),
  Medium4_5: wp('4.5%'),
  Medium6: wp('6%'),
  Medium6_5: wp('6.5%'),
  custom: (percentage = 3) => wp(`${percentage}%`),
};
