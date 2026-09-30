import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    padding: Sizing.layout.x16,
  },
  card: {
    backgroundColor: Colors.neutral.g50,
    borderRadius: Sizing.layout.x10,
    padding: Sizing.layout.x12,
    marginBottom: Sizing.layout.x12,
  },
  id: {
    ...Typography.fontWeight.x600,
    marginBottom: Sizing.layout.x4,
    ...Typography.regular.x14,
    ...Typography.fontName.medium,
    flexShrink: Sizing.flexSize.x0,
  },
  desc: {
    marginBottom: Sizing.layout.x8,
    color: Colors.neutral.g550,
    ...Typography.regular.x14,
    ...Typography.fontName.medium,
    flexWrap: 'wrap',
    flexShrink: Sizing.flexSize.x100,
    flexGrow: Sizing.flexSize.x100,
  },
  response: {
    ...Typography.fontWeight.x700,
    flexShrink: Sizing.flexSize.x0,
    paddingLeft: Sizing.layout.x12,
    alignItems: 'flex-end',
  },
  responseYes: {
    color: Colors.violet.v550,
  },
  responseNo: {
    color: Colors.neutral.black,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: Sizing.layout.x12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizing.layout.x12,
    flex: Sizing.flexSize.x100,
    width: Sizing.layout.x250,
  },
  checkListHeader: {
    ...Typography.fontWeight.x700,
    ...Typography.regular.x20,
    ...Typography.fontName.medium,
    textAlign: 'center',
    marginBottom: Sizing.layout.x20,
  },
});

export default styles;
