import { StyleSheet } from 'react-native';
import { styles as globalStyles } from 'styles/global';
import { getFullScreenHeight, getFullScreenWidth } from 'styles/dimentionHelper';
import { Colors, Sizing } from 'styles';

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  errorStyle: {
    ...globalStyles.container,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
  },
  cameraStyle: {
    height: getFullScreenHeight(),
    width: getFullScreenWidth(),
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    bottom: getFullScreenHeight() * 0.15,
  },
  circleButton: {
    height: Sizing.layout.x70,
    width: Sizing.layout.x70,
    borderWidth: 7.5,
    borderColor: Colors.neutral.g400,
  },
});

export default styles;
