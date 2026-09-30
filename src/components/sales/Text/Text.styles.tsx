import { StyleSheet } from 'react-native';
import { Colors, Typography, Forms } from 'styles';

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
  },
  label: {
    ...Typography.fontSize.x10,
    color: Colors.neutral.black,
    textAlignVertical: 'center',
  },
  required: {
    ...Forms.formField.required,
    ...Typography.fontSize.x20,
    position: 'absolute',
  },
  requiredStart: {
    ...Forms.formField.required,
    ...Typography.fontSize.x20,
  },
});

export default styles;
