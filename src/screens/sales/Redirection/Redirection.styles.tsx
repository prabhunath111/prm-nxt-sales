import { StyleSheet } from 'react-native';
import { Colors, Sizing } from 'styles';
import { getScreenHeight } from 'styles/dimentionHelper';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.transparent.clear,
    padding: Sizing.layout.x20,
    width: Sizing.layoutP.xp100,
    height: getScreenHeight(),
  },
});

export default styles;
