import { Dimensions, DimensionValue, FlexAlignType, TextStyle, ViewStyle, Platform } from 'react-native';

import * as Colors from './colors';
import * as Outlines from './outlines';
import * as Sizing from './sizing';
import * as Typography from './typography';

const isIPad = Platform.OS === 'ios' && Platform.isPad;

const screenWidth = Dimensions.get('window').width;

export type FormFieldProps = {
  minHeight?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  color?: string;
  paddingHorizontal?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: FlexAlignType;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | undefined;
  width?: DimensionValue;
  flexGrow?: number;
  borderBottomWidth?: number;
  backgroundColor?: string;
  gap?: number;
  marginTop?: number;
};

type FormFieldType = 'primary' | 'required' | 'error';
export const formField: Record<FormFieldType, FormFieldProps> = {
  primary: {
    borderRadius: Outlines.borderRadius.base,
    borderWidth: Outlines.borderWidth.thick,
    borderColor: Colors.neutral.g400,
    color: Colors.neutral.black,
  },
  error: {
    color: Colors.error.primary,
  },
  required: {
    color: Colors.error.primary,
  },
};

// Define base style outside
const baseBorderContainer: ViewStyle = {
  padding: Sizing.layout.x12,
  shadowColor: Colors.neutral.black,
  shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
  shadowOpacity: Sizing.shadowOpacity.x12,
  shadowRadius: Sizing.layout.x4,
  elevation: Sizing.layout.x4,
  backgroundColor: Colors.neutral.white,
  borderRadius: Outlines.borderRadius.small,
  borderWidth: Sizing.layout.xDot5,
  borderColor: Colors.neutral.g150,
  width: Sizing.layoutP.xp10,
};

export type FormItemType =
  | 'primary'
  | 'secondary'
  | 'smallSearch'
  | 'radioItem'
  | 'radioVerticalItem'
  | 'smallDropDown'
  | 'verticalSpacing'
  | 'smallVerticalSpacing'
  | 'smallVerticalSpacingMinAutoComplete'
  | 'smallVerticalSpacingMin'
  | 'smallVerticalSpacingIcon'
  | 'verticalSpacingSize'
  | 'smallVerticalSpacingSize'
  | 'displayFlex'
  | 'borderThin'
  | 'radioItemBorder'
  | 'removeRadioBorderWithPadding'
  | 'removeRadioBorder'
  | 'fullWidth'
  | 'smallDropDownReports'
  | 'minWidthContainer'
  | 'borderThinFilter'
  | 'verticalPadding'
  | 'borderContainer'
  | 'borderContainer100'
  | 'removeDropDownBorder'
  | 'inlineInputRow'
  | 'noShadowContainer'
  | 'dropDownOuter'
  | 'etskContainer'
  | 'textWrapperManage'
  | 'secondaryBookingNumber'
  | 'noMarginOnTop'
  | 'verticalSize'
  | 'smallVerticalSize'
  | 'smallMargin'
  | 'smallGapInRadio'
  | 'smallDropDownWidth'
  | 'rowRadioButton'
  | 'mediumMargin'
  | 'mediumMarginMultiTv'
  | 'tskVerticalSpacing'
  | 'tskButtonMargin'
  | 'boldLinkText'
  | 'mobRadioItem';
