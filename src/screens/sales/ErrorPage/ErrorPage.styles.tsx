import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    verticalAlign: 'middle',
    backgroundColor: Colors.neutral.white,
    height: Dimensions.get('window').height,
    gap: Sizing.layout.x20,
    paddingHorizontal: Sizing.layout.x20,
  },
  errorHeader: {
    ...Typography.bold.x70,
    color: Colors.neutral.g200,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.bold.x40,
    color: Colors.error.primary,
    textAlign: 'center',
    marginVertical: Sizing.layout.x10,
  },
  buttonStyle: {
    width: Sizing.layout.x170,
  },
});

export default styles;
