import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x0,
    padding: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  header: {
    display: 'none',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  header_md: {
    display: 'block',
    marginTop: Sizing.layout.x5,
  },
  header_lg: {
    display: 'block',
    marginTop: Sizing.layout.x5,
  },
  header_xl: {
    display: 'block',
    marginTop: Sizing.layout.x5,
  },
});

export default styles;
