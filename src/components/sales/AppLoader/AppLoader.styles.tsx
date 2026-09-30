import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { getFullScreenWidth } from 'styles/dimentionHelper';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  modalContainer: {
    height: Sizing.x311,
    width: getFullScreenWidth() * 0.9,
    maxWidth: Sizing.layout.x450,
  },
  modalContainer_sm: {
    height: Sizing.x256,
  },
  modalContainer_xs: {
    height: Sizing.x256,
  },
  toastLoaderTitle: {
    ...Typography.fontSize.x25,
    ...Typography.fontName.regular,
    color: Colors.neutral.black,
    marginTop: Sizing.x6,
    textAlign: 'center',
  },
  toastErrorViewContainer: {
    width: Sizing.layoutP.xp100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastAlertViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp100,
    padding: Sizing.layout.x10,
    backgroundColor: Colors.neutral.white,
  },
  toastLoaderInfo: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.regular,
    marginTop: Sizing.x11,
    color: Colors.neutral.g700,
    textAlign: 'center',
  },
  backgroundStyle: {
    backgroundColor: Colors.transparent.darkGray,
    opacity: Sizing.x1,
  },
  loaderContainer: {
    backgroundColor: Colors.violet.backgroundViolet,
    width: Sizing.layoutP.xp100,
    height: Sizing.layoutP.xp100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
