import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },
  AccoContainer: {
    paddingVertical: Sizing.x15,
    textAlign: 'center',
  },
  detailsCardContainer: {
    padding: Sizing.layout.x14,
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
    marginVertical: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_lg: {
    width: Sizing.layoutP.xp80,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    width: Sizing.layoutP.xp80,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  paddingContainer_xs: {
    paddingHorizontal: Sizing.layout.x12,
    gap: Sizing.layout.x12,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_sm: {
    paddingHorizontal: Sizing.layout.x16,
    gap: Sizing.layout.x16,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_md: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x16,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_lg: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x16,
    paddingTop: Sizing.layout.x16,
  },
  paddingContainer_xl: {
    paddingHorizontal: Sizing.layout.x0,
    gap: Sizing.layout.x16,
    paddingTop: Sizing.layout.x16,
  },
  largeContainer: {
    padding: Sizing.layout.x12,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x12,
    gap: Sizing.layout.x5,
    alignItems: 'center',
  },
  buttonInnerContainer: {
    gap: Sizing.layout.x10,
    width: screenWidth > Sizing.layout.x660 ? Sizing.layoutP.xp50 : Sizing.layoutP.xp100,
  },
  textWrapperETSK: {
    flexDirection: screenWidth > Sizing.layout.x660 ? 'row' : 'column',
    alignItems: screenWidth > Sizing.layout.x660 ? 'center' : 'stretch',
    justifyContent: screenWidth > Sizing.layout.x660 ? 'space-between' : 'center',
    gap: Sizing.layout.x10,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizing.layout.x10,
  },
  primaryInfoTextStyleRed: {
    ...Typography.medium.x16,
    ...Typography.fontWeight.x500,
    color: Colors.appColors.red,
  },
  primaryTextYourPack: {
    ...Typography.medium.x16,
    ...Typography.fontWeight.x500,
  },
  dropdownContainer: {
    marginTop: screenWidth > Sizing.layout.x660 ? Sizing.layout.x10 : Sizing.layout.x0,
  },
  dropdownText: {
    ...Typography.fontWeight.x500,
  },
  buttonContainerSelectBox: {},
});

export default styles;
