import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x5,
  },
  listContainer: {
    maxHeight: Sizing.layout.x165,
  },
  headerText: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
  },
  headerContainer: {
    marginBottom: Sizing.layout.x5,
    padding: Sizing.layout.x5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: Sizing.layout.x5,
    gap: Sizing.layout.x5,
    backgroundColor: Colors.neutral.white,
    marginBottom: Sizing.layout.x5,
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g400,
    overflow: 'hidden',
    alignItems: 'center',
    minHeight: 50,
  },
  itemText: {
    ...Typography.fontSize.x14,
    flexShrink: Sizing.flexSize.x100,
    padding: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x18,
  },
  button: {
    padding: Sizing.layout.x10,
    width: Sizing.layout.x80,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  selectedButton: {
    backgroundColor: Colors.appColors.red,
  },
  deselectedButton: {
    backgroundColor: Colors.appColors.violet,
  },
  buttonText: {
    ...Typography.fontSize.x14,
    color: Colors.neutral.white,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.fontSize.x16,
    marginTop: Sizing.layout.x5,
  },
});

export default styles;
