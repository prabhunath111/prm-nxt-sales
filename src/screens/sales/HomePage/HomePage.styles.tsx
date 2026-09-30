import { StyleSheet } from 'react-native';
import { Colors, Sizing } from 'styles';
import { getFullScreenWidth } from 'styles/dimentionHelper';

const styles: any = StyleSheet.create({
  container: {
    flex: Sizing.flexSize.x100,
    height: Sizing.layoutP.xp70,
  },
  carouselContainer: {
    paddingHorizontal: Sizing.layout.x10,
    paddingTop: Sizing.layout.x5,
    backgroundColor: Colors.violet.darkViolet,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Sizing.layout.x5,
    backgroundColor: '#564372',
    borderRadius: Sizing.layout.x10,
  },
  iconItem: {
    width: Sizing.layoutP.xp50,
    height: Sizing.layout.x60,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.transparent.darkGray,
    zIndex: 1,
  },
  buttonContainer: {
    marginVertical: Sizing.layout.x20,
    marginHorizontal: Sizing.layout.x10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    maxWidth: Sizing.layout.x300,
  },
  gradientContainer: {
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp100,
    padding: Sizing.layout.x10,
  },
  actionTileCardContainerStyle: {
    // gap: Sizing.layout.x2,
    padding: Sizing.layout.x5,
  },

  gradientContainerWeb: {
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp50,
    padding: Sizing.layout.x10,
  },
  subContainer: {
    width: getFullScreenWidth() * 0.6,
  },
  subContainer_sm: {
    width: getFullScreenWidth(),
    height: Sizing.layoutP.xp54,
  },
  subContainer_xs: {
    width: getFullScreenWidth() * 0.97,
    height: Sizing.layoutP.xp55,
  },
  carouselContainerWeb: {
    paddingHorizontal: Sizing.layout.x10,
    paddingTop: Sizing.layout.x10,
  },
  gradientContainerWeb_sm: {
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp80,
    padding: Sizing.layout.x10,
  },
  carouselContainerWeb_sm: {
    paddingHorizontal: Sizing.layout.x10,
    paddingTop: Sizing.layout.x10,
  },
  buttonContainerWeb: {
    marginVertical: Sizing.layout.x10,
    marginHorizontal: Sizing.layout.x5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonSubContainer: {
    width: getFullScreenWidth() * 0.6,
  },
  buttonSubContainer_sm: {
    width: getFullScreenWidth(),
  },
  buttonSubContainer_xs: {
    width: getFullScreenWidth(),
  },
  iconItemWeb: {
    width: Sizing.layoutP.xp50,
    height: Sizing.layout.x50,
    display: 'flex',
    flexWrap: 'wrap',
    gap: Sizing.layout.x10,
  },
  iconItemWeb_sm: {
    width: Sizing.layoutP.xp48,
    marginRight: Sizing.layoutP.xp2,
    height: Sizing.layout.x60,
    gap: Sizing.layout.x10,
  },
  iconItemWeb_xs: {
    width: Sizing.layoutP.xp48,
    marginRight: Sizing.layoutP.xp2,
    height: Sizing.layout.x60,
    gap: Sizing.layout.x10,
  },
  actionTileCardContainerStyleWeb: {
    gap: Sizing.layout.x10,
    padding: Sizing.layout.x5,
    width: Sizing.layoutP.xp100,
  },
  carousel: {
    alignItems: 'center',
  },
  liveNewsCardContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  }
});

export default styles;
