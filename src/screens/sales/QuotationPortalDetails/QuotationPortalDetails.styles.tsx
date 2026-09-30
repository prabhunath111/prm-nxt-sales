import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing, Typography } from 'styles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },
  titleText: {
    ...Typography.fontSize.x22,
    ...Typography.fontWeight.x600,
    color: Colors.appColors.hotPink,
    textAlign: 'center',
    paddingVertical: Sizing.layout.x24,
  },
  card: {
    width: screenWidth <= Sizing.layout.x660 ? Sizing.layoutP.xp100 : Sizing.layoutP.xp60,
    backgroundColor: Colors.neutral.white,
    borderRadius: Sizing.layout.x10,
    elevation: Sizing.layout.x5,
    shadowColor: Colors.neutral.black,
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x10,
    alignSelf: 'center',
    marginBottom: Sizing.layout.x24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Sizing.layout.x18,
    paddingVertical: Sizing.layout.x14,
    borderBottomWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g350,
    backgroundColor: Colors.violet.v50,
  },

  headerTitle: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x700,
    color: Colors.neutral.black,
  },

  headerPrice: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x700,
    color: Colors.neutral.black,
  },
  subHeader: {
    padding: Sizing.layout.x14,
    borderBottomWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g250,
  },

  subHeaderText: {
    ...Typography.fontSize.x16,
    ...Typography.fontWeight.x600,
    textAlign: 'center',
    color: Colors.neutral.black,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x18,
    borderBottomWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g250,
  },

  rowLabel: {
    ...Typography.fontSize.x14,
    color: Colors.neutral.g550,
  },

  rowValue: {
    ...Typography.fontSize.x14,
    color: Colors.neutral.g550,
  },

  footerNote: {
    fontSize: Sizing.layout.x11,
    color: Colors.neutral.g600,
    width: Sizing.layoutP.xp90,
    marginTop: Sizing.layout.x20,
    textAlign: 'center',
  },
  image: {
    width: Sizing.layout.x100,
    height: Sizing.layout.x30,
  },
  imageLarge: {
    width: Sizing.layout.x300,
    height: Sizing.layout.x100,
  },
  imageContainer: {
    paddingHorizontal: Sizing.layout.x16,
  },
  outerContainer: {
    paddingHorizontal: Sizing.layout.x24,
    alignItems: 'center',
    marginBottom: Sizing.layout.x32,
    justifyContent: 'center',
  },
  containerCenter: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: Sizing.layout.x24,
    color: Colors.neutral.black,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: Sizing.layout.x1,
  },
  infoIcon: {
    tintColor: Colors.neutral.g500,
    marginLeft: Sizing.layout.x4,
  },
});

export default styles;
