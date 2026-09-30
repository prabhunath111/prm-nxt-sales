import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';
import { getFullScreenHeight, getFullScreenWidth } from 'styles/dimentionHelper';

const styles = StyleSheet.create({
  nav: {
    flex: Sizing.layout.x1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    height: getFullScreenHeight(),
    width: getFullScreenWidth(),
  },
});

export default styles;
