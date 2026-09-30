import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing } from 'styles';

const styles = StyleSheet.create({
  rightBorderStyle: {
    borderRightWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g200,
  },
  bottomSeprator: {
    height: Sizing.layout.x1,
    backgroundColor: Colors.neutral.g250,
    marginVertical: Sizing.layout.x5,
  },
  rightSeparator: {
    width: Sizing.layout.x1,
    backgroundColor: Colors.neutral.g250,
    marginHorizontal: Sizing.layout.x5,
  },
});

export default styles;
