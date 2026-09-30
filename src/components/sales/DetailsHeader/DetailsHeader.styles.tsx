import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.violet.v250,
    paddingVertical: Sizing.layout.x2,
    paddingHorizontal: Sizing.layout.x6,
  },
  container_md: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap', // in case of narrow width
    backgroundColor: Colors.violet.v250,
    paddingVertical: Sizing.layout.x2,
    paddingHorizontal: Sizing.layout.x24,
    width: '100%',
  },
  container_lg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: Colors.violet.v250,
    paddingVertical: Sizing.layout.x2,
    paddingHorizontal: Sizing.layout.x24,
    width: '100%',
  },
  container_xl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: Colors.violet.v250,
    paddingVertical: Sizing.layout.x2,
    paddingHorizontal: Sizing.layout.x24,
    width: '100%',
  },

  detailsContainer: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
    flex: 1,
  },
  detailsContainer_md: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizing.layout.x10,
    flex: 1, // Fill the container so justifyContent works
  },
  detailsContainer_lg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizing.layout.x10,
    flex: 1,
  },
  detailsContainer_xl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizing.layout.x10,
    flex: 1,
  },

  subContainer: {
    paddingHorizontal: Sizing.layout.x8,
    gap: Sizing.layout.x8,
    flexDirection: 'row',
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.violet.v300,
    minWidth: Sizing.layout.x200,
  },
  subContainer_md: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x4,
    flexGrow: 0,
    flexBasis: 'auto',
    width: 'auto',
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.violet.v300,
  },
  subContainer_lg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x4,
    flexGrow: 0,
    flexBasis: 'auto',
    width: 'auto',
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.violet.v300,
  },
  subContainer_xl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x4,
    flexGrow: 0,
    flexBasis: 'auto',
    width: 'auto',
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.violet.v300,
  },

  titleText: {
    ...Typography.fontSize.x10,
    ...Typography.fontName.regular,
    ...Typography.lineHeight.x16,
    color: Colors.neutral.white,
  },
  valueText: {
    ...Typography.fontSize.x10,
    ...Typography.fontName.semibold,
    ...Typography.lineHeight.x16,
    color: Colors.neutral.white,
  },
  valueTextWeb: {
    ...Typography.fontSize.x10,
    ...Typography.fontName.regular,
    ...Typography.lineHeight.x16,
    color: Colors.neutral.white,
  },
  version: {
    ...Typography.fontSize.x12,
    ...Typography.fontName.regular,
    color: Colors.neutral.white,
  },
  textContainer: {
    borderRightWidth: Sizing.layout.x1,
    borderRightColor: Colors.violet.v300,
    paddingRight: Sizing.layout.x6,
    // flex: 1,
  },
  itemTextContainer: {
    flexDirection: 'column',
    paddingRight: Sizing.layout.x6,
    flex: 1,
  },
  versionContainer: {
    justifyContent: 'center',
    paddingLeft: Sizing.layout.x6,
  },
  textContainer_md: {
    flexDirection: 'row',
    paddingRight: Sizing.layout.x16, // reduced from x30 for consistent look
    borderRightWidth: 0,
    borderRightColor: Colors.violet.v300,
    flexGrow: 0,
    flexBasis: 'auto',
    width: 'auto',
  },
  versionContainer_md: {
    // Reset for desktop
    flexGrow: 0,
    flexBasis: 'auto',
    width: 'auto',
  },

  textContainer_lg: {
    flexDirection: 'row',
    paddingRight: Sizing.layout.x16,
    borderRightWidth: 0,
    borderRightColor: Colors.violet.v300,
    flexGrow: 0,
    flexBasis: 'auto',
    width: 'auto',
  },
  versionContainer_lg: {
    flexGrow: 0,
    flexBasis: 'auto',
    width: 'auto',
  },

  textContainer_xl: {
    flexDirection: 'row',
    paddingRight: Sizing.layout.x16,
    borderRightWidth: 0,
    borderRightColor: Colors.violet.v300,
    flexGrow: 0,
    flexBasis: 'auto',
    width: 'auto',
  },
});

export default styles;
