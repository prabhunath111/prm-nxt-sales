import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },
  detailsCardContainer: {
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_xs: {
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_sm: {
    padding: Sizing.layout.x0,
  },
  detailsCardContainer_md: {
    width: Sizing.layoutP.xp80,
    padding: Sizing.layout.x0,
    alignSelf: 'center',
  },
  detailsCardContainer_lg: {
    width: Sizing.layoutP.xp80,
    padding: Sizing.layout.x14,
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    width: Sizing.layoutP.xp80,
    padding: Sizing.layout.x14,
    alignSelf: 'center',
  },
  paddingContainer: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
    marginBottom: screenWidth > Sizing.layout.x1024 ? Sizing.layoutP.xp8 : Sizing.layoutP.xp20,
  },
  paddingContainer_xs: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_sm: {
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_md: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_lg: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_xl: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x8,
    paddingTop: Sizing.layout.x16,
  },
  card: {
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
    flex: 1,
  },
  cardDropdown: {
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
  cardDropdown2: {
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
    // flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizing.layout.x8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Sizing.layout.x0,
    ...Forms.buttonContainer.shadowContainer,
    paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x12,
    gap: Sizing.layout.x5,
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_xs: {
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_sm: {
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_md: {
    width: Sizing.layoutP.xp40,
  },
  buttonInnerContainer_lg: {
    width: Sizing.layoutP.xp40,
    minWidth: Sizing.layout.x250,
  },
  buttonInnerContainer_xl: {
    width: Sizing.layoutP.xp40,
    minWidth: Sizing.layout.x250,
  },
  innerDropDown: {
    borderBottomWidth: Outlines.borderWidth.base,
    borderBottomColor: Colors.neutral.g300,
    padding: Sizing.layout.x6,
  },
  innerDropDownBig: {
    borderBottomWidth: Outlines.borderWidth.base,
    borderBottomColor: Colors.neutral.g300,
    padding: Sizing.layout.x2,
    marginBottom: Sizing.layout.x4,
  },
  label: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x500,
    color: Colors.violet.v400,
  },
  paddingBottom: {
    margin: Sizing.layout.x4,
  },

  buttonView: {
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x10,
  },
  buttonView_xs: {
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x10,
  },
  buttonView_sm: {
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x10,
  },
  buttonView_md: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x20,
  },
  buttonView_lg: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x20,
  },
  buttonView_xl: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x20,
  },
  button: {
    minWidth: Sizing.layout.x200,
  },
  addGap: {
    gap: Sizing.layout.x12,
  },
  smallPadding: {
    padding: Sizing.layout.x4,
    paddingBottom: Sizing.layout.x4,
  },
  largePadding: {
    padding: Sizing.layout.x8,
  },
  errorText: {
    color: Colors.appColors.lightRed,
    fontSize: Sizing.layout.x12,
    marginTop: Sizing.layout.x4,
  },
});

export default styles;
