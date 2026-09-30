import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
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
    width: Sizing.layoutP.xp50,
    padding: Sizing.layout.x0,
    marginVertical: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_lg: {
    width: Sizing.layoutP.xp50,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    width: Sizing.layoutP.xp50,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral.g50,
    marginTop: Sizing.layout.x9,
    borderRadius: 10,
  },

  walletTextContainer: {
    flex: 1,
    paddingRight: 12,
  },

  walletActionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    width: Sizing.layoutP.xp100,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer_md: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  buttonContainer_lg: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  buttonContainer_xl: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Sizing.layout.x5,
  },
  buttonStyle: {
    paddingVertical: Sizing.layout.x0,
    minHeight: Sizing.layout.x30,
  },
  buttonStyle_md: {
    minWidth: Sizing.layoutP.xp50,
  },
  buttonStyle_lg: {
    minWidth: Sizing.layoutP.xp40,
  },
  buttonStyle_xl: {
    minWidth: Sizing.layoutP.xp30,
  },
  displayName: {
    fontSize: 16,
    ...Typography.fontWeight.x400,
  },
});

export default styles;
