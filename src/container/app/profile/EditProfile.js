import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

const initialState = {
  profileImage: '',
  name: '',
  email: '',
  mobileNumber: '',

  address: '',
  countryCode: {
    cca2: 'IN',
    code: '+91',
  },
};

const Editprofile = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const profileData = useProfileSelector();

  console.log('state', state);

  const setFieldValue = (type, value) => {
    if (type == 'multi') {
      setState(prev => ({...prev, ...value}));
    } else {
      setState(prev => ({...prev, [type]: value}));
    }
  };

  const InputRef = useRef({
    name: React.createRef(),
    email: React.createRef(),
    address: React.createRef(),
    mobileNumber: React.createRef(),
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
        mobileNumber: profileData.mobileNumber || '',

        address: profileData.address || '',
        countryCode: {
          cca2: profileData.countryName || 'IN',
          code: profileData.countryCode || '+91',
        },
      });
    }
  }, [profileData]);

  const onUpdateProfile = () => {
    // const {profileImage, name, email, address} = state;
    const data = {
      ...state,
      countryCode: state.countryCode.code,
    };
    dispatch(updateProfileRequest({data}));
  };

  return (
    <Container drawer title={'Edit Profile'}>
      <ScrollView>
        <View style={commonStyle.screenTopPadding} />
        <ImagePicker
          onImageSelect={url => {
            console.log('url', url);
            setFieldValue('profileImage', url);
          }}>
          <View style={{alignSelf: 'center'}}>
            <ImageLoading
              source={
                state.profileImage == ''
                  ? Images.profilePlaceholder
                  : {uri: state.profileImage}
              }
              style={styles.profileImage}
            />
            <View style={styles.camIcon}>
              <Icon name="camera-alt" color="white" size={17} />
            </View>
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
          onSubmitEditing={() => handleOnSubmitEditing('password')}
        />

        <AddressInput title={Strings.Address} value={state.address} />
        <View style={commonStyle.screenTopPadding} />
        <Button title={'Save'} onPress={() => onUpdateProfile()} />
      </ScrollView>
    </Container>
  );
};

export default Editprofile;