export const formItem: Record<FormItemType, ViewStyle | TextStyle> = {
  primary: {
    flex: Sizing.flexSize.x32,
    paddingBottom: Sizing.layout.x10,
  },
  secondary: {
    paddingVertical: Sizing.layout.x0,
  },
  verticalSpacing: {
    marginTop: Sizing.layout.x32,
  },
  smallVerticalSpacing: {
    marginTop: Sizing.layout.x16,
    ...(isIPad && {
      paddingTop: Sizing.layout.x16,
      marginTop: Sizing.layout.x0,
    }),
  },
  smallVerticalSpacingMinAutoComplete: {
    marginTop: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x8,
    ...(isIPad && {
      marginTop: Sizing.layout.x0,
    }),
    minWidth: Sizing.layout.x140,
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x0,
    flex: Sizing.layout.x1,
    shadowOpacity: Sizing.layout.x0,
    elevation: Sizing.layout.x0,
  },
  smallVerticalSpacingMin: {
    marginTop: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x8,
    ...(isIPad && {
      paddingTop: Sizing.layout.x16,
      marginTop: Sizing.layout.x0,
    }),
    minWidth: Sizing.layout.x140,
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x0,
    flex: Sizing.layout.x1,
    shadowOpacity: Sizing.layout.x0,
    elevation: Sizing.layout.x0,
  },
  smallVerticalSpacingIcon: {
    marginTop: Sizing.layout.x16,
    maxWidth: Sizing.layout.x30,
    ...(isIPad && {
      paddingTop: Sizing.layout.x16,
      marginTop: Sizing.layout.x0,
    }),
  },
  verticalSpacingSize: {
    marginTop: Sizing.layout.x16,
    minWidth: screenWidth > Sizing.layout.x600 ? Sizing.layout.x260 : Sizing.layout.x165,
  },
  smallVerticalSpacingSize: {
    marginTop: Sizing.layout.x16,
    minWidth: Sizing.layout.x120,
  },
  verticalSize: {
    minWidth: screenWidth > Sizing.layout.x600 ? Sizing.layout.x260 : Sizing.layout.x165,
  },
  smallVerticalSize: {
    minWidth: Sizing.layout.x120,
  },
  radioItem: {
    flexDirection: 'row',
  },
  mobRadioItem: {
    flexDirection: screenWidth > Sizing.layout.x660 ? 'row' : 'column',
  },
  radioVerticalItem: {
    flexDirection: 'column',
  },
  smallDropDown: {},
  smallDropDownReports: {},
  smallSearch: {
    minWidth: Sizing.layout.x218,
  },
  displayFlex: {
    flex: Sizing.flexSize.x100,
  },
  borderThin: {
    flex: Sizing.flexSize.x100,
    borderColor: Colors.neutral.g250,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallest,
    padding: Sizing.layout.x4,
  },
  removeRadioBorder: {
    borderWidth: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x0,
  },
  borderThinFilter: {
    flexGrow: Sizing.flexSize.x0,
    borderRadius: Outlines.borderRadius.smallest,
    flexShrink: Sizing.flexSize.x0,
  },
  radioItemBorder: {
    flexDirection: 'row',
    borderWidth: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x0,
  },
  removeRadioBorderWithPadding: {
    borderWidth: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x8,
  },
  fullWidth: {
    flex: Sizing.flexSize.x100,
  },
  minWidthContainer: {
    minHeight: Sizing.layout.x40,
    flex: 1,
  },
  verticalPadding: {
    paddingVertical: Sizing.layout.x8,
    minHeight: Sizing.layout.x32,
    height: 'auto',
  },
  removeDropDownBorder: {
    borderWidth: Sizing.layout.x0,
    padding: Sizing.layout.x0,
  },
  borderContainer: baseBorderContainer,
  borderContainer100: {
    ...baseBorderContainer,
    width: Sizing.layoutP.xp100,
  },
  inlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Typography.fontWeight.x600,
    gap: Sizing.layout.x12,
  },
  noShadowContainer: {
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x0 },
    shadowOpacity: Sizing.layout.x0,
    shadowRadius: Sizing.layout.x0,
    elevation: Sizing.layout.x0,
    padding: Sizing.layout.x0,
    borderRadius: Sizing.layout.x0,
  },
  dropDownOuter: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
    flex: Sizing.flexSize.x100,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
  },
  etskContainer: {
    backgroundColor: Colors.violet.v100,
    padding: Sizing.layout.x8,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
  },
  textWrapperManage: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
    justifyContent: 'flex-start',
  },
  secondaryBookingNumber: {
    color: Colors.appColors.hotPink,
  },
  noMarginOnTop: {
    marginTop: Sizing.layout.x0,
  },
  smallMargin: {
    marginTop: Sizing.layout.x3,
  },
  smallGapInRadio: {
    gap: Sizing.layout.x5,
    marginTop: Sizing.layout.x0,
  },
  smallDropDownWidth: {
    minWidth: Sizing.layout.x100,
  },
  rowRadioButton: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
  },
  mediumMargin: {
    marginTop: Sizing.layout.x8,
  },
  mediumMarginMultiTv: {
    marginTop: Sizing.layout.x8,
    ...((Platform.OS === 'android' || Platform.OS === 'ios') && { marginTop: Sizing.layout.x0 }),
  },
  tskVerticalSpacing: {
    marginTop: Sizing.layout.x70,
  },
  tskButtonMargin: {
    marginTop: Sizing.layout.x20,
  },
  boldLinkText: {
    ...Typography.medium.x16,
    ...Typography.fontWeight.x800,
  },
};

