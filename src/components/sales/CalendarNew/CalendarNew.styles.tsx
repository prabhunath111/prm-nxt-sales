import { Platform, StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  calenderView: {
    width: Sizing.layoutP.xp100,
    borderWidth: Sizing.layout.x1,
    borderRadius: Sizing.layout.x12,
    padding: Sizing.layout.x16,
    borderColor: Colors.neutral.g250,
  },
  icon: {
    tintColor: Colors.appColors.pink,
  },
  markedDate: {
    borderWidth: Sizing.layout.x2,
    borderColor: Colors.appColors.pink, // Tailwind blue-500
    borderRadius: Sizing.layout.x18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  selectedText: {
    color: Colors.neutral.black,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', // consistent width
    ...Typography.fontSize.x16,
  },
});

export default styles;
