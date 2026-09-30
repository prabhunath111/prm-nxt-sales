import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
  },
  formContainer: {
    gap: Sizing.layout.x24,
    padding: Sizing.layout.x20,
    flexGrow: Sizing.flexSize.x100,
  },
  groupContainer: {
    gap: Sizing.layout.x24,
  },
  groupContainer_md: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  groupContainer_lg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  groupContainer_xl: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemViewStyle: {
    gap: Sizing.layout.x12,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  itemTextStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v400,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x12,
  },
  autoCompleteContainer: {
    ...Forms.shadowContainer.primary,
    flexGrow: Sizing.flexSize.x100,
    padding: Sizing.layout.x13,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    gap: Sizing.layout.x12,
  },

  autoCompleteModalContent: {
    position: 'relative',
    paddingBottom: Sizing.layout.x10,
  },
  selectPartnerLabel: {
    ...Typography.bold.x14,
    color: Colors.violet.v400,
  },
  chevronIconStyle: {
    tintColor: Colors.primary.brand,
  },
  labelTextStyle: {
    ...Typography.medium.x16,
    color: Colors.violet.darkViolet,
  },
  amountIconStyle: {
    height: Sizing.layout.x25,
    width: Sizing.layout.x100,
  },
  dropdownContainerStyle: {
    gap: Sizing.layout.x8,
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.smallMedium,
    padding: Sizing.layout.x6,
    flex: Sizing.flexSize.x100,
    minHeight: Sizing.layout.x43,
  },
  dropdownContainerStyle_md: {
    flex: 'none',
  },
  dropdownContainerStyle_lg: {
    flex: 'none',
  },
  dropdownContainerStyle_xl: {
    flex: 'none',
  },
  lineSeprator: {
    height: Sizing.layout.x1,
    backgroundColor: Colors.violet.v200,
    marginVertical: Sizing.layout.x8,
  },
  buttonLabelStyle: {
    ...Typography.fontSize.x14,
  },
  errorStyle: {
    ...Typography.fontSize.x13,
    marginTop: Sizing.layoutP.xp1,
  },
  buttonStyle: {
    minHeight: Sizing.layout.x43,
  },
  buttonStyle_md: {
    minWidth: Sizing.layout.x350,
    alignSelf: 'center',
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x350,
    alignSelf: 'center',
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x350,
    alignSelf: 'center',
  },
  // table style
  alignCenter: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
  },
  infoContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  infoContainerStyle_md: {
    justifyContent: 'center',
  },
  infoContainerStyle_lg: {
    justifyContent: 'center',
  },
  infoContainerStyle_xl: {
    justifyContent: 'center',
  },
  primaryInfoTextStyle: {
    ...Typography.medium.x16,
  },
});

export default styles;
