import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  contentContainer: {
    flex: Sizing.layout.x1,
    borderRadius: Sizing.layout.x0,
    paddingTop: Sizing.layout.x20,
    width: Sizing.layoutP.xp100,
  },
  header: {
    display: 'none',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  header_md: {
    display: 'block',
  },
  header_lg: {
    display: 'block',
  },
  header_xl: {
    display: 'block',
  },
  cardContainer_xs: {
    paddingHorizontal: Sizing.layout.x5,
  },
  cardContainer: {
    marginVertical: Sizing.layout.x0,
    marginHorizontal: Sizing.layout.x0,
    borderRadius: Sizing.layout.x0,
    shadowColor: Colors.transparent.clear,
    paddingHorizontal: Sizing.layout.x10,
  },
  cardContainer_md: {
    paddingHorizontal: Sizing.layout.x30,
    paddingVertical: Sizing.layout.x10,
  },
  cardContainer_lg: {
    paddingHorizontal: Sizing.layout.x40,
    paddingVertical: Sizing.layout.x10,
  },
  cardContainer_xl: {
    paddingHorizontal: Sizing.layout.x40,
    paddingVertical: Sizing.layout.x10,
  },
  cardContent: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  firstCardContent_md: {
    paddingTop: Sizing.layout.x30,
  },
  firstCardContent_lg: {
    paddingTop: Sizing.layout.x30,
  },
  firstCardContent_xl: {
    paddingTop: Sizing.layout.x30,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Sizing.layoutP.xp100,
    borderBottomColor: Colors.neutral.g200,
    borderBottomWidth: Outlines.borderWidth.thin,
    padding: Sizing.layout.x10,
    gap: Sizing.layout.x10,
  },
  detailsContainer: {
    flexShrink: Sizing.layout.x1,
  },
  textWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Sizing.layout.x5,
    gap: Sizing.layout.x2,
  },
  primaryText: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.regular,
    ...Typography.lineHeight.x20,
  },
  secondaryText: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.medium,
    ...Typography.lineHeight.x20,
    color: Colors.neutral.black,
    flexShrink: Sizing.layout.x1,
  },
  reverseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  reverseButton_sm: {
    minHeight: Sizing.layout.x30,
  },
  reverseButton_xs: {
    minHeight: Sizing.layout.x30,
  },
  backButton: {
    marginHorizontal: Sizing.layoutP.xp4,
    margin: Sizing.layout.x40,
  },
  listContainer: {
    marginHorizontal: Sizing.layoutP.xp4,
    borderRadius: Outlines.borderRadius.small,
    overflow: 'hidden',
  },
});

export default styles;
