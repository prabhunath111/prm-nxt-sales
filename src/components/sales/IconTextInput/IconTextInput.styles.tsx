import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  topContainer: {
    gap: Sizing.layout.x12,
  },
  container: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    borderWidth: Sizing.layout.x0,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.violet.v200,
    padding: Sizing.layout.x8,
    alignItems: 'flex-start',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x6,
  },
  iconStyle: {
    height: Sizing.layout.x20,
    width: Sizing.layout.x20,
    resizeMode: 'contain',
  },
  inputFieldStyle: {
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.layout.x100,
    borderWidth: Sizing.layout.x0,
    paddingHorizontal: Sizing.layout.x6,
    paddingVertical: Sizing.layout.x0,
    minHeight: 'auto',
  },
  disabledInputFieldStyle: {
    backgroundColor: Colors.neutral.white,
  },
  errorText: {
    ...Typography.medium.x14,
    color: Colors.appColors.lightRed,
  },
  disabledContainer: {
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: Sizing.layout.x0,
  },
});

export default styles;
