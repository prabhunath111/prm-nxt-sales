import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.layout.x16,
  },
  informationText: {
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
    paddingLeft: Sizing.layout.x10,
    paddingRight: Sizing.layout.x10,
  },
  textWrapperETSK: {
    paddingHorizontal: Sizing.layout.x10,
    borderRadius: Outlines.borderRadius.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.violet.v100,
  },
});

export default styles;
