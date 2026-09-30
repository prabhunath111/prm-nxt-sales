import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing } from 'styles';

const styles = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x16,
  },
  textContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  cardContainer: {
    width: Sizing.layoutP.xp100,
    paddingLeft: Sizing.layout.x10,
    paddingRight: Sizing.layout.x10,
  },
  cardWrapper: {
    padding: Sizing.layout.x12,
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
  containerInputTextStyle: {
    padding: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x12,
    paddingRight: Sizing.layout.x8,
  },
  inputContainer: {
    minWidth: Sizing.layoutP.xp30,
  },
});

export default styles;
