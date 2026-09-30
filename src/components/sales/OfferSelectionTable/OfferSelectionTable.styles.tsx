import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Forms, Sizing, Outlines, Typography } from 'styles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    ...Forms.shadowContainer.secondary,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    gap: Sizing.layout.x12,
    borderWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g150,
    shadowRadius: Sizing.layout.x4,
    display: 'flex',
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  innerTopContainer: {
    backgroundColor: Colors.violet.v50,
    padding: Sizing.layout.x8,
    borderTopLeftRadius: Outlines.borderRadius.smallMedium,
    borderTopRightRadius: Outlines.borderRadius.smallMedium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: Sizing.layout.x1,
    minHeight: Sizing.layout.x36,
  },
  innerBottomContainer: {
    padding: Sizing.layout.x8,
    gap: Sizing.layout.x8,
  },
  titleText: {
    ...Forms.textLabel.mediumLeftText,
    flex: Sizing.flexSize.x60,
  },
  dropDownContainer: {
    flex: Sizing.flexSize.x40,
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
  },
  innerDropDown: {
    borderRadius: Outlines.borderRadius.small,
  },
  labelContainer: {
    gap: Sizing.layout.x12,
    display: 'flex',
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...Typography.regular.x12,
    color: Colors.violet.darkViolet,
    flex: Sizing.flexSize.x40,
    minWidth: screenWidth < 380 ? Sizing.layout.x60 : Sizing.layout.x80,
  },
  labelDropDownContainer: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
    flex: Sizing.flexSize.x60,
    minWidth: Sizing.layout.x200,
  },
  linkContainer: {
    paddingVertical: Sizing.layout.x6,
    gap: Sizing.layout.x2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: Colors.appColors.pink,
  },
  linkIcon: {
    tintColor: Colors.appColors.pink,
  },
});

export default styles;
