import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../constants';

const ImageLoading = ({source, style, borderRadius = 0}) => {
  const [loading, setloading] = useState(true);

  return (
    <View style={[style]}>
      <Image
        onLoadStart={() => setloading(true)}
        onLoadEnd={() => setloading(false)}
        source={source}
        style={[styles.image, {borderRadius: style.borderRadius || 0}]}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : null}
    </View>
  );
};

export default ImageLoading;

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});
