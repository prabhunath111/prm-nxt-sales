import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.layout.x1,
    alignItems: 'center',
  },
  subContainer: {
    flex: Sizing.layout.x1,
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x20,
  },
  packDetailsContainer: {
    flexDirection: 'row',
  },
  packDetails: {
    gap: Sizing.layout.x8,
    alignItems: 'center',
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.neutral.g150,
    paddingVertical: Sizing.layout.x2,
    paddingHorizontal: Sizing.layout.x25,
    marginVertical: Sizing.layout.x16,
  },
  packDetails_md: {
    paddingHorizontal: Sizing.layout.x50,
    marginVertical: Sizing.layout.x30,
  },
  packDetails_lg: {
    paddingHorizontal: Sizing.layout.x80,
    marginVertical: Sizing.layout.x30,
  },
  packDetails_xl: {
    paddingHorizontal: Sizing.layout.x130,
    marginVertical: Sizing.layout.x30,
  },
  primaryText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    color: Colors.violet.darkViolet,
    marginBottom: Sizing.layout.x7,
  },
  secondaryText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    color: Colors.violet.darkViolet,
  },
  packText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.g600,
  },
  packCount: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x18,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.g550,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  ottApps: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.primary.brand,
  },
  separator: {
    borderTopWidth: Sizing.layout.x1,
    borderTopColor: Colors.neutral.g150,
    backgroundColor: Colors.neutral.g20,
    width: Sizing.layoutP.xp85,
    alignSelf: 'center',
  },
  cardStyle: {
    ...Outlines.shadow.thick,
  },
  accordionStyle: {
    alignSlef: 'flex-start',
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x0,
    paddingHorizontal: Sizing.layout.x0,
  },
  accoodianButtonStyle: {
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: Sizing.layout.x16,
  },
  textContainer: {
    paddingHorizontal: Sizing.layout.x22,
    paddingVertical: Sizing.layout.x16,
  },
  listStyle: {
    gap: Sizing.layout.x0,
  },
  ottName: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.g750,
    marginBottom: Sizing.layout.x12,
  },
  detailsText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x12,
    ...Typography.fontWeight.x400,
    color: Colors.neutral.black,
  },
  appDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizing.layout.x10,
    gap: Sizing.layout.x4,
  },
  accordionContainer: {
    width: Sizing.layoutP.xp100,
  },
  accordionContainer_md: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  accordionContainer_lg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  accordionContainer_xl: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

export default styles;
