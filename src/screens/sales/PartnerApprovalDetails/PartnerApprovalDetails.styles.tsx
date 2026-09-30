import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    justifyContent: 'space-between',
  },
  detailsContainer: {
    paddingHorizontal: Sizing.layout.x12,
    paddingTop: Sizing.layout.x12,
  },
  detailsContainer_md: {
    maxWidth: Sizing.layout.x360,
    minWidth: Sizing.layout.x360,
    alignSelf: 'center',
  },
  detailsContainer_lg: {
    maxWidth: Sizing.layout.x360,
    minWidth: Sizing.layout.x360,
    alignSelf: 'center',
  },
  detailsContainer_xl: {
    maxWidth: Sizing.layout.x360,
    minWidth: Sizing.layout.x360,
    alignSelf: 'center',
  },
  buttonStyle: {
    flex: Sizing.flexSize.x100,
  },
  buttonStyle_md: {
    flex: Sizing.flexSize.x100,
    maxWidth: Sizing.layout.x165,
  },
  buttonStyle_lg: {
    flex: Sizing.flexSize.x100,
    maxWidth: Sizing.layout.x165,
  },
  buttonStyle_xl: {
    flex: Sizing.flexSize.x100,
    maxWidth: Sizing.layout.x165,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    ...Typography.lineHeight.x20,
    color: Colors.violet.darkViolet,
    minWidth: Sizing.layout.x120,
  },
  secondaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x14,
    ...Typography.fontWeight.x500,
    ...Typography.lineHeight.x20,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x1,
  },
  textWrapper: {
    flexDirection: 'row',
  },
  primaryIconStyle: {
    tintColor: Colors.neutral.white,
  },
  secondaryIconStyle: {
    tintColor: Colors.primary.brand,
  },
  cardContainer: {
    ...Forms.shadowContainer.secondary,
    backgroundColor: Colors.neutral.white,
    flexGrow: Sizing.flexSize.x100,
    borderRadius: Outlines.borderRadius.baseMedium,
    marginBottom: Sizing.layout.x10,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.violet.borderGrey,
    padding: Sizing.layout.x8,
  },
  headingTextStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x600,
    color: Colors.violet.v400,
    marginVertical: Sizing.layout.x6,
  },
});

export default styles;
