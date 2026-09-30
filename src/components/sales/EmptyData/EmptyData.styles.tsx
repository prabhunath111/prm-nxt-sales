import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x40,
    paddingHorizontal: Sizing.layout.x20,
  },
  textStyle: {
    ...Typography.fontSize.x18,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
    marginTop: Sizing.layout.x22,
    textAlign: 'center',
  },
});

export default styles;
