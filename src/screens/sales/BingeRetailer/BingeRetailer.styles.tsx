import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles: any = StyleSheet.create({
  container: {
    margin: Sizing.layout.x16,
    borderRadius: Sizing.layout.x12,
    backgroundColor: Colors.neutral.white,
    shadowColor: Colors.neutral.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x2,
  },
  container_md: {
    alignSelf: 'center',
    width: Sizing.layoutP.xp60,
    height: Sizing.layoutP.xp60,
  },
  container_lg: {
    alignSelf: 'center',
    width: Sizing.layoutP.xp60,
    height: Sizing.layoutP.xp60,
  },
  container_xl: {
    alignSelf: 'center',
    width: Sizing.layoutP.xp60,
    height: Sizing.layoutP.xp60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizing.layout.x16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: Sizing.layout.x12,
    fontSize: Sizing.layout.x16,
    color: Colors.violet.v600,
    ...Typography.fontWeight.x500,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.neutral.g900,
  },
});

export default styles;
