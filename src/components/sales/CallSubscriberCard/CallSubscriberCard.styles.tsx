import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    paddingHorizontal: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x8,
    ...Forms.shadowContainer.primary,
  },
  container_md: {
    width: Sizing.layoutP.xp50,
  },
  container_lg: {
    width: Sizing.layoutP.xp40,
  },
  container_xl: {
    width: Sizing.layoutP.xp35,
  },

  buttonStyle: {
    width: Sizing.layoutP.xp100,
    marginTop: Sizing.layout.x8,
    minHeight: Sizing.layout.x35,
    height: Sizing.layout.x35,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    width: Sizing.layout.x180,
  },
  primaryText_md: {
    width: Sizing.layout.x230,
  },
  primaryText_lg: {
    width: Sizing.layout.x230,
  },
  primaryText_xl: {
    width: Sizing.layout.x230,
  },
  secondaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
    width: Sizing.layout.x180,
  },
  buttonLabelStyle: {
    ...Typography.fontSize.x14,
  },
});

export default styles;
