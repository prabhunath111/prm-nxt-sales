import { StyleSheet } from 'react-native';
import { Sizing, Colors } from 'styles';
import { getScreenWidth } from 'styles/dimentionHelper';

const screenWidth = getScreenWidth();

const styles = StyleSheet.create({
  container: {
    flex: Sizing.layout.x1,
    backgroundColor: Colors.neutral.white,
  },
  innerContainer: {
    paddingHorizontal: screenWidth <= Sizing.layout.x500 ? Sizing.layout.x8 : null,
    marginTop: Sizing.layout.x16,
    width: screenWidth <= Sizing.layout.x500 ? Sizing.layoutP.xp100 : Sizing.layoutP.xp60,
    alignSelf: 'center',
    gap: Sizing.layout.x16,
  },
  gradientStyle: {
    borderRadius: Sizing.layout.x5,
  },
  textStyle: {
    color: Colors.neutral.white,
  },
  informationStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Sizing.layout.x8,
  },
});

export default styles;
