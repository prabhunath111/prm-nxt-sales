import { StyleSheet } from 'react-native';
import { Colors, Sizing } from 'styles';

const styles: any = StyleSheet.create({
  mainContainer: {
    flex: Sizing.flexSize.x100,
    height: Sizing.layoutP.xp60,
    alignSelf: 'center',
  },
  mainContainer_lg: {
    flex: Sizing.flexSize.x100,
    height: Sizing.layoutP.xp50,
    width: Sizing.layoutP.xp60,
  },
  mainContainer_md: {
    flex: Sizing.flexSize.x100,
    height: Sizing.layoutP.xp50,
    width: Sizing.layoutP.xp60,
  },
  mainContainer_sm: {
    width: Sizing.layoutP.xp100,
  },
  mainContainer_xs: {
    width: Sizing.layoutP.xp100,
  },
  carouselContainer: {
    paddingHorizontal: Sizing.layout.x10,
    paddingTop: Sizing.layout.x10,
    // backgroundColor: Colors.violet.darkViolet,
  },

  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Sizing.layout.x10,
    backgroundColor: '#F7F4FC',
    borderRadius: Sizing.layout.x10,
  },
  iconItem: {
    width: Sizing.layoutP.xp50,
    height: Sizing.layout.x70,
  },

  container: {
    margin: Sizing.layout.x16,
    borderRadius: Sizing.layout.x12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: Sizing.layout.x4,
    elevation: Sizing.layout.x2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizing.layout.x16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: Sizing.layout.x12,
    fontSize: Sizing.layout.x16,
    color: '#2d0a4e',
    fontWeight: '500',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
  },

  card: {
    backgroundColor: '#4B0082', // Dark Violet background
    padding: 16,
    borderRadius: 12,
    margin: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLeft: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subText: {
    color: '#fff',
    fontSize: 14,
  },
  bold: {
    color: '#fff',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#FF69B4', // Pink button
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  secondaryButton: {
    backgroundColor: '#E75480', // Slightly different pink
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.transparent.darkGray,
    zIndex: 1,
  },
});

export default styles;
