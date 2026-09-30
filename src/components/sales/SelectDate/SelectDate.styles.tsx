import { StyleSheet } from 'react-native';
import { Colors, Sizing } from 'styles';

const styles = StyleSheet.create({
  container: {
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g200,
    borderRadius: Sizing.layout.x6,
    paddingHorizontal: Sizing.layout.x4,
    width: Sizing.layoutP.xp100,
  },
  inputWrapper: {
    borderWidth: Sizing.layout.x0,
    padding: Sizing.layout.x0,
    margin: Sizing.layout.x0,
    width: Sizing.layoutP.xp100,
  },
  iconInputContainer: {
    borderBottomWidth: Sizing.layout.x0,
  },
});

export default styles;
