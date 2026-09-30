import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';
import { getScreenHeight } from 'styles/dimentionHelper';

const styles = StyleSheet.create({
  salesContainer: {
    height: getScreenHeight() - Sizing.layout.x120,
    paddingTop: Sizing.layout.x10,
  },
  formContainer: {},
});

export default styles;
