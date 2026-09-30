import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing } from 'styles';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    margin: Sizing.layoutP.xp4,
    overflow: 'hidden',
    maxHeight: getFullScreenHeight() - Sizing.layout.x80,
    ...(isWeb && { maxHeight: 'auto' }),
  },
  centerElement: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
