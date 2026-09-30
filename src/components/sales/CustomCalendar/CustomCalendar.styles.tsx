import { StyleSheet } from 'react-native';
import { Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  calenderView: {
    width: Sizing.layoutP.xp100,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizing.layout.x10,
  },
  navButtons: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
  },
  monthTitle: {
    ...Typography.fontWeight.x500,
    fontSize: Sizing.layout.x16,
  },
  doubleArrow: {
    fontSize: Sizing.layout.x18,
  },
});

export default styles;
