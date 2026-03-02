import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {
  Container,
  FloatingButton,
  Header,
  Text,
  TextInput,
} from '../../../components';
import {Images, Strings} from '../../../constants';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../../config';
import {useDispatch} from 'react-redux';
import {loginByPasswordRequest} from '../../../module/Login/actions';
import {useState} from 'react';

const Password = props => {
  const {navigate, goBack} = useNavigation();
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const confirmPassword = () => {
    const serverResponse = props.route.params.serverResponse;
    const requestParam = {
      mobileNumber: serverResponse.mobileNumber,
      password: password,
      firebaseToken: 'none',
    };

    dispatch(loginByPasswordRequest({data: requestParam}));
  };

  return (
    <Container>
      <Header title={Strings.SignIn} />
      <View style={styles.container}>
        {/* <Text bold style={styles.title}>{Strings.enteryourMobileNumber}</Text> */}

        <TextInput
          title={'Password'}
          leftIcon={Images.lock}
          rightIcon
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <TouchableOpacity
          onPress={() => {
            navigate(SCREEN_NAMES.ResetPassword);
          }}
          style={styles.forgotContainer}>
          <Text semibold={true} style={styles.forgot}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <FloatingButton
          onPress={() => {
            confirmPassword();
          }}
          check
        />
      </View>
    </Container>
  );
};

export default Password;
