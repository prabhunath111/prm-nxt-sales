import { StyleSheet } from 'react-native';
import * as Sizing from './sizing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    gap: Sizing.layout.x10,
  },
  columnContainer: {
    gap: Sizing.layout.x10,
  },
});
