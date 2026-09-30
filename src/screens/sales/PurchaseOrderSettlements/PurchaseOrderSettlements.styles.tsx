import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';
import { getFullScreenHeight } from 'styles/dimentionHelper';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
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
  settlementAmount: {
    ...Forms.buttonContainer.shadowContainer,
  },
  amountStyle: {
    color: Colors.appColors.frenchViolet,
    ...Typography.fontWeight.x600,
  },
  dropdownContanier: {
    flexDirection: 'row',
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x20,
    alignItems: 'center',
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x5,
  },
  buttonStyle: {
    paddingVertical: Sizing.layout.x0,
    width: Sizing.layoutP.xp20,
    alignSelf: 'center',
  },
  alignItemCenter: {
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  alignCenter: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
    gap: Sizing.layout.x2,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
    marginTop: Sizing.layout.x20,
  },
  searchContainer: {
    marginTop: Sizing.layout.x10,
  },
  heightAdjust: {
    height: getFullScreenHeight() - Sizing.layout.x500,
  },
});

export default styles;
