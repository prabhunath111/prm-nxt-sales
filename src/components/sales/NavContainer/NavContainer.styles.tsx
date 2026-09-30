import { StyleSheet, ViewStyle } from 'react-native';
import { Colors, Sizing } from 'styles';

interface Styles {
  navContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  navContainer: {
    flexDirection: 'row',
    gap: Sizing.x10,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    backgroundColor: Colors.neutral.white,
  },
});

export default styles;
