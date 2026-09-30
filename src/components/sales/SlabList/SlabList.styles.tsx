import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import { isWeb } from 'utils/platformHelper';

const primary = {
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    padding: Sizing.layout.x12,
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
    gap: Sizing.layout.x10,
    borderRadius: Outlines.borderRadius.smallMedium,
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g400,
    marginBottom: Sizing.layout.x10,
  },
  radioCircle: {
    height: Sizing.layout.x16,
    width: Sizing.layout.x16,
    borderRadius: Sizing.layout.x10,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.primary.brand,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    width: Sizing.layout.x10,
    height: Sizing.layout.x10,
    borderRadius: Sizing.layout.x10,
    backgroundColor: Colors.primary.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioWrapper: {
    flexDirection: 'row',
    flex: Sizing.flexSize.x100,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizing.layout.x12,
  },
  id: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x600,
  },
  idLabel: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x500,
    color: Colors.primary.brand,
  },
  nameLabel: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x20,
    color: Colors.primary.brand,
    // fontWeight: 'bold',
  },
  nameValue: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x20,
    color: Colors.neutral.black,
  },
  name: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x20,
    color: Colors.primary.theme,
  },
  activeText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    marginTop: Sizing.layout.x0,
    textTransform: 'uppercase',
  },
  statusWrapper: {
    flexShrink: Sizing.flexSize.x100,
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x6,
    borderRadius: Outlines.borderRadius.base,
  },
  headingText: {
    ...Typography.fontSize.x15,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
    textAlign: 'flex-start',
    width: Sizing.layoutP.xp100,
  },
  headingText_md: {
    textAlign: 'flex-start',
  },
  headingText_lg: {
    textAlign: 'flex-start',
  },
  headingText_xl: {
    textAlign: 'flex-start',
  },
  listContainer: {
    width: Sizing.layoutP.xp100,
    flex: Sizing.flexSize.x100,
    paddingTop: Sizing.layout.x14,
    maxHeight: Sizing.layout.x230,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    width: Sizing.layout.x15,
    height: Sizing.layout.x15,
    marginRight: Sizing.layout.x5,
    marginTop: Sizing.layout.x1,
  },
};

const secondary = {
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    width: Sizing.layoutP.xp100,
    overflowY: 'auto',
    height: getFullScreenHeight() / 4,
    ...(isWeb && {
      height: getFullScreenHeight() / 3.5,
    }),
  },
  subContainer_xl: {
    ...(isWeb && {
      height: getFullScreenHeight() / 5,
    }),
  },
  subContainer_md: {
    ...(isWeb && {
      height: getFullScreenHeight() / 8,
    }),
  },
  subContainer_sm: {
    ...(isWeb && {
      height: getFullScreenHeight() / 6,
    }),
  },
  subContainer_xs: {
    ...(isWeb && {
      height: getFullScreenHeight() / 6,
    }),
  },
  headingText: {
    ...Typography.fontSize.x15,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
    textAlign: 'center',
    paddingVertical: Sizing.layout.x10,
    marginVertical: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  headingText_md: {
    textAlign: 'flex-start',
  },
  headingText_lg: {
    textAlign: 'flex-start',
  },
  headingText_xl: {
    textAlign: 'flex-start',
  },
  separator: {
    width: Sizing.layoutP.xp100,
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.neutral.g200,
    borderStyle: 'dashed',
    marginVertical: Sizing.layout.x10,
  },
};

const styles = StyleSheet.create<any>({
  primary: { ...primary },
  secondary: { ...secondary },
});

export default styles;
