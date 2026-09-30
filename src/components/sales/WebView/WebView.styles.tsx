import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  webViewContainer: {
    position: 'absolute',
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp100,
    zIndex: Sizing.layout.x1,
  },
  container: {
    flex: Sizing.layout.x1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.fontSize.x16,
    color: Colors.error.primary,
  },
});

export default styles;
