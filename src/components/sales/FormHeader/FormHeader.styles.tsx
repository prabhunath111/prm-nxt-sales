import { StyleSheet } from 'react-native';
import { Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Sizing.layout.x15,
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
  },
  container_md: {
    justifyContent: 'flex-start',
    marginBottom: Sizing.layout.x10,
  },
  container_lg: {
    justifyContent: 'flex-start',
    marginBottom: Sizing.layout.x10,
  },
  container_xl: {
    justifyContent: 'flex-start',
    marginBottom: Sizing.layout.x10,
  },
  textStyle: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x30,
    display: 'none',
  },
  textStyle_md: {
    display: 'block',
  },
  textStyle_lg: {
    display: 'block',
  },
  textStyle_xl: {
    display: 'block',
  },
  imageStyle: {
    resizeMode: 'contain',
  },
});

export default styles;
