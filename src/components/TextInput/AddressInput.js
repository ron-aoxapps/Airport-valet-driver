import {
  StyleSheet,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {scale} from 'react-native-size-matters';
import {Text, Container, Header} from '..';
import {Colors, Images} from '../../constants';
import {googleAutocomplete} from '../../utils/commonFunction';
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
  SlideOutRight,
  SlideOutUp,
} from 'react-native-reanimated';

const AddressInput = ({
  title,
  inputRef,
  placeholder,
  leftIcon,
  value = '',
  onSelectAddress,
  ...props
}) => {
  const [address, setaddress] = useState('');
  const [addressModal, toggleAddressModal] = useState(false);
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onClick = () => {
    toggleAddressModal(true);
  };

  const onPressAddress = res => {
    console.log('res', res);
    if (onSelectAddress) {
      onSelectAddress({address: res.description});
      toggleAddressModal(!addressModal);
    } else {
      toggleAddressModal(!addressModal);
    }
  };

  const onChangeText = async text => {
    const places = await googleAutocomplete(text);
    console.log('places', places);
    setAutoCompleteResult(places.predictions ?? []);
  };

  useEffect(() => {
    if (addressModal) {
      //   setAutoCompleteResult([]);
    }
  }, [addressModal]);

  return (
    <View>
      {title ? (
        <Text semibold textColor={'black'} style={styles.headerTitle}>
          {title}
        </Text>
      ) : null}
      <TouchableOpacity
        onPress={onClick}
        style={[styles.container, title && {marginBottom: scale(10)}]}>
        <Image source={Images.location} style={styles.icon} />

        {value == '' ? (
          <Text style={[styles.textInput]}>{placeholder}</Text>
        ) : (
          <Text style={[styles.textInput]}>{value}</Text>
        )}

        {/* <TextInput
                    ref={inputRef}
                    {...props}
                    accessible={false}
                    editable={false}
                    style={[styles.textInput,]}
                    autoCapitalize="none"
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType="default"
                /> */}
      </TouchableOpacity>

      <Modal visible={addressModal} transparent={false} animationType="slide">
        <Container>
          <Header onBack={() => toggleAddressModal(false)} title={title} />
          <View style={[styles.modal]}>
            <View
              onPress={onClick}
              style={[styles.container, title && {marginBottom: scale(10)}]}>
              <Image source={Images.location} style={styles.icon} />
              <TextInput
                ref={inputRef}
                {...props}
                autoFocus
                style={[styles.textInput]}
                autoCapitalize="none"
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType="default"
              />
            </View>
          </View>
          <FlatList
            data={autoCompleteResult}
            renderItem={({item, index}) => (
              <AddressItem
                address={item}
                onPress={() => onPressAddress(item)}
              />
            )}
            keyExtractor={(_, index) => index + ''}
            // ItemSeparatorComponent={() => <View style={[styles.sepratorH]} />}
          />
        </Container>
      </Modal>
    </View>
  );
};

export default AddressInput;

const AddressItem = ({address, onPress}) => {
  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp}>
      <TouchableOpacity onPress={onPress} style={styles.addressItem}>
        <Image
          style={[styles.icon, {tintColor: Colors.primary}]}
          source={Images.location}
        />
        <Text style={styles.addressText}>{address.description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
