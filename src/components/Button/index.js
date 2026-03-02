import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {Text} from '../index';
import {scale} from 'react-native-size-matters';
import {Colors} from '../../constants';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {commonStyle} from '../../styles/styles';
import FloatingButton from './FloatingButton';

const index = ({
  onPress = () => {},
  round,
  inActive,
  title,
  style,
  textStyle,
  loading = false,
  disabled = false,
  loadingColor = 'white',
}) => {
  const scale = useSharedValue(1);

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  return (
    <Animated.View style={[styles.container, style, scaleStyle]}>
      <TouchableOpacity
        disabled={disabled || loading}
        onPressIn={() => (scale.value = 0.95)}
        onPressOut={() => (scale.value = 1)}
        onPress={onPress}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={0.5}>
        {loading ? (
          <ActivityIndicator size={'small'} color={loadingColor} />
        ) : (
          <Text large={true} bold style={[styles.text, textStyle]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default index;
export {FloatingButton};

const styles = StyleSheet.create({
  container: {
    ...commonStyle.borderRadius,
    height: scale(50),
    backgroundColor: Colors.primary,

    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(15),
    borderRadius: scale(25),
  },
  round: {
    flex: 1,
    borderRadius: 60,
  },
  active: {},
  text: {
    color: 'white',
  },
});
