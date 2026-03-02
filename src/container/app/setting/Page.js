import {StyleSheet, View} from 'react-native';

import React from 'react';
import {Container, Text} from '../../../components';

const Page = props => {
  const title =
    props.route.params.type == 'terms'
      ? 'Term and Conditions'
      : props.route.params.type == 'privacy'
      ? 'Privacy Policy'
      : 'About Us';
  return (
    <Container back title={title}>
      <View
        style={{
          flex: 0.3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Page is not available yet</Text>
      </View>
    </Container>
  );
};

export default Page;
