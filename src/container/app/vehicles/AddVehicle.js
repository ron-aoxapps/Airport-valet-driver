import {Image, Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {
  Text,
  Container,
  TextInput,
  ImagePicker,
  Button,
} from '../../../components';
import {Colors, Images} from '../../../constants';
import {commonStyle} from '../../../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from './styles';
import {useRef} from 'react';
import * as yup from 'yup';
import {addNewVehicleRequest} from '../../../module/Vehicles/actions';
import {useEffect} from 'react';
import {popupType, showToast} from '../../../utils/commonFunction';
import {useDispatch} from 'react-redux';
import {useLoaderSelector} from '../../../module/customSelector';
const vehicleSchema = yup.object({
  make: yup.string().required('Enter vehicle make.').trim(),
  model: yup.string().when('make', {
    is: valid => valid,
    then: yup.string().required('Enter vehicle model.').trim(),
  }),
  color: yup.string().when('model', {
    is: valid => valid,
    then: yup.string().required('Enter vehicle color.').trim(),
  }),
  plateNumber: yup.string().when('color', {
    is: valid => valid,
    then: yup.string().required('Enter vehicle plate number.').trim(),
  }),
  carImage: yup.string().when('plateNumber', {
    is: valid => valid,
    then: yup.string().required('Select vehicle image.'),
  }),

  // termCondition: yup.bool().when('confirmPassword', { is: valid => valid, then: yup.bool().oneOf([true], 'Please select term and conditions') })
});

const AddVehicle = props => {
  const {loading, loadingRequest, showLoader} = useLoaderSelector();

  const dispatch = useDispatch();
  const [state, setState] = useState({
    carImage: '',
    make: '',
    model: '',
    color: '',
    plateNumber: '',
    isEdit: false,
  });
  console.log('state', state);

  useEffect(() => {
    const params = props.route.params;

    console.log('params', params);
  }, []);

  const setFieldValue = (type, value) => {
    if (type == 'multi') {
      setState(prev => ({...prev, ...value}));
    } else {
      setState(prev => ({...prev, [type]: value}));
    }
  };

  const InputRef = useRef({
    make: React.createRef(),
    model: React.createRef(),
    color: React.createRef(),
    plateNumber: React.createRef(),
  });

  const handleOnSubmitEditing = next => {
    if (next) {
      InputRef.current?.[next]?.current.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const onImageSelect = res => {
    setState(prev => ({...prev, carImage: res}));
  };

  const onAddClick = async () => {
    const {carImage, color, make, model, plateNumber} = state;

    await vehicleSchema
      .validate(state)
      .then(res => {
        let data = {
          carName: res.make,
          carModel: res.model,
          carColor: res.color,
          plateNumber: res.plateNumber,
          carImage: res.carImage,
        };

        dispatch(addNewVehicleRequest({data}));
      })
      .catch(error => {
        showToast(popupType.error, error.errors, true);
      });
  };

  return (
    <Container back title={'Add Vehicle'}>
      <ScrollView contentContainerStyle={{paddingTop: 50}}>
        <Text large bold style={{marginBottom: 20}}>
          Please Enter Car Details
        </Text>

        <TextInput
          title={'make'}
          leftIcon={Images.vehicle}
          onChangeText={text => {
            setFieldValue('make', text);
          }}
          value={state.make}
          inputRef={InputRef.current['make']}
          returnKeyType={'next'}
          onSubmitEditing={() => handleOnSubmitEditing('model')}
        />
        <TextInput
          title={'model'}
          leftIcon={Images.vehicle}
          onChangeText={text => {
            setFieldValue('model', text);
          }}
          value={state.model}
          inputRef={InputRef.current['model']}
          returnKeyType={'next'}
          onSubmitEditing={() => handleOnSubmitEditing('color')}
        />
        <TextInput
          title={'Color'}
          leftIcon={Images.color}
          onChangeText={text => {
            setFieldValue('color', text);
          }}
          value={state.color}
          inputRef={InputRef.current['color']}
          returnKeyType={'next'}
          onSubmitEditing={() => handleOnSubmitEditing('plateNumber')}
        />
        <TextInput
          title={'Plate number'}
          leftIcon={Images.plate}
          onChangeText={text => {
            setFieldValue('plateNumber', text);
          }}
          value={state.plateNumber}
          inputRef={InputRef.current['plateNumber']}
          returnKeyType={'next'}
          onSubmitEditing={() => handleOnSubmitEditing('email')}
        />

        <ImagePicker onImageSelect={onImageSelect}>
          <View style={commonStyle.row}>
            {state.carImage == '' ? (
              <Icon name="image" size={25} color={Colors.primary} />
            ) : (
              <Image
                source={{uri: state.carImage}}
                style={styles.carUploadImage}
              />
            )}
            <Text textColor={Colors.primary} style={{marginLeft: 10}}>
              Upload Car Image
            </Text>
          </View>
        </ImagePicker>

        <View style={commonStyle.screenTopPadding} />
        <Button
          loading={loading && loadingRequest == addNewVehicleRequest}
          title={'Add'}
          onPress={onAddClick}
        />
      </ScrollView>
    </Container>
  );
};

export default AddVehicle;
