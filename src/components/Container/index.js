import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import { scale } from 'react-native-size-matters';
import { Header, HeaderHamburger } from '..';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants';
// import { SafeAreaView } from 'react-native-safe-area-context'

const Container = ({
  children,
  style,
  drawer,
  title,
  back,
  headerComponent = null,
  ...props
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'height' : null}
        style={[styles.container, style]}>
        {drawer ? (
          <HeaderHamburger title={title ?? ''} {...props.headerProp} />
        ) : null}
        {back ? <Header title={title ?? ''} {...props.headerProp} /> : null}

        {headerComponent}

        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Container;

export const Row = ({ children, style }) => {
  return <View style={[styles.row, style]}>{children}</View>;
};

export const GradientWrap = ({ style, gradient, children }) => {
  return <LinearGradient

    style={style}
    colors={
      gradient
        ? gradient
        : [Colors.primary, "white",]
    }


  >{children}

  </LinearGradient>
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(10),
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
