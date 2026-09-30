import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.layout.x1,
    backgroundColor: Colors.neutral.white,
    justifyContent: 'space-between',
  },
  subContainer: {
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x16,
    gap: Sizing.layout.x18,
    alignItems: 'center',
    paddingTop: Sizing.layout.x30,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
  },
  headerText: {
    ...Typography.semibold.x18,
    color: Colors.violet.darkViolet,
  },
  textStyle: {
    ...Typography.regular.x14,
    color: Colors.violet.darkViolet,
  },
  numberText: {
    ...Typography.semibold.x16,
    color: Colors.neutral.black,
  },
  purpleContainer: {
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.appColors.lightViolet,
    padding: Sizing.layout.x10,
    borderRadius: Sizing.layout.x8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.violet.borderGrey,
    gap: Sizing.layout.x6,
    marginTop: Sizing.layout.x10,
  },

  purpleContainer_md: {
    maxWidth: Sizing.layout.x450,
  },
  purpleContainer_lg: {
    maxWidth: Sizing.layout.x450,
  },
  purpleContainer_xl: {
    maxWidth: Sizing.layout.x450,
  },
  buttonStyle: {
    minHeight: Sizing.layout.x43,
  },
  buttonStyle_md: {
    minWidth: Sizing.layout.x450,
    alignSelf: 'center',
  },
  buttonStyle_lg: {
    minWidth: Sizing.layout.x450,
    alignSelf: 'center',
  },
  buttonStyle_xl: {
    minWidth: Sizing.layout.x450,
    alignSelf: 'center',
  },
});

export default styles;
