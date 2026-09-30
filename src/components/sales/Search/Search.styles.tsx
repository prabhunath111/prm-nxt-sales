import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  innerContainer: {
    ...Forms.shadowContainer.secondary,
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x16,
    backgroundColor: Colors.violet.v50,
    borderRadius: Outlines.borderRadius.smallMedium,
    gap: Sizing.layout.x8,
    overflow: 'hidden',
  },
  iconButton: {
    justifyContent: 'center',
  },
  modal: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.small,
    borderColor: Colors.neutral.g400,
  },
  inputField: {
    ...Typography.medium.x14,
    borderWidth: Sizing.layout.x0,
    borderRadius: Sizing.layout.x0,
    backgroundColor: Colors.violet.v50,
    color: Colors.violet.v350,
    paddingHorizontal: Sizing.layout.x0,
    flexGrow: Sizing.flexSize.x100,
    minHeight: 'auto',
  },
  arrow: {
    width: Sizing.layout.x0,
    height: Sizing.layout.x0,
  },
  iconStyle: {
    tintColor: Colors.appColors.darkViolet,
  },
});

export default styles;
