import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
  },
  subContainer: {
    marginTop: Sizing.layout.x20,
    backgroundColor: Colors.violet.v100,
    width: Sizing.layoutP.xp100,
    ...Forms.buttonContainer.shadowContainer,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x12,
  },
  subContainer_xs: {
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x0,
    backgroundColor: Colors.violet.v100,
  },
  subContainer_sm: {
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x0,
    backgroundColor: Colors.violet.v100,
  },
  subContainer_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x0,
    backgroundColor: Colors.neutral.white,
    padding: Sizing.layout.x16,
    alignItems: 'center',
  },
  subContainer_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x0,
    backgroundColor: Colors.neutral.white,
    padding: Sizing.layout.x16,
    alignItems: 'center',
  },
  subContainer_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x0,
    backgroundColor: Colors.neutral.white,
    padding: Sizing.layout.x16,
    alignItems: 'center',
  },
  textWrapperManage: {
    gap: Sizing.layout.x8,
    padding: Sizing.layout.x8,
    alignItems: 'center',
    justifyContent: screenWidth <= Sizing.layout.x660 ? 'space-between' : 'flex-start',
    flexDirection: screenWidth <= Sizing.layout.x660 ? 'row' : 'column',
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
  secondaryStyle: {
    textAlign: 'center',
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.black,
  },
  secondaryStyle_xs: {
    textAlign: 'center',
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.black,
  },
  secondaryStyle_sm: {
    textAlign: 'center',
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    lineHeight: Sizing.layout.x25,
    color: Colors.neutral.black,
  },
  textContainerStyle: {},
  textContainerStyle_md: {
    flexDirection: 'row',
    width: Sizing.layoutP.xp100,
    justifyContent: 'space-evenly',
  },
  textContainerStyle_lg: {
    flexDirection: 'row',
    width: Sizing.layoutP.xp100,
    justifyContent: 'space-evenly',
  },
  textContainerStyle_xl: {
    flexDirection: 'row',
    width: Sizing.layoutP.xp100,
    justifyContent: 'space-evenly',
  },
  primaryStyle: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.semibold,
    lineHeight: Sizing.layout.x20,
    color: Colors.neutral.g850,
  },
  primaryStyle_xs: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.semibold,
    lineHeight: Sizing.layout.x20,
    color: Colors.neutral.g850,
  },
  primaryStyle_sm: {
    ...Typography.fontSize.x13,
    ...Typography.fontName.semibold,
    lineHeight: Sizing.layout.x20,
    color: Colors.neutral.g850,
  },
  button: {
    minWidth: Sizing.layout.x200,
  },
});

export default styles;
