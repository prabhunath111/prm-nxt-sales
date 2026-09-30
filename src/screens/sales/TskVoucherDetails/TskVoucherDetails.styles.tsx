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
  tskPinCard: {
    marginTop: Sizing.layout.x20,
    width: screenWidth > Sizing.layout.x660 ? Sizing.layoutP.xp70 : Sizing.layoutP.xp95,
    alignSelf: 'center',
  },
  detailsBlock: {
    overflow: 'hidden',
    marginTop: Sizing.layout.x10,
    width: screenWidth > Sizing.layout.x660 ? Sizing.layoutP.xp70 : Sizing.layoutP.xp95,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  detailsCard: {
    ...Forms.commonContainer.purpleBg,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  primaryText: {
    minWidth: Sizing.layout.x200,
    color: Colors.neutral.black,
  },
  secondaryText: {
    textAlign: 'left',
    color: Colors.neutral.black,
    ...Typography.medium.x12,
  },
  headerText: {
    ...Typography.medium.x16,
    ...Typography.fontWeight.x500,
    color: Colors.neutral.black,
  },
  textWrapperETSK: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizing.layout.x10,
  },
  textWrapperETSK_xs: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  textWrapperETSK_sm: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  buttonInnerContainer: {
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp30,
  },
  buttonInnerContainer_xs: {
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_sm: {
    width: Sizing.layoutP.xp100,
  },
  buttonInnerContainer_md: {
    width: Sizing.layoutP.xp50,
  },
  buttonInnerContainer_lg: {
    minWidth: Sizing.layout.x250,
  },
  buttonInnerContainer_xl: {
    minWidth: Sizing.layout.x250,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    paddingVertical: Sizing.layout.x16,
    gap: Sizing.layout.x5,
    alignItems: 'center',
  },
});

export default styles;
