import { StyleSheet } from 'react-native';
import { Colors, Forms, Typography } from 'styles';

const styles = StyleSheet.create({
  balanceContainer: {
    ...Forms.commonContainer.purpleBg,
  },
  iconStyle: {
    resizeMode: 'contain',
  },
  headerTextStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  balanceTextStyle: {
    ...Typography.medium.x18,
  },
});

export default styles;
