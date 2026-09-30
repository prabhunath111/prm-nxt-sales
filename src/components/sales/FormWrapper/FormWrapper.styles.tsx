import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    width: Sizing.layoutP.xp100,
    maxHeight: Sizing.layoutP.xp100,
  },
  header: {
    display: 'block',
  },
  header_md: {
    display: 'none',
  },
  header_lg: {
    display: 'none',
  },
  header_xl: {
    display: 'none',
  },
});

export default styles;
