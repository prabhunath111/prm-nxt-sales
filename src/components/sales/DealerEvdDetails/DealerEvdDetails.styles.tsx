import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    ...Forms.shadowContainer.primary,
    borderColor: Colors.neutral.g250,
    borderRadius: Outlines.borderRadius.smallMedium,
    backgroundColor: Colors.neutral.white,
    marginBottom: Sizing.layout.x16,
    flexGrow: Sizing.flexSize.x100,
    height: 'auto',
    margin: Sizing.layout.x2,
    alignSelf: 'center',
    width: Sizing.layoutP.xp100,
  },
  container_lg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizing.layout.x0,
    marginVertical: Sizing.layout.x10,
    borderWidth: Sizing.layout.xDot5,
  },
  container_xl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizing.layout.x0,
    marginVertical: Sizing.layout.x10,
    borderWidth: Sizing.layout.xDot5,
  },
  textContainerStyle: {
    padding: Sizing.layout.x8,
    gap: Sizing.layout.x5,
  },
  textContainerStyle_lg: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    alignSelf: 'center',
    flexWrap: 'wrap',
    gap: Sizing.layout.x15,
  },
  textContainerStyle_xl: {
    flex: Sizing.flexSize.x100,
    flexDirection: 'row',
    alignSelf: 'center',
    flexWrap: 'wrap',
    gap: Sizing.layout.x15,
  },
  itemContainerStyle: {
    flexDirection: 'row',
    gap: Sizing.layout.x5,
  },
  itemContainerStyle_lg: {
    gap: Sizing.layout.x5,
    minWidth: Sizing.layout.x256,
  },
  itemContainerStyle_xl: {
    minWidth: Sizing.layout.x256,
    gap: Sizing.layout.x5,
  },
  primaryTextStyle: {
    ...Typography.regular.x14,
    lineHeight: Sizing.layout.x15,
    width: Sizing.layoutP.xp40,
  },
  secondaryTextStyle: {
    ...Typography.medium.x16,
    lineHeight: Sizing.layout.x15,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: Sizing.layout.x8,
    gap: Sizing.layout.x10,
    borderTopWidth: Outlines.borderWidth.thin,
    borderTopColor: Colors.neutral.g250,
  },
  buttonContainer_lg: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: Sizing.layout.x0,
    maxWidth: Sizing.layoutP.xp30,
  },
  buttonContainer_xl: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: Sizing.layout.x0,
    minWidth: Sizing.layoutP.xp30,
  },
  buttonStyle: {
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x0,
    minHeight: Sizing.layout.x20,
    maxHeight: Sizing.layout.x25,
    minWidth: Sizing.layoutP.xp35,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryButtonStyle: {
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x10,
    minHeight: Sizing.layout.x20,
    maxHeight: Sizing.layout.x25,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryButtonStyleApp: {
    paddingHorizontal: Sizing.layout.x5,
    justifyContent: 'center',
    minHeight: Sizing.layout.x20,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryButtonStyle_lg: {
    width: Sizing.layout.x200,
    maxHeight: Sizing.layout.x35,
  },
  primaryButtonStyle_xl: {
    width: Sizing.layout.x200,
    maxHeight: Sizing.layout.x35,
  },
  iconStyle: {
    tintColor: Colors.primary.brand,
    padding: Sizing.layout.x0,
    marginTop: Sizing.layout.x3,
  },
});

export default styles;
