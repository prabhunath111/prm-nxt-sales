import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing } from 'styles';

const styles = StyleSheet.create<any>({
  flex: { flex: Sizing.layout.x1 },
  partnerScreen: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    paddingHorizontal: Sizing.layout.x12,
  },
  partnerScreen_md: {
    alignSelf: 'center',
  },
  partnerScreen_lg: {
    alignSelf: 'center',
  },
  partnerScreenmd_xl: {
    alignSelf: 'center',
  },
  container: {
    paddingVertival: Sizing.layout.x12,
    paddingTop: Sizing.layout.x12,
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x12,
  },
  container_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  container_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  container_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    width: Sizing.layoutP.xp100,
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
    justifyContent: 'center',
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
});

export default styles;
