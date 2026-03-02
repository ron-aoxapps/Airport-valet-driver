import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {scale} from 'react-native-size-matters';
import {Colors, Fonts, Images} from '../../constants';
import {Text} from '..';
import Icon from 'react-native-vector-icons/AntDesign';
import ModalDropdown from './ModalDropdown';
// import { dropdownOptions } from "../../constants/Mocks";
import {commonStyle, fontSize} from '../../styles/styles';

const Dropdown = ({
  containerStyle,
  optionsList,
  title,
  leftIcon,
  rightIcon,
  onRightIconPress,
  selected,
  placeholder,
  keyboardType,
  inputRef,
  dropdownIconSize,
  ...props
}) => {
  const [secoreText, setSecoreText] = useState(rightIcon ? true : false);
  const [selectedValue, setselectedValue] = useState('');

  return (
    <>
      <ModalDropdown
        options={optionsList ? optionsList : []}
        {...props}
        style={{marginVertical: scale(10)}}
        isFullWidth
        onSelect={(index, value) => {
          console.log(value);
          props.onChangeText(value, index);
          setselectedValue(value);
        }}
        defaultValue={selected}
        adjustFrame={frame => {
          let copyFrame = frame;
          copyFrame.left = copyFrame.left + 10;
          copyFrame.right = copyFrame.right + 10;
          return copyFrame;
        }}
        dropdownTextStyle={{fontSize: 16}}>
        <View style={[styles.container, containerStyle]}>
          {leftIcon ? <Image source={leftIcon} style={styles.icon} /> : null}
          <Text style={styles.textInput}>
            {selectedValue ? selectedValue : selected ? selected : placeholder}
          </Text>
          <View style={{height: '100%', justifyContent: 'center'}}>
            <Icon
              name="down"
              color="black"
              size={dropdownIconSize ? dropdownIconSize : 22}
            />
          </View>
        </View>
      </ModalDropdown>
    </>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    ...commonStyle.borderRadius,
    height: scale(50),
    borderColor: Colors.gray,
    borderWidth: 1,
    // marginVertical: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
  },
  titleText: {
    position: 'absolute',
    backgroundColor: 'white',
    top: -8,
    left: scale(12),
    paddingHorizontal: 5,
    color: 'black',
  },
  icon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
  textInput: {
    flex: 1,
    // backgroundColor: "red",
    color: Colors.primary,
    fontSize: fontSize.Medium4,
    fontFamily: Fonts.OpenSans_Medium,
    paddingVertical: 5,
    paddingLeft: 10,
  },
});
