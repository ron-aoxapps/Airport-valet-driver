import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from '../config';
import {
  LoginScreen,
  Password,
  Register,
  ResetPassword,
  VerifyOtp,
} from '../container/auth';

const Stack = createNativeStackNavigator();
const AuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name={SCREEN_NAMES.LoginScreen} component={LoginScreen} />
      <Stack.Screen
        name={SCREEN_NAMES.Password}
        component={Password}
        options={{animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name={SCREEN_NAMES.ResetPassword}
        component={ResetPassword}
      />
      <Stack.Screen name={SCREEN_NAMES.Register} component={Register} />
      <Stack.Screen name={SCREEN_NAMES.VerifyOtp} component={VerifyOtp} />
    </Stack.Navigator>
  );
};
export default AuthNavigation;
