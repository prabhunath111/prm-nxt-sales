import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    ...Forms.shadowContainer.secondary,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
    borderRadius: Outlines.borderRadius.baseMedium,
    marginBottom: Sizing.layout.x10,
    margin: Sizing.layout.x2,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: Sizing.layoutP.xp100,
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.violet.borderGrey,
    borderLeftWidth: Sizing.layout.x1,
    borderLeftColor: Colors.violet.borderGrey,
  },

  header: {
    minHeight: Sizing.layout.x36,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x6,
    backgroundColor: Colors.violet.v50,
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.violet.borderGrey,
    borderTopRightRadius: Outlines.borderRadius.baseMedium,
    borderTopLeftRadius: Outlines.borderRadius.baseMedium,
  },
  headerText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.violet.darkViolet,
  },
  textContainer: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x12,
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.violet.borderGrey,
  },
  textView_xl: {
    maxWidth: Sizing.layout.x550,
  },
  textView_lg: {
    maxWidth: Sizing.layout.x450,
  },
  textView_md: {
    maxWidth: Sizing.layout.x350,
  },
  textWrapper: {
    flexDirection: 'row',
  },
  primaryText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    ...Typography.lineHeight.x20,
    color: Colors.violet.darkViolet,
    minWidth: Sizing.layout.x90,
  },
  secondaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    ...Typography.lineHeight.x20,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x1,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x8,
    alignSelf: 'center',
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    minHeight: Sizing.layout.x30,
    minWidth: Sizing.layout.x75,
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x4,
  },
  buttonStyle_md: {
    height: Sizing.layout.x30,
    minWidth: Sizing.layout.x75,
    paddingHorizontal: Sizing.layout.x5,
  },
  buttonStyle_lg: {
    height: Sizing.layout.x40,
    minWidth: Sizing.layout.x159,
    paddingHorizontal: Sizing.layout.x5,
  },
  buttonStyle_xl: {
    height: Sizing.layout.x40,
    minWidth: Sizing.layout.x159,
    paddingHorizontal: Sizing.layout.x5,
  },
  buttonLabelStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
  },
});

export default styles;
