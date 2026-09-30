import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';
import { getFullScreenHeight } from 'styles/dimentionHelper';
import { platform } from 'utils/platformHelper';

const styles = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: Sizing.layoutP.xp100,
    gap: Sizing.layout.x16,
  },
  cardContainer: {
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x8,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: Sizing.layout.x0, height: Sizing.layout.x2 },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x4,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    borderWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g150,
  },
  textContainer: { flexDirection: 'column' },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  primaryText: {
    flexBasis: Sizing.layoutP.xp50,
    textAlign: 'left',
    ...Typography.fontWeight.x500,
  },
  secondaryText: {
    flexBasis: Sizing.layoutP.xp50,
    textAlign: 'left',
    flexShrink: Sizing.layout.x1,
    flexWrap: 'wrap',
  },
  horizontalSeparator: {
    borderBottomWidth: Sizing.layout.x1,
    width: Sizing.layoutP.xp100,
    borderColor: Colors.neutral.g250,
    marginVertical: Sizing.layout.x6,
  },
  viewStyle: {
    color: Colors.violet.violetPink,
    flexDirection: 'row',
    gap: Sizing.layout.x5,
    ...Typography.fontWeight.x300,
    alignSelf: 'center',
  },
  viewStyle2: {
    textAlign: 'center',
    marginBottom: Sizing.layout.x5,
  },
  fixedHeight: {
    // ...(platform().OS === 'web' && {
    //   height: getFullScreenHeight() - Sizing.layout.x300,
    //   marginBottom: Sizing.layout.x20,
    // }),
    flex: Sizing.flexSize.x100,
    width: Sizing.layoutP.xp100,
    minHeight: Sizing.layout.x0,
  },
  tableContainer: {
    flex: Sizing.flexSize.x100,
    width: Sizing.layoutP.xp100,
    ...(platform().OS === 'web' && {
      minHeight: getFullScreenHeight() * 0.6,
      maxHeight: getFullScreenHeight() * 0.8,
    }),
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
