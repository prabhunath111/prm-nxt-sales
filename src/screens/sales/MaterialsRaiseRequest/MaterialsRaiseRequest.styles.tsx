import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  flex: { flex: Sizing.layout.x1 },
  partnerScreen: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x12,
  },
  partnerScreen_md: {
    alignSelf: 'center',
  },
  partnerScreen_lg: {
    alignSelf: 'center',
  },
  partnerScreenmd_xl: {
    alignSelf: 'center',
  },
  container: {
    paddingVertical: Sizing.layout.x12,
    paddingTop: Sizing.layout.x12,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x12,
  },
  container_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  container_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  container_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer_md: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
    gap: Sizing.layout.x40,
  },
  buttonContainer_lg: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
    gap: Sizing.layout.x40,
  },
  buttonContainer_xl: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
    gap: Sizing.layout.x40,
  },
  buttonStyle: {
    paddingVertical: Sizing.layout.x0,
    minHeight: Sizing.layout.x40,
    // width: Sizing.layout.x100,
  },
  buttonStyle_md: {},
  buttonStyle_lg: {},
  buttonStyle_xl: {},
  tableHeader: {
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g150,
    borderTopLeftRadius: Outlines.borderRadius.smallMedium,
    borderTopRightRadius: Outlines.borderRadius.smallMedium,
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x8,
    backgroundColor: Colors.violet.v50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    ...Typography.semibold.x14,
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizing.layout.x8,
    borderBottomWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g150,
  },
  addContainer: {
    width: Sizing.layout.x120,
    height: Sizing.layout.x40,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g150,
    borderRadius: Outlines.borderRadius.smallMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainerStyle: {
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g150,
    borderBottomLeftRadius: Outlines.borderRadius.smallMedium,
    borderBottomRightRadius: Outlines.borderRadius.smallMedium,
  },
  addText: {
    ...Typography.medium.x16,
    color: Colors.primary.brand,
  },
  productName: {
    ...Typography.medium.x16,
  },
  iconContainer: {
    width: Sizing.layout.x32,
    height: Sizing.layout.x32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -Sizing.layout.x5,
    right: -Sizing.layout.x5,
    backgroundColor: Colors.appColors.lightPurple,
    borderRadius: Sizing.layout.x9,
    width: Sizing.layout.x18,
    height: Sizing.layout.x18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x600,
    ...Typography.fontName.medium,
  },
  cartcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x12,
  },
  plusMinus: {
    ...Typography.fontSize.x24,
    ...Typography.fontWeight.x300,
  },
  addSubtractContainer: {
    width: Sizing.layout.x120,
    height: Sizing.layout.x40,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g150,
    borderRadius: Outlines.borderRadius.smallMedium,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  plusMinusContainer: {
    backgroundColor: Colors.neutral.g70,
    height: Sizing.layoutP.xp100,
    width: Sizing.layout.x32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
