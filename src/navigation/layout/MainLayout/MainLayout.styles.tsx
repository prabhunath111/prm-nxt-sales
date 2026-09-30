import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';
import { getFullScreenHeight } from 'styles/dimentionHelper';

const styles = StyleSheet.create({
  nav: {
    flexGrow: Sizing.layout.x1,
    width: 'auto',
    height: getFullScreenHeight(),
  },
  innerContainer: {
    flex: Sizing.layout.x1,
    justifyContent: 'flex-start',
  },
});

export default styles;
