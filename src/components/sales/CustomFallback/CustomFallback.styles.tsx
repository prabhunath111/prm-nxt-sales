import { StyleSheet } from 'react-native';
import { Colors, Sizing } from 'styles';

const styles = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent.clear, // Set your desired background color here
  },
});

export default styles;