export type GroupStyle =
  | 'rowContainer'
  | 'flexStartContainer'
  | 'flexStartContainerTsra'
  | 'tsraContainer'
  | 'borderContainer'
  | 'borderContainerReport'
  | 'borderContainerCol'
  | 'baseCenterWidth'
  | 'rowContainerCenter'
  | 'borderContainerColGap'
  | 'labelPadding'
  | 'bottomSpace'
  | 'rowContainerStart';
export const group: Record<GroupStyle, ViewStyle> = {
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x8,
  },
  flexStartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Sizing.layout.x12,
  },
  flexStartContainerTsra: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: Sizing.layout.x12,
    flexWrap: 'wrap',
  },
  tsraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizing.layout.x12,
    paddingLeft: screenWidth > Sizing.layout.x600 ? Sizing.layoutP.xp15 : Sizing.layout.x0,
    maxWidth: Sizing.layout.x600,
  },
  borderContainer: {
    padding: Sizing.layout.x12,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    gap: Sizing.layout.x24,
    borderWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g150,
  },
  borderContainerReport: {
    padding: Sizing.layout.x12,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    gap: Sizing.layout.x24,
    borderWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g150,
  },
  borderContainerCol: {
    padding: Sizing.layout.x12,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    borderWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g150,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: Sizing.layout.x9,
  },
  borderContainerColGap: {
    padding: Sizing.layout.x12,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    borderWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g150,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: Sizing.layout.x12,
    gap: Sizing.layout.x9,
    marginBottom: screenWidth > Sizing.layout.x1024 ? Sizing.layout.x12 : Sizing.layout.x4,
  },
  baseCenterWidth: {
    alignSelf: 'center',
    width: screenWidth > Sizing.layout.x600 ? Sizing.layout.x360 : Sizing.layoutP.xp100,
  },
  rowContainerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenWidth > Sizing.layout.x600 ? Sizing.layout.x12 : Sizing.layout.x8,
  },
  labelPadding: {
    marginTop: screenWidth > Sizing.layout.x1024 ? Sizing.layout.x12 : Sizing.layout.x4,
    marginBottom: Sizing.layout.x2,
  },
  bottomSpace: {
    marginBottom: Sizing.layout.x12,
  },
  rowContainerStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizing.layout.x8,
  },
};

export type InputStyleType = 'primary' | 'secondary' | 'dealerBox';
export const input: Record<InputStyleType, FormFieldProps> = {
  primary: {
    ...formField.primary,
    borderWidth: Sizing.layout.x0,
    borderBottomWidth: Sizing.layout.x0,
    borderRadius: Sizing.layout.x4,
    backgroundColor: Colors.neutral.white,
    color: Colors.neutral.black,
  },
  secondary: {
    borderWidth: Sizing.layout.x0,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.violet.v200,
    minHeight: Sizing.layout.x40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: Sizing.flexSize.x100,
    gap: Sizing.layout.x12,
  },
  dealerBox: {
    marginTop: Sizing.layout.x10,
    minHeight: Sizing.layout.x120,
  },
};

