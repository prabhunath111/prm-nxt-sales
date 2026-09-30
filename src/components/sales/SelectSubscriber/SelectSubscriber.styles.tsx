import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    padding: Sizing.layout.x8,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.violet.v200,
    marginVertical: Sizing.layout.x8,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Sizing.layout.x8,
    gap: Sizing.layout.x8,
  },
  itemViewStyle: {
    gap: Sizing.layout.x12,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  container_lg: {
    maxWidth: Sizing.layoutP.xp50,
    marginBottom: Sizing.layout.x20,
  },
  container_xl: {
    maxWidth: Sizing.layoutP.xp32,
    marginBottom: Sizing.layout.x20,
  },
  subIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x500,
    ...Typography.fontSize.x16,
    color: Colors.violet.v250,
  },
  status: {
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x500,
    ...Typography.fontSize.x14,
    color: Colors.neutral.g750,
  },
  columnWrapper: {
    gap: Sizing.layout.x20,
    alignItems: 'flex-start',
  },
  errorText: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
  },
  seprator: {
    height: Sizing.layout.x22,
    borderRightWidth: Sizing.layout.xDot5,
    borderColor: Colors.violet.v200,
  },
});

export default styles;
