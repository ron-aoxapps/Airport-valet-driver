import React, { useEffect, useReducer, useRef, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import * as yup from 'yup';
import {
  AddressInput,
  Button,
  Container,
  Header,
  Text,
  TextInput,
} from '../../../components';

import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { Colors, Images, Strings } from '../../../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SCREEN_NAMES } from '../../../config';
import { useDispatch } from 'react-redux';
import { popupType, showToast } from '../../../utils/commonFunction';
import { registerRequest } from '../../../module/Login/actions';

const initialState = {
  countryCode: {
    cca2: 'US',
    code: '+1',
  },
  mobileNumber: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  address: '',
  termCondition: false,
  fcmToken: 'none',
};

const registerSchema = yup.object({
  name: yup.string().required('Please enter your name').trim().min(3),
  email: yup.string().when('name', {
    is: valid => valid,
    then: yup
      .string()
      .required('Please enter your email address')
      .email('Please enter valid email address')
      .trim(),
  }),
  password: yup.string().when('email', {
    is: valid => valid,
    then: yup
      .string()
      .required('Please enter your your password')
      .trim()
      .min(6),
  }),
  confirmPassword: yup.string().when('password', {
    is: password => (password && password.length > 0 ? true : false),
    then: yup
      .string()
      .required('Please enter confirm password!')
      .oneOf([yup.ref('password')], "Confirm password doesn't match"),
  }),
  mobileNumber: yup.string().when('confirmPassword', {
    is: valid => valid,
    then: yup
      .string()
      .required('Please enter your mobile number!')
      .trim()
      .min(9, 'Mobile Number must be at least 9 characters'),
  }),
  address: yup.string().when('mobileNumber', {
    is: valid => valid,
    then: yup.string().required('Please enter your address').trim().min(3),
  }),
  // termCondition: yup.bool().when('confirmPassword', { is: valid => valid, then: yup.bool().oneOf([true], 'Please select term and conditions') })
});

const Register = props => {
  const { reset, navigate } = useNavigation();
  const dispatch = useDispatch();
  const [user, setUser] = useState(initialState);

  useEffect(() => {
    if (props.route.params) {
      const { serverResponse } = props.route.params;

      setFieldValue('multi', {
        countryCode: {
          cca2: serverResponse.countryName || 'IN',
          code: serverResponse.countryCode,
        },
        mobileNumber: serverResponse.mobileNumber,
      });
    }
  }, []);

  const setFieldValue = (type, value) => {
    if (type == 'multi') {
      setUser(prev => ({ ...prev, ...value }));
    } else {
      setUser(prev => ({ ...prev, [type]: value }));
    }
  };

  const InputRef = useRef({
    name: React.createRef(),
    email: React.createRef(),
    password: React.createRef(),
    confirmPassword: React.createRef(),
    address: React.createRef(),
    referral: React.createRef(),
    mobileNumber: React.createRef(),
  });

  const handleOnSubmitEditing = next => {
    if (next) {
      InputRef.current?.[next]?.current.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const onRegister = async () => {
    // navigate(SCREEN_NAMES.BankList)
    await registerSchema
      .validate(user)
      .then(res => {
        let data = {
          name: user.name,
          address: user.address,
          email: user.email,
          mobileNumber: user.mobileNumber,
          countryCode: user.countryCode.code,
          password: user.password,
          fcmToken: user.fcmToken,
        };

        console.log('res', res);

        dispatch(registerRequest({ data, dispatch }));
      })
      .catch(error => {
        showToast(popupType.error, error.errors, true);
      });

    // navigate(SCREEN_NAMES.App);
  };

  return (
    <Container>
      <Header back={false} title={Strings.singup} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
          <TextInput
            title={Strings.name}
            leftIcon={Images.user}
            onChangeText={text => {
              setFieldValue('name', text);
            }}
            value={user.name}
            inputRef={InputRef.current['name']}
            returnKeyType={'next'}
            onSubmitEditing={() => handleOnSubmitEditing('email')}
          />
          <TextInput
            title={Strings.Email}
            leftIcon={Images.email}
            onChangeText={text => {
              setFieldValue('email', text);
            }}
            value={user.email}
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
            value={user.password}
            inputRef={InputRef.current['password']}
            returnKeyType={'next'}
            onSubmitEditing={() => handleOnSubmitEditing('confirmPassword')}
          />
          <TextInput
            title={Strings.confirmPassword}
            leftIcon={Images.lock}
            rightIcon
            onChangeText={text => {
              setFieldValue('confirmPassword', text);
            }}
            value={user.confirmPassword}
            inputRef={InputRef.current['confirmPassword']}
            returnKeyType={'next'}
            onSubmitEditing={() => handleOnSubmitEditing()}
          />

          <AddressInput
            title={Strings.Address}
            value={user.address}
            onSelectAddress={res => {
              setFieldValue('address', res.address);
            }}
          />

          <View style={styles.haveAccount}>
            <Text style={styles.haveAccountText}>
              {Strings.Have_an_account}
            </Text>
            <TouchableOpacity
              onPress={() => {
                reset({ routes: [{ name: 'Auth' }] });
              }}>
              <Text style={[styles.noAccountText, styles.signUpButton]}>
                {Strings.SignIn}
              </Text>
            </TouchableOpacity>
          </View>

          <Button title={'Register'} onPress={onRegister} />
        </ScrollView>
        {/* <FloatingButton onPress={onRegister} /> */}
      </View>
    </Container>
  );
};

export default Register;
