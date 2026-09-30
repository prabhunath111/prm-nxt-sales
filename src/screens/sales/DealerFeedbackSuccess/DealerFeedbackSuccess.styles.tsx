import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.layout.x1,
    backgroundColor: Colors.neutral.white,
    justifyContent: 'space-between',
  },
  subContainer: {
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x16,
    gap: Sizing.layout.x18,
    alignItems: 'center',
    paddingTop: Sizing.layout.x30,
  },
  topContainer_md: {
    width: Sizing.layout.x360,
    alignSelf: 'center',
  },
  topContainer_lg: {
    width: Sizing.layout.x360,
    alignSelf: 'center',
  },
  topContainer_xl: {
    width: Sizing.layout.x360,
    alignSelf: 'center',
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
  headerText: {
    ...Typography.semibold.x18,
    color: Colors.violet.darkViolet,
  },
  textStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  buttonStyle: {
    minHeight: Sizing.layout.x43,
  },
  buttonStyle_md: {
    minWidth: Sizing.layout.x328,
    alignSelf: 'center',
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x328,
    alignSelf: 'center',
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x328,
    alignSelf: 'center',
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
  rightIcon: {
    width: Sizing.layout.x25,
    height: Sizing.layout.x25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronImageStyle: {
    width: Sizing.layout.x12,
    height: Sizing.layout.x12,
  },
  primaryText: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.regular,
    lineHeight: Sizing.layout.x20,
    color: Colors.neutral.black,
    textAlign: 'center',
  },
  subIdTextContainer: {
    marginTop: Sizing.layout.x8,
    flexDirection: 'row',
  },
  subIdText: {
    ...Typography.fontName.medium,
  },
});

export default styles;