export type LabelType = 'primary' | 'textCenter' | 'boldText' | 'mediumLeftText' | 'titleLeftText' | 'noteRedText' | 'descriptionText' | 'inlineLabel' | 'baseBottomBorder';
export const textLabel: Record<LabelType, TextStyle> = {
  primary: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v400,
  },
  textCenter: {
    textAlign: 'center',
    color: Colors.violet.v200,
  },
  boldText: {
    ...Typography.medium.x16,
    ...Typography.fontWeight.x600,
    color: Colors.violet.darkViolet,
    textAlign: 'center',
  },
  mediumLeftText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    color: Colors.violet.darkViolet,
    textAlign: 'left',
  },
  noteRedText: {
    ...Typography.fontSize.x12,
    ...Typography.fontName.medium,
    color: Colors.appColors.hotPink,
    textAlign: 'left',
    lineHeight: Sizing.layout.x18,
  },
  titleLeftText: {
    ...Typography.fontSize.x18,
    ...Typography.fontWeight.x500,
    ...Typography.fontName.medium,
    color: Colors.violet.darkViolet,
    textAlign: 'left',
  },
  descriptionText: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.darkViolet,
    lineHeight: Sizing.layout.x18,
    ...Typography.fontName.regular,
  },
  inlineLabel: {
    width: Sizing.layout.x100,
    textAlign: 'left',
    color: Colors.neutral.black,
  },
  baseBottomBorder: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v400,
  },
};

export type TitleType = 'primary';
export const title: Record<TitleType, TextStyle> = {
  primary: {
    ...Typography.regular.x20,
    fontFamily: Typography.fontName.medium.fontFamily,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizing.layout.x20,
    color: Colors.neutral.white,
    borderStyle: 'dashed',
    backgroundColor: Colors.secondary.theme,
  },
};

export type CardType = 'primary';
export const card: Record<CardType, TextStyle> = {
  primary: {
    flexDirection: 'column',
    gap: Sizing.layout.x5,
    marginTop: Sizing.layout.x20,
  },
};

export type ButtonContainerType = 'primary' | 'shadowContainer';
export const buttonContainer: Record<ButtonContainerType, TextStyle> = {
  primary: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Sizing.layout.x20,
  },
  shadowContainer: {
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x20,
    backgroundColor: Colors.neutral.white,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: Sizing.layout.x0,
      height: -Sizing.layout.x4,
    },
    shadowOpacity: Sizing.shadowOpacity.x14,
    shadowRadius: Sizing.layout.x25,
    elevation: Sizing.layout.x8,
    gap: Sizing.layout.x10,
  },
};

export type ButtonType = 'primary' | 'secondary' | 'filter' | 'centerSmallBtn' | 'W130';
export const button: Record<ButtonType, TextStyle> = {
  primary: {
    backgroundColor: Colors.primary.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Outlines.borderRadius.small,
    padding: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x25,
    flex: Sizing.layout.x1,
    margin: 'auto',
    fontSize: Typography.fontSize.x18.fontSize,
    fontFamily: Typography.fontName.medium.fontFamily,
  },
  secondary: {
    minWidth: Sizing.layout.x130,
  },
  filter: {
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Outlines.borderRadius.smallest,
    paddingHorizontal: Sizing.layout.x6,
    paddingVertical: Sizing.layout.x6,
    margin: 'auto',
    minWidth: Sizing.layout.x43,
    minHeight: Sizing.layout.x20,
  },
  centerSmallBtn: {
    maxWidth: Sizing.layoutP.xp40,
  },
  W130: {
    minWidth: Sizing.layout.x130,
  },
};

export type ListType = 'primary';
export const list: Record<ListType, TextStyle> = {
  primary: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Sizing.layout.x2,
    paddingVertical: Sizing.layout.x13,
  },
};

