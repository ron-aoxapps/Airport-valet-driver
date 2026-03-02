import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Colors, Fonts} from '../../../constants';
import {fontSize} from '../../../styles/styles';
import {wp} from '../../../utils/commonFunction';

export const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
    flex: 1,
    marginHorizontal: scale(15),
  },
  title: {
    marginTop: '10%',
    fontSize: 25,
    // textTransform: 'uppercase',
  },
  description: {
    marginTop: 20,
    width: '90%',
    marginBottom: '10%',
    textTransform: 'uppercase',
  },
  button: {
    marginTop: '5%',
  },
  forgotContainer: {
    marginTop: '10%',
  },
  forgot: {
    textTransform: 'uppercase',
    fontSize: fontSize.Medium4,
  },
  headerImage: {
    height: wp(50),
    width: '100%',
    // backgroundColor: 'red',
    resizeMode: 'contain',
  },
});
