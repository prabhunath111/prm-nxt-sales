import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';
import { getScreenHeight } from 'styles/dimentionHelper';

const styles = StyleSheet.create({
  container: {
    width: Sizing.layoutP.xp100,
    maxHeight: getScreenHeight(),
  },
  webContainer: {
    height: Sizing.layoutP.xp100,
  },
  scrollContainer: {
    overflow: 'scroll', // Forces scrollbar visibility on Web
  },
});

export default styles;
