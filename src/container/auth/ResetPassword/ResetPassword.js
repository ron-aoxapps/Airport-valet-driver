import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Button,
  Container,
  FloatingButton,
  Header,
  Text,
  TextInput,
} from '../../../components';

import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {Colors, Images, Strings} from '../../../constants';
import Icon from 'react-native-vector-icons/FontAwesome';

const ResetPassword = () => {
  const {reset} = useNavigation();
  const [loginBy, setloginBy] = useState(0);

  const onResetPassword = () => {
    reset({routes: [{name: 'Auth'}]});
  };

  return (
    <Container>
      <Header title={Strings.ResetPassword} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text large bold style={{textAlign: 'center'}}>
            Reset your password
          </Text>
          <Text medium style={[styles.descText, {textAlign: 'center'}]}>
            Please enter your new password
          </Text>
        </View>
        <TextInput
          leftIcon={Images.lock}
          rightIcon
          placeholder={Strings.password.toUpperCase()}
        />
        <TextInput
          leftIcon={Images.lock}
          rightIcon
          placeholder={Strings.confirmPassword.toUpperCase()}
        />

        <Text large style={styles.descText}>
          Your Password must contain:
        </Text>

        <Validations text={'A capital letter'} />
        <Validations text={'Contains a number'} />
        <Validations valid text={'At least 6 characters'} />

        <FloatingButton onPress={onResetPassword} check />
      </View>
    </Container>
  );
};

export default ResetPassword;

const Validations = ({valid, text}) => {
  return (
    <View style={styles.validator}>
      <View style={[styles.validIcon, valid && {backgroundColor: '#c5f9df'}]}>
        <Icon
          name="check"
          size={14}
          color={valid ? '#1FCC79' : Colors.lightFont}
        />
      </View>
      <Text medium textColor={valid ? 'black' : Colors.lightFont}>
        {text}
      </Text>
    </View>
  );
};
