import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  subContainer: {
    flexGrow: Sizing.flexSize.x100,
    gap: Sizing.layout.x10,
    alignItems: 'center',
  },
  headerText: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
    textAlign: 'center',
  },
  textStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  numberText: {
    ...Typography.medium.x14,
    color: Colors.neutral.black,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x4,
  },
});

export default styles;
