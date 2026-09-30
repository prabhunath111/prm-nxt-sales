import { StyleSheet } from 'react-native';
import { Forms, Sizing, Typography, Colors } from 'styles';

const styles = StyleSheet.create<any>({
  inputStyle: {
    ...Forms.formField.primary,
    minHeight: Sizing.layout.x19,
    borderRadius: Sizing.x2,
    borderWidth: 0.5,
    borderColor: Colors.neutral.g400,
    width: Sizing.layout.x32,
  },
  inputStyle_xs: {
    width: Sizing.layout.x40,
    fontSize: Sizing.layout.x10,
  },
  inputStyle_sm: {
    width: Sizing.layout.x40,
    fontSize: Sizing.layout.x10,
  },
  textStyle: {
    ...Typography.fontSize.x12,
    // ...Typography.lineHeight.x12,
    color: Colors.neutral.black,
    fontFamily: Typography.fontName.regular.fontFamily,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // flexGrow: Sizing.flexSize.x100, // Allows the cell to expand as needed
    flexShrink: Sizing.flexSize.x100, // Prevents content from overflowing
    flexBasis: 'auto', // Adjusts width based on content
    maxWidth: Sizing.layoutP.xp100, // Prevents exceeding the container
    overflow: 'hidden', // Ensures no content overflow
    textOverflow: 'ellipsis', // Adds "..." if space is limited
    whiteSpace: 'normal', // Allows text to wrap to the next line
    flexWrap: 'wrap', // Enables multi-line wrapping
    textAlign: 'left', // Ensures proper alignment
  },
  cellGroupStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.x15,
    flex: 1,
  },
  cellGroupIconStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.x2,
  },
  centeredText: {
    textAlign: 'center',
  },
  statusText: {
    textAlign: 'center',
    color: Colors.appColors.darkGreen,
  },
});

export default styles;
