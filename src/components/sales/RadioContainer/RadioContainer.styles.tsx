import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    gap: Sizing.layout.x12,
    marginTop: Sizing.layout.x8,
  },
  radioTextStyle: {
    ...Typography.medium.x16,
    color: Colors.neutral.g750,
  },
  radioCircleStyle: {
    borderColor: Colors.primary.brand,
    height: Sizing.layout.x15,
    width: Sizing.layout.x15,
    marginTop: Sizing.layout.x0,
  },
  selectedCircleStyle: {
    backgroundColor: Colors.primary.brand,
  },
  containerStyle: {
    borderColor: Colors.primary.brand,
    borderWidth: Outlines.borderWidth.thin,
    borderRadius: Outlines.borderRadius.smallest,
    padding: Sizing.layout.x12,
    marginHorizontal: Sizing.layout.x0,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    ...Typography.regular.x14,
    ...Typography.fontWeight.x400,
    color: Colors.violet.v400,
    marginRight: Sizing.layout.x8, // spacing between text and line
  },
  line: {
    flex: Sizing.layout.x1,
    height: Sizing.layout.x1,
    backgroundColor: Colors.neutral.g250, // match the screenshot light purple
  },
});

export default styles;
