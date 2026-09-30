import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x15,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
  },
  buttonContainer_md: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  buttonContainer_lg: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  buttonContainer_xl: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  topContainer: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x24,
    paddingVertical: Sizing.layout.x40,
    paddingHorizontal: Sizing.layout.x16,
  },
  navigationTextStyle: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
  },
  navigationContainer: {
    ...Forms.shadowContainer.primary,
    padding: Sizing.layout.x8,
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
  },
  iconContainer: {
    width: Sizing.layout.x25,
    height: Sizing.layout.x25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIconStyle: {
    width: Sizing.layout.x12,
    height: Sizing.layout.x12,
  },
  dealerContainer: {
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.baseMedium,
    borderColor: Colors.neutral.g250,
    backgroundColor: Colors.violet.v100,
    padding: Sizing.layout.x12,
    gap: Sizing.layout.x6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  secondaryTextStyle: {
    ...Typography.medium.x14,
  },
  buttonStyle: {},
  buttonStyle_md: {
    minWidth: Sizing.layout.x450,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x450,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x450,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pleaseWaitText: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
    textAlign: 'center',
  },
});

export default styles;
