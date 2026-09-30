import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  groupContainer: {
    backgroundColor: Colors.neutral.g50,
    borderRadius: Sizing.layout.x8,
    overflow: 'hidden',
    marginVertical: Sizing.layout.x8,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g200,
  },
  headerContainer: {
    ...Forms.shadowContainer.primary,
    paddingHorizontal: Sizing.layout.x8,
    minHeight: Sizing.layout.x48,
    flexDirection: 'row',
    gap: Sizing.layout.x12,
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  headerIcon: {
    width: Sizing.layout.x24,
    height: Sizing.layout.x24,
  },
  tileDivider: {
    borderBottomWidth: Sizing.layout.x1,
    borderBottomColor: Colors.neutral.g50,
  },
  textStyle: {
    ...Typography.regular.x14,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
  },
});

export default styles;
