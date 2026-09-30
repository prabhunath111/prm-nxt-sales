import { StyleSheet } from 'react-native';
import { Colors, Sizing } from 'styles';

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
  detailsContainer: {
    marginTop: Sizing.layout.x20,
  },
  autocompleteContainer: {
    marginBottom: Sizing.layout.x20,
    gap: Sizing.layout.x20,
  },
  termAndCondition: {
    marginTop: Sizing.layout.x20,
  },
  buttonContainer: {
    marginTop: Sizing.layout.x40,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Sizing.layout.x30,
  },
});

export default styles;
