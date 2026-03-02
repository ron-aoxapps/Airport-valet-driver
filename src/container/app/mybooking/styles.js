import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#00000020',
    marginBottom: 10,
    padding: 10,
    backgroundColor: "white"
  },
  route: {
    flexDirection: 'row',
    marginVertical: scale(12),
  },
  cardDetail: {
    flex: 1,
    marginLeft: 10
  }
});
