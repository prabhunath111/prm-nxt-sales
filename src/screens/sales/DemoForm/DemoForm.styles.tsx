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
    padding: Sizing.layout.x14,
  },
  detailsCardContainer_sm: {
    padding: Sizing.layout.x14,
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
  formContainer: {
    width: Sizing.layoutP.xp80,
  },
  inputContationer: {
    alignSelf: 'center',
    justifyContent: 'center',
    gap: Sizing.layout.x10,
    borderWidth: Sizing.layout.x2,
    borderColor: Colors.neutral.g200,
    borderRadius: Sizing.layout.x20,
    padding: Sizing.layout.x30,
    backgroundColor: Colors.neutral.white,
    marginTop: Sizing.layout.x20,
    width: Sizing.layoutP.xp100,
  },
  inputGroup: {
    width: Sizing.layoutP.xp100,
    marginTop: Sizing.layout.x10,
  },
  existingSubID: {
    borderWidth: Sizing.layout.x2,
    borderColor: Colors.neutral.g200,
    borderRadius: Sizing.layout.x20,
    padding: Sizing.layout.x30,
    backgroundColor: Colors.neutral.white,
    marginTop: Sizing.layout.x20,
  },
  multiTVConnection: {
    borderWidth: Sizing.layout.x2,
    borderColor: Colors.neutral.g200,
    borderRadius: Sizing.layout.x20,
    padding: Sizing.layout.x20,
    backgroundColor: Colors.neutral.white,
    marginTop: Sizing.layout.x20,
  },
  questionCard: {
    marginBottom: Sizing.layout.x20,
  },
  questions: {
    marginTop: Sizing.layout.x20,
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
  errorText: {
    color: Colors.appColors.red,
    marginTop: Sizing.layout.x4,
  },
});

export default styles;
