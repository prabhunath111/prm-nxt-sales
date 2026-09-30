import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    flex: Sizing.flexSize.x100,
    width: Sizing.layoutP.xp100,
  },
  textWrapperManage: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    padding: Sizing.layout.x8,
    marginVertical: Sizing.layout.x18,
  },
  subContainer: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    alignSelf: 'center',
    paddingHorizontal: Sizing.layout.x0,
  },
  subContainer_xs: {
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  subContainer_sm: {
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  subContainer_md: {
    minWidth: Sizing.layoutP.xp80,
    alignSelf: 'center',
    paddingHorizontal: 0,
    paddingTop: Sizing.layout.x10,
  },
  subContainer_lg: {
    minWidth: Sizing.layoutP.xp80,
    alignSelf: 'center',
    paddingHorizontal: 0,
    paddingTop: Sizing.layout.x10,
  },
  subContainer_xl: {
    minWidth: Sizing.layoutP.xp80,
    alignSelf: 'center',
    paddingHorizontal: 0,
    paddingTop: Sizing.layout.x10,
  },
  cardsConatinerView: {
    paddingHorizontal: Sizing.layout.x15,
  },
  title: {
    ...Typography.fontWeight.x500,
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.violet.v100,
    borderRadius: Sizing.layout.x4,
    padding: Sizing.layout.x8,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g250,
    marginVertical: Sizing.x18,
    alignItems: 'center',
  },
  status: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
  },
  statusWrapper: {
    flexShrink: Sizing.flexSize.x100,
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x4,
    borderRadius: Sizing.layout.x10,
  },
  activeText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    marginTop: Sizing.layout.x0,
    textTransform: 'uppercase',
  },
  secondaryConView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizing.layout.x8,
  },
  seperator: {
    height: Sizing.layout.x1,
    width: 'auto',
    backgroundColor: Colors.neutral.g250,
    marginHorizontal: Sizing.layout.x8,
  },
  bottomMargin: {
    marginBottom: Sizing.layout.x10,
  },
  zeroPadding: {
    padding: Sizing.layout.x0,
  },
  buttonView: {
    position: 'absolute',
    bottom: 0,
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
    height: Sizing.layout.x50,
    backgroundColor: Colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    // iOS
    shadowColor: Colors.neutral.black,
    shadowOpacity: Sizing.layout.xDot1,
    shadowRadius: Sizing.layout.x8,
    shadowOffset: { width: 0, height: -2 },

    // Android
    elevation: Sizing.layout.x4,

    // web
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
  },
  button: {
    width: Sizing.layoutP.xp30,
    height: Sizing.layout.x25,
  },
  marginSmall: {
    height: Sizing.layout.x20,
  },
  scrollViewStyle: { marginBottom: Sizing.layout.x40 },
});

export default styles;
