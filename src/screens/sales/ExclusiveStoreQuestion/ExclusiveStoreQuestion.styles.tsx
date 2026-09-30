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
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  section: {
    marginBottom: Sizing.layout.x32,
  },
  sectionTitle: {
    fontSize: Sizing.layout.x18,
    ...Typography.fontWeight.x800,
    color: Colors.violet.v500,
    marginBottom: Sizing.layout.x12,
  },
  questionCard: {
    backgroundColor: Colors.violet.v50,
    borderRadius: Sizing.layout.x10,
    padding: Sizing.layout.x12,
    marginBottom: Sizing.layout.x12,
  },
  questionText: {
    fontSize: Sizing.layout.x14,
    marginBottom: Sizing.layout.x8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth > Sizing.layout.x660 ? Sizing.layoutP.xp60 : Sizing.layoutP.xp100,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x12,
    gap: Sizing.layout.x5,
    alignItems: 'center',
  },
  buttonInnerContainer: {
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp50,
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
  headerText: {
    ...Typography.medium.x20,
    ...Typography.fontWeight.x500,
    textAlign: 'center',
  },
  infoText: {
    ...Typography.medium.x12,
    textAlign: 'center',
    color: Colors.appColors.red,
    marginBottom: Sizing.layout.x10,
  },
});

export default styles;
