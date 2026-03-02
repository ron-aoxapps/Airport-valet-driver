import {View, Image, TextInput, TouchableOpacity, Modal} from 'react-native';
import React, {useState} from 'react';
import {scale} from 'react-native-size-matters';
import {Colors, Images} from '../../constants';
import {Text} from '..';
import {styles as globleStyles, styles} from './styles';
import AddressInput from './AddressInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const DateTimePicker = ({
  mode = 'date',
  containerStyle,
  style,
  title,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onSelect,
  placeholder,
  keyboardType,
  inputRef,
  value,
  minDate = new Date(),
  ...props
}) => {
  const [secoreText, setSecoreText] = useState(rightIcon ? true : false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = date => {
    console.warn('A date has been picked: ', moment(date).format('DD-MM-YYYY'));
    if (mode == 'date') {
      onSelect(moment(date).format('DD-MM-YYYY'));
    } else {
      onSelect(moment(date).format('hh:mm'));
    }

    hideDatePicker();
  };

  return (
    <>
      {title ? (
        <Text semibold textColor={'black'} style={globleStyles.headerTitle}>
          {title}
        </Text>
      ) : null}
      <TouchableOpacity
        onPress={showDatePicker}
        activeOpacity={0.5}
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

          <Text
            // style={(value==''||value==null) ? {}: }
            style={[
              globleStyles.textInput,
              (value == '' || value == null) && {
                color: Colors.placeholderTextColor,
              },
            ]}>
            {value == '' || value == null ? placeholder : value}
          </Text>
        </>
      </TouchableOpacity>

      <DateTimePickerModal
        minimumDate={minDate}
        isVisible={isDatePickerVisible}
        date={minDate}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default DateTimePicker;
