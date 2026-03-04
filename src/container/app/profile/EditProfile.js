import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React from 'react';
import {
  AddressInput,
  Button,
  Container,
  ImageLoading,
  ImagePicker,
  Row,
  TextInput,
} from '../../../components';
import {commonStyle} from '../../../styles/styles';
import {Images, Strings} from '../../../constants';
import {styles} from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useState} from 'react';
import {useProfileSelector} from '../../../module/customSelector';
import {useEffect} from 'react';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {updateProfileRequest} from '../../../module/Profile/actions';
import CountryInputText from '../../../components/TextInput/CountryInputText';

const initialState = {
  profileImage: '',
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  countryCode: {
    cca2: 'US',
    code: '+1',
  },
  originalProfileImage: '', // To track if image was changed
};

const Editprofile = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const profileData = useProfileSelector();

  const setFieldValue = (type, value) => {
    if (type == 'multi') {
      setState(prev => ({...prev, ...value}));
    } else {
      setState(prev => ({...prev, [type]: value}));
    }
  };

  const handleImageSelect = (url) => {
    if (isEditing) {
      setFieldValue('profileImage', url);
      setIsImageChanged(true);
    }
  };

  const InputRef = useRef({
    name: React.createRef(),
    email: React.createRef(),
    address: React.createRef(),
    phoneNumber: React.createRef(),
  });

  const handleOnSubmitEditing = next => {
    if (next) {
      InputRef.current?.[next]?.current.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    if (profileData) {
      setState({
        profileImage: profileData.profileImage || '',
        name: profileData.name || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        address: profileData.address || '',
        countryCode: {
          cca2: profileData.countryName || 'US',
          code: profileData.countryCode || '+1',
        },
        originalProfileImage: profileData.profileImage || '',
      });
      setIsImageChanged(false);
    }
  }, [profileData]);

  const validateForm = () => {
    if (!state.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!state.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!state.address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return false;
    }
    return true;
  };

  const onUpdateProfile = () => {
    if (!validateForm()) return;

    // Prepare data for API
    const data = {
      name: state.name,
      phoneNumber: state.phoneNumber,
      address: state.address,
      countryCode: state.countryCode.code,
    };

    // Only include profileImage if it was changed
    if (isImageChanged && state.profileImage) {
      data.profileImage = state.profileImage;
    } else {
      data.profileImage = ''; // Send empty string if no change
    }

    // Note: email is not included as it might not be editable
    // If email is editable, uncomment the line below
    // data.email = state.email;

    dispatch(updateProfileRequest({data}));
    setIsEditing(false);
  };

  const onCancelEdit = () => {
    if (profileData) {
      setState({
        profileImage: profileData.profileImage || '',
        name: profileData.name || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        address: profileData.address || '',
        countryCode: {
          cca2: profileData.countryName || 'US',
          code: profileData.countryCode || '+1',
        },
        originalProfileImage: profileData.profileImage || '',
      });
      setIsImageChanged(false);
    }
    setIsEditing(false);
  };

  const getImageSource = () => {
    if (state.profileImage) {
      return {uri: state.profileImage};
    }
    return Images.profilePlaceholder;
  };

  return (
    <Container drawer title={'Edit Profile'}>
      <ScrollView>
        <View style={commonStyle.screenTopPadding} />
        <ImagePicker onImageSelect={handleImageSelect}>
          <View style={{alignSelf: 'center'}}>
            <ImageLoading
              source={getImageSource()}
              style={styles.profileImage}
            />
            {isEditing && (
              <View style={styles.camIcon}>
                <Icon name="camera-alt" color="white" size={17} />
              </View>
            )}
          </View>
        </ImagePicker>
        <View style={commonStyle.screenTopPadding} />
        
        <TextInput
          title={Strings.name}
          leftIcon={Images.user}
          onChangeText={text => {
            setFieldValue('name', text);
          }}
          value={state.name}
          inputRef={InputRef.current['name']}
          returnKeyType={'next'}
          onSubmitEditing={() => handleOnSubmitEditing('email')}
          editable={isEditing}
          placeholder="Enter your name"
        />
        
        <TextInput
          title={Strings.Email}
          leftIcon={Images.email}
          onChangeText={text => {
            setFieldValue('email', text);
          }}
          value={state.email}
          inputRef={InputRef.current['email']}
          returnKeyType={'next'}
          onSubmitEditing={() => handleOnSubmitEditing('phoneNumber')}
          editable={false} // Usually email is not editable
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <CountryInputText
          title={Strings.MobileNumber}
          code={state.countryCode}
          value={state.phoneNumber}
          onChangeText={text => setFieldValue('phoneNumber', text)}
          onChangeCode={code => setFieldValue('countryCode', code)}
          inputRef={InputRef.current['phoneNumber']}
          placeholder={Strings.MobileNumber}
          editable={isEditing}
          keyboardType="phone-pad"
        />
        
        <AddressInput 
          title={Strings.Address} 
          value={state.address} 
          onChangeText={text => setFieldValue('address', text)}
          editable={isEditing}
          placeholder="Enter your address"
        />
        
        <View style={commonStyle.screenTopPadding} />
        
        {!isEditing ? (
          <Button 
            title={'Edit Profile'} 
            onPress={() => setIsEditing(true)} 
          />
        ) : (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button 
              title={'Save'} 
              onPress={onUpdateProfile} 
              style={{flex: 1, marginRight: 10}} 
            />
            <Button 
              title={'Cancel'} 
              onPress={onCancelEdit} 
              style={{flex: 1, marginLeft: 10}} 
            />
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default Editprofile;