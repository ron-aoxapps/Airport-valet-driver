import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { scale } from 'react-native-size-matters';

import { requestCameraPermission } from '../../utils/permissions';
// import { useDispatch } from 'react-redux';
import { uploadImageRequest } from '../../module/Common/actions';
import { Colors } from '../../constants';
import { commonStyle } from '../../styles/styles';
import { Text } from '..';
import { useDispatch } from 'react-redux';

const ImagePicker = ({
  local,
  children,
  onImageSelect,
  style,
  uploadingStatus = () => { },
}) => {
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const onResponse = data => {
    if (local) {
      onImageSelect(
        data,
        // Platform.select({android: data, ios: data.replace('file://', '')}),
      );
    } else {
      setUploading(true);
      uploadingStatus(true);
      console.log('data', data);

      const profiledata = new FormData();

      profiledata.append('files', {
        uri: Platform.OS === 'android' ? data : data.replace('file://', ''),
        type: 'image/jpeg',
        name: 'Images',
      });

      const callback = res => {
        setUploading(false);
        uploadingStatus(false);

        if (res.status == 'success') {
          onImageSelect(res.response);
        }

        console.log('respose imageUplod', res);
      };
      dispatch(uploadImageRequest({ data: profiledata, callback }));
    }
  };

  const cameraPicker = async () => {
    try {
      // Close the modal first
      setVisible(false);

      // Check and request camera permission
      const permissionResponse = await requestCameraPermission();

      if (permissionResponse.isGraned) {
        // Permission granted, launch camera
        launchCamera(
          { mediaType: 'photo', cameraType: 'back', quality: 0.5 },
          response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
              Alert.alert(
                'Camera Error',
                'An error occurred while opening the camera. Please try again.',
              );
            } else if (response.errorCode === 'camera_unavailable') {
              Alert.alert(
                'Camera Unavailable',
                'Camera is not available on this device.',
              );
            } else if (response.errorCode === 'permission') {
              Alert.alert(
                'Permission Denied',
                'Camera permission is required to take photos.',
              );
            } else {
              onResponse(response.assets[0].uri);
            }
          },
        );
      } else {
        // Permission denied - the alert is already shown in requestCameraPermission for iOS blocked case
        // For other cases, show a generic message
        if (permissionResponse.Message !== 'Camera permission blocked') {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take photos.',
          );
        }
      }
    } catch (error) {
      console.log('Error in cameraPicker:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
      );
    }
  };

  const galleryPicker = () => {
    try {
      setVisible(false);
      launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          onResponse(response.assets[0].uri);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = type => {
    switch (type) {
      case 'camera':
        cameraPicker();
        break;

      case 'gallery':
        galleryPicker();
        break;

      default:
        cameraPicker();
    }
  };

  const onOpen = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        disabled={uploading}
        style={style}
        onPress={() => onOpen()}>
        {children}
        {uploading && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { justifyContent: 'center', alignItems: 'center' },
            ]}>
            <ActivityIndicator size={'small'} color={Colors.primary} />
          </View>
        )}
      </TouchableOpacity>
      <Modal animationType="slide" visible={visible} transparent>
        <TouchableWithoutFeedback onPress={() => onClose()}>
          <View style={styles.modalContainer}>
            <View style={styles.bottomSheetContainer}>
              <TouchableOpacity
                style={styles.actionSheetButton}
                onPress={() => pickImage('camera')}>
                <Text font={'semiBold'} style={styles.actionButtonWhite}>
                  Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionSheetButton}
                onPress={() => pickImage('gallery')}>
                <Text font={'semiBold'} style={styles.actionButtonWhite}>
                  Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionSheetButton,
                  {
                    marginTop: scale(10),
                    backgroundColor: Colors.white,
                    // ...commonStyle.shadow,
                  },
                ]}
                onPress={() => onClose()}>
                <Text font={'semiBold'} style={styles.actionButton}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            <SafeAreaView style={{ backgroundColor: '#F0F0F1' }} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Platform.select({ ios: '#1C1C1E90', android: '#1C1C1E60' }),
  },
  bottomSheetContainer: {
    // backgroundColor: "#1C1C1E",
    backgroundColor: '#F0F0F1',
    padding: scale(10),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  actionButtonWhite: {
    color: 'white',
  },
  actionButton: {
    color: Colors.primary,
  },
  actionSheetButton: {
    marginVertical: scale(5),
    height: scale(50),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(10),
  },
});
