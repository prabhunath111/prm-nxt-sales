import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  itemViewStyle: {
    gap: Sizing.layout.x12,
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    borderRadius: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x8,
    ...Forms.shadowContainer.primary,
    marginTop: -Sizing.layout.x8,
  },
  buttonLabelStyle: {
    ...Typography.fontSize.x14,
  },
  buttonStyle: {
    minHeight: Sizing.layout.x35,
    height: Sizing.layout.x35,
    width: Sizing.layoutP.xp95,
    alignSelf: 'center',
    paddingVertical: Sizing.layout.x0,
  },
  itemTextStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x600,
    ...Typography.lineHeight.x20,
    color: Colors.violet.v400,
    marginLeft: Sizing.layout.x12,
  },
  inputContainerStyle: { paddingBottom: Sizing.layout.x12, borderBottomColor: Colors.violet.borderGrey },
});

export default styles;
