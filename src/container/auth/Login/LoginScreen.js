import React, { useRef, useState } from 'react';
import { Image, Keyboard, View } from 'react-native';
import { Button, Container, Header, Text, TextInput } from '../../../components';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { Images, Strings } from '../../../constants';
import { useDispatch } from 'react-redux';
import { popupType, showToast } from '../../../utils/commonFunction';

import * as yup from 'yup';
import {
  loginByPasswordRequest,
  loginRequestAction,
} from '../../../module/Login/actions';
import { useEffect } from 'react';
import { fcmService } from '../../../components/Notification/FCMService';
import { setConfiguration } from '../../../utils/configuration';

const loginSchema = yup.object({
  email: yup
    .string()
    .required('Please enter your email address')
    .email('Please enter valid email address')
    .trim(),
  password: yup.string().when('email', {
    is: valid => valid,
    then: yup
      .string()
      .required('Please enter your your password')
      .trim()
      .min(6),
  }),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loginBy, setloginBy] = useState(0);

  const [state, setState] = useState({
    email: 'testdriver@gmail.com',
    password: '0987654321',
    fcmToken: 'none',
  });

  const setFieldValue = (type, value) => {
    if (type == 'multi') {
      setState(prev => ({ ...prev, ...value }));
    } else {
      setState(prev => ({ ...prev, [type]: value }));
    }
  };

  const InputRef = useRef({
    email: React.createRef(),
    password: React.createRef(),
  });

  const handleOnSubmitEditing = next => {
    if (next) {
      InputRef.current?.[next]?.current.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    _initFcmToken();
  }, []);

  const _initFcmToken = () => {
    // fcmService.registerAppWithFCM();
    // fcmService.register(token => {
    //   console.log('fcmToken', token);
    //   if (token) {
    //     setFieldValue('fcmToken', token);
    //     setConfiguration('fcmToken', token);
    //   } else {
    //     setConfiguration('fcmToken', 'none');
    //     setFieldValue('fcmToken', 'none');
    //   }
    // });
  };





  const _onPressLoginButton = async () => {
    const { email, password, fcmToken } = state;
   
    try {
      
      
      const data = {
        email,
        password,
        // firebaseToken: fcmToken,
      };
      // Dispatch the action - saga will handle API call
      dispatch(loginByPasswordRequest({ 
        data}));
      
    } catch (e) {
      showToast(popupType.error, e.errors[0], true);
    }
  };

  return (
    <Container>
      <Header back={false} title={'Login / Signup'} />
      <View style={styles.container}>
        <Image source={Images.loginImage} style={styles.headerImage} />

        <Text bold style={styles.title}>
          {'Let’s get started!'}
        </Text>
        <Text style={styles.description}>{Strings.dumytext}</Text>

        <TextInput
          title={Strings.Email}
          leftIcon={Images.email}
          onChangeText={text => {
            setFieldValue('email', text);
          }}
          value={state.email}
          inputRef={InputRef.current['email']}
          returnKeyType={'next'}
          onSubmitEditing={() => handleOnSubmitEditing('password')}
        />
        <TextInput
          title={Strings.password}
          leftIcon={Images.lock}
          rightIcon
          onChangeText={text => {
            setFieldValue('password', text);
          }}
          value={state.password}
          inputRef={InputRef.current['password']}
          returnKeyType={'next'}
          onSubmitEditing={() => handleOnSubmitEditing('confirmPassword')}
        />

        <Button
          style={styles.button}
          onPress={_onPressLoginButton}
          title={'Next'}
        />
      </View>

      {/* <TextInputCounty */}
    </Container>
  );
};

export default LoginScreen;
