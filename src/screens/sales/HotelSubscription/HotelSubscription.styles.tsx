import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  navigationTextStyle: {
    ...Typography.medium.x18,
    color: Colors.violet.darkViolet,
    textDecorationLine: 'underline',
    marginTop: Sizing.layout.x16,
    marginLeft: Sizing.layout.x16,
  },
});

export default styles;
