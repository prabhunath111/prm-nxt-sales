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
    maxWidth: Sizing.layoutP.xp27,
    marginBottom: Sizing.layout.x10,
  },
  container_xl: {
    maxWidth: Sizing.layoutP.xp27,
    marginBottom: Sizing.layout.x10,
  },
  textContainerStyle: {
    padding: Sizing.layout.x8,
    gap: Sizing.layout.x5,
  },
  itemContainerStyle: {
    flexDirection: 'row',
    gap: Sizing.layout.x5,
  },
  itemContainerStyle_lg: {
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
  buttonStyle: {
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x0,
    minHeight: Sizing.layout.x25,
    minWidth: Sizing.layoutP.xp35,
    flexShrink: Sizing.flexSize.x100,
  },
  primaryButtonStyle: {
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x0,
    minHeight: Sizing.layout.x25,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  iconStyle: {
    tintColor: Colors.primary.brand,
    padding: Sizing.layout.x0,
    marginTop: Sizing.layout.x3,
  },
  primaryIconStyle: {
    tintColor: Colors.neutral.white,
    padding: Sizing.layout.x0,
    marginTop: Sizing.layout.x2,
  },
});

export default styles;
