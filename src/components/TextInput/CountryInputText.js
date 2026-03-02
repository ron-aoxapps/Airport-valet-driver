import {StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import Colors from '../../constants/Colors';
import {Text} from '..';
import CountryPicker from 'react-native-country-picker-modal';

import strings from '../../constants/languagesString';
import {scale} from 'react-native-size-matters';

const countryDefault = {
  cca2: 'IN',
  code: '91',
};

const CountryInputText = ({
  title,
  style,
  code = countryDefault,
  onChangeText,
  placeholder,
  onFocus,
  value,
  inputRef,
  onChangeCode,
  disable,
  ...props
}) => {
  const [countryDetails, setCountryDetails] = useState(code);
  const [countryPickerVisibility, setCountryPickerVisibility] = useState(false);

  const onCountrySelect = country => {
    setCountryDetails({
      cca2: country.cca2,
      code: country.callingCode[0] ? country.callingCode[0] : '672',
    });

    onChangeCode({
      cca2: country.cca2,
      code: country.callingCode[0] ? country.callingCode[0] : '672',
    });
  };

  return (
    <>
      {title ? (
        <Text semibold textColor={'black'} style={styles.headerTitle}>
          {title}
        </Text>
      ) : null}
      <View
        style={[styles.container, title && {marginBottom: scale(10)}, style]}>
        <TouchableOpacity
          disabled={disable}
          onPress={() => setCountryPickerVisibility(!countryPickerVisibility)}
          style={styles.countryContainer}>
          <CountryPicker
            // renderFlagButton={prop => <View>{console.log('prop', prop)}</View>}

            countryCode={code.cca2}
            withFilter
            // withFlag
            onSelect={onCountrySelect}
            visible={countryPickerVisibility}
            onClose={() => setCountryPickerVisibility(false)}
          />

          <Text>
            {code.code.includes('+') ? '' : '+'}
            {code.code}
          </Text>
        </TouchableOpacity>
        <View style={styles.seprator} />

        <TextInput
          ref={inputRef}
          editable={!disable}
          {...props}
          onChangeText={onChangeText}
          value={value}
          maxLength={10}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholderTextColor}
          style={styles.textinput}
          keyboardType="numeric"
          onFocus={onFocus}
        />
      </View>
    </>
  );
};

export default CountryInputText;
