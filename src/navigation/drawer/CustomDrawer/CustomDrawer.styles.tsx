import { StyleSheet, TextStyle } from 'react-native';
import { Sizing, Colors } from 'styles';

interface Styles {
  container: TextStyle;
  scrollContainer: TextStyle;
  listContainer: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: Colors.neutral.g200,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.neutral.g200,
    paddingTop: Sizing.x10,
    height: Sizing.x250,
  },
});

export default styles;
