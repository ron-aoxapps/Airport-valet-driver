import {View, Image, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {scale} from 'react-native-size-matters';
import {Colors, Images} from '../../constants';
import {Text} from '..';
import {styles as globleStyles} from './styles';
import AddressInput from './AddressInput';
import DateTimePicker from './DateTimePicker';

const index = ({
  containerStyle,
  style,
  title,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onChangeText,
  placeholder,
  keyboardType,
  inputRef,
  ...props
}) => {
  const [secoreText, setSecoreText] = useState(rightIcon ? true : false);

  return (
    <>
      {title ? (
        <Text semibold textColor={'black'} style={globleStyles.headerTitle}>
          {title}
        </Text>
      ) : null}
      <View
        style={[
          globleStyles.container,
          title && {marginBottom: scale(10)},
          containerStyle,
        ]}>
        <>
          {leftIcon ? (
            <Image
              source={leftIcon}
              style={[globleStyles.icon, {tintColor: Colors.textColor}]}
            />
          ) : null}

          <TextInput
            ref={inputRef}
            {...props}
            style={[globleStyles.textInput, style]}
            autoCapitalize="none"
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.placeholderTextColor}
            keyboardType={keyboardType}
            secureTextEntry={secoreText}
          />

          {rightIcon ? (
            <TouchableOpacity
              style={{height: '100%', justifyContent: 'center'}}
              onPress={() => {
                setSecoreText(!secoreText);
              }}>
              <Image
                source={secoreText ? Images.eye_off : Images.eye_on}
                style={globleStyles.icon}
              />
            </TouchableOpacity>
          ) : null}
        </>
      </View>
    </>
  );
};

export default index;
export {AddressInput, DateTimePicker};
