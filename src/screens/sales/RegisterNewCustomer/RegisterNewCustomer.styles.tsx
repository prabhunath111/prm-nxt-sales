import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';

const styles: any = StyleSheet.create({
  container: {
    margin: Sizing.layout.x16,
    borderRadius: Sizing.layout.x12,
    backgroundColor: '#fff',
    shadowColor: '#000',
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
    color: '#2d0a4e',
    fontWeight: '500',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
  },
});

export default styles;
