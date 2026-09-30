import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography, Forms } from 'styles';
import { isWeb } from 'utils/platformHelper';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    paddingTop: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  contentStyles: {
    flexDirection: screenWidth > Sizing.layout.x660 ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: screenWidth > Sizing.layout.x660 ? 'flex-start' : 'stretch',
  },
  header: {
    display: 'none',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  header_md: {
    display: 'block',
    marginTop: Sizing.layout.x15,
  },
  header_lg: {
    display: 'block',
    marginTop: Sizing.layout.x15,
  },
  header_xl: {
    display: 'block',
    marginTop: Sizing.layout.x15,
  },
  cardContainer: {
    ...(isWeb && {
      overflow: 'scroll',
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
    }),
    alignItems: 'flex-start',
    borderRadius: Outlines.borderRadius.small,
    paddingHorizontal: Sizing.layout.x15,
  },
  cardContainer_md: {
    marginTop: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x24,
  },
  cardContainer_lg: {
    marginTop: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x24,
  },
  cardContainer_xl: {
    marginTop: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x24,
  },
  cardContent: {
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp100,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: Sizing.layout.x10,
  },
  childContainer: {
    // gap: Sizing.layout.x10,
  },
  childContainer_md: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
  },
  childContainer_lg: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
  },
  childContainer_xl: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
  },
  infoContainer: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'column',
  },
  infoContainer_md: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoContainer_lg: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoContainer_xl: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  balanceContainer: {
    alignItems: 'flex-start',
  },
  balanceContainer_md: {
    flex: Sizing.flexSize.x100,
  },
  balanceContainer_lg: {
    flex: Sizing.flexSize.x100,
  },
  balanceContainer_xl: {
    flex: Sizing.flexSize.x100,
  },
  textWrapper: {
    marginBottom: Sizing.layout.x20,
    minWidth: Sizing.layoutP.xp50,
  },
  primaryText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x22,
    marginBottom: Sizing.layout.x10,
  },
  secondaryText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    lineHeight: Sizing.layout.x22,
  },
  textBold: {
    ...(isWeb && { ...Typography.fontName.medium }),
  },
  inputLabel: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    marginTop: Sizing.layout.x15,
    marginBottom: Sizing.layout.x10,
  },
  inputLabelBold: {
    ...Typography.fontName.medium,
  },
  dropdownContainer: {
    width: Sizing.layoutP.xp100,
  },
  dropdownContainerStyle: {
    ...Forms.formField.primary,
    borderWidth: Outlines.borderWidth.base,
    borderRadius: Outlines.borderRadius.base,
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x0,
    width: Sizing.layoutP.xp100,
  },
  buttonContainer: {
    gap: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x15,
    width: Sizing.layoutP.xp100,
  },
  buttonContainer_md: {
    flexDirection: 'row',
    width: 'auto',
  },
  buttonContainer_lg: {
    flexDirection: 'row',
    width: 'auto',
  },
  buttonContainer_xl: {
    flexDirection: 'row',
    width: 'auto',
  },
  button: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    borderRadius: Outlines.borderRadius.small,
    marginVertical: Sizing.layout.x0,
  },
  button_md: {
    width: 'auto',
    minWidth: Sizing.layout.x170,
  },
  button_lg: {
    width: 'auto',
    minWidth: Sizing.layout.x170,
  },
  button_xl: {
    width: 'auto',
    minWidth: Sizing.layout.x170,
  },
  input: {
    ...Forms.formField.primary,
    borderWidth: Sizing.layout.xDot5,
    borderRadius: Outlines.borderRadius.smallest,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    marginBottom: Sizing.layout.x5,
  },
  inputStyle: {
    ...Forms.formField.primary,
    borderWidth: Sizing.layout.xDot5,
    borderRadius: Outlines.borderRadius.smallest,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    marginBottom: Sizing.layout.x15,
  },
  errorText: {
    ...Typography.fontSize.x16,
    color: Colors.error.primary,
    marginTop: Sizing.layout.x5,
  },
  chevronIconStyle: {
    tintColor: Colors.neutral.black,
  },
  inputFieldStyle: {
    minHeight: Sizing.layout.x40,
  },
  iconContainer: {
    gap: Sizing.layout.x0,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
    width: Sizing.layoutP.xp100,
  },
  textInputFieldStyle: {
    paddingHorizontal: Sizing.layout.x8,
    paddingRight: Sizing.layout.x16,
  },
  containerInputTextStyle: {
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x12,
    paddingRight: Sizing.layout.x8,
  },
});

export default styles;