export type ItemType = 'primary';
export const item: Record<ItemType, TextStyle> = {
  primary: {
    display: 'flex',
    flexDirection: 'column',
    gap: Sizing.layout.x10,
    marginHorizontal: Sizing.layout.x20,
    marginBottom: Sizing.layout.x5,
    marginTop: Sizing.layoutP.xp2,
  },
};

export type TextType = 'primary';
export const text: Record<TextType, TextStyle> = {
  primary: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    color: Colors.neutral.white,
  },
};

export type FormOrientationType = 'horizontal' | 'vertical';

export const formOrientation: Record<FormOrientationType, ViewStyle> = {
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vertical: {
    flexDirection: 'column',
  },
};

export type ShadowContainerType = 'primary' | 'secondary' | 'tertiary';
export const shadowContainer: Record<ShadowContainerType, ViewStyle> = {
  primary: {
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
  },
  secondary: {
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x2,
    elevation: Sizing.layout.x4,
  },
  tertiary: {
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x0 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x8,
    elevation: Sizing.layout.x4,
  },
};

export type CommonContainerType = 'purpleBg';

export const commonContainer: Record<CommonContainerType, ViewStyle> = {
  purpleBg: {
    alignItems: 'flex-start',
    backgroundColor: Colors.appColors.lightViolet,
    paddingHorizontal: Sizing.layout.x13,
    paddingVertical: Sizing.layout.x8,
    width: Sizing.layoutP.xp100,
    shadowColor: Colors.neutral.black,
    gap: Sizing.layout.x10,
    borderRadius: Outlines.borderRadius.small,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
  },
};

export type DropdownType =
  | 'bottomBorder'
  | 'inventoryDropdown'
  | 'innerPaddingRemove'
  | 'Y'
  | 'baseBottomBorder'
  | 'innerDropDown'
  | 'noBottomBorder'
  | 'removeBottomBorder'
  | 'primary'
  | 'secondary'
  | 'spaceVerical'
  | 'dealerDropown'
  | 'smallVerticalSpacingMin';

export const dropdown: Record<DropdownType, ViewStyle> = {
  bottomBorder: {
    borderBottomColor: Colors.neutral.g250,
    borderBottomWidth: Outlines.borderWidth.thin,
  },
  inventoryDropdown: {
    borderColor: Colors.violet.violetPink,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallest,
    backgroundColor: Colors.neutral.g70,
    height: Sizing.layout.x35,
    marginTop: Sizing.layout.x4,
  },
  Y: {
    borderBottomWidth: Outlines.borderWidth.base,
    borderBottomColor: Colors.neutral.g450,
  },
  dealerDropown: {
    marginVertical: Sizing.layout.x15,
  },
  baseBottomBorder: {
    borderBottomWidth: Outlines.borderWidth.base,
    borderBottomColor: Colors.neutral.g450,
  },
  innerPaddingRemove: {
    flex: Sizing.flexSize.x100,
  },
  innerDropDown: {
    borderRadius: Outlines.borderRadius.small,
    paddingVertical: Sizing.layout.x8,
  },
  noBottomBorder: {
    borderBottomWidth: Sizing.layout.x0,
    gap: Sizing.layout.x0,
    padding: Sizing.layout.x0,
  },
  removeBottomBorder: {
    borderBottomWidth: Sizing.layout.x0,
    gap: Sizing.layout.x0,
    padding: Sizing.layout.x0,
    paddingTop: Sizing.layout.x8,
  },
  primary: {
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x6,
  },
  secondary: {
    borderColor: Colors.violet.borderGrey,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallest,
  },
  spaceVerical: {
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x7,
  },
  smallVerticalSpacingMin: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
  },
};

export type TableType = 'center';

export const table: Record<TableType, ViewStyle> = {
  center: {
    alignItems: 'center',
    backgroundColor: Colors.appColors.darkViolet,
  },
};
