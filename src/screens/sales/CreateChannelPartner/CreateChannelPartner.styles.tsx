import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  partnerScreen: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
  },
  mainContiner: {
    flex: Sizing.flexSize.x100,
    backgroundColor: Colors.neutral.white,
  },
  container: {
    paddingHorizontal: Sizing.layout.x12,
    paddingTop: Sizing.layout.x12,
    backgroundColor: Colors.neutral.white,
  },
  container_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  container_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  container_xl: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  radioItemBorder: {
    borderWidth: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x0,
  },
  radioContainer: {
    flexDirection: 'row',
  },
  itemTextStyle: {
    ...Typography.medium.x14,
    ...Typography.fontWeight.x500,
    color: Colors.violet.v400,
  },
});

export default styles;
