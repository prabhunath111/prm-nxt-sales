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
    paddingVertival: Sizing.layout.x12,
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
  },
  buttonContainer_md: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  buttonContainer_lg: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  buttonContainer_xl: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  buttonStyle: {
    paddingVertical: Sizing.layout.x0,
    minHeight: Sizing.layout.x30,
  },
  buttonStyle_md: {
    minWidth: Sizing.layoutP.xp50,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layoutP.xp40,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layoutP.xp30,
  },
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
    borderLeftWidth: Sizing.layout.x1,
    borderRightWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g150,
  },
  productName: {
    ...Typography.medium.x16,
  },
  addContainer: {
    width: Sizing.layout.x120,
    height: Sizing.layout.x40,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g150,
    borderRadius: Outlines.borderRadius.smallMedium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral.g70,
  },
  addText: {
    ...Typography.medium.x16,
  },
});

export default styles;
