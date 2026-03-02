import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Container, Header} from '../../../components';
import {useDispatch} from 'react-redux';
import {navigationRef} from '../../../navigation/rootNavigation';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../../config';
import {popupType, showPopup} from '../../../utils/commonFunction';

const VerifyOtp = props => {
  const dispath = useDispatch();
  const navigation = useNavigation();

  const [state, setstate] = useState({
    otp: '',
    serverOtp: '',
  });

  useEffect(() => {
    const {serverResponse} = props.route.params;

    setstate(prev => ({
      ...prev,
      serverOtp: serverResponse.OTP,
      otp: serverResponse.OTP,
    }));

    // OTP
  }, []);

  function _onVerifyOtp() {
    const {serverResponse} = props.route.params;
    const {otp, serverOtp} = state;

    if (otp === serverOtp) {
      navigation.navigate(SCREEN_NAMES.Register, {serverResponse});
    } else {
      showPopup(popupType.error, "Otp doesn't match. please reverify");
    }
  }
  return (
    <Container>
      <Header title={'Verify Code'} />

      <Button onPress={_onVerifyOtp} title={'Sumbit'} />
    </Container>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({});
