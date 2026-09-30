import { StyleSheet } from 'react-native';
import { Sizing, Colors, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    paddingVertical: Sizing.x15,
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Sizing.layout.x10,
    backgroundColor: Colors.appColors.lightViolet,
    marginBottom: Sizing.layout.x5,
  },
  buttonStyle_md: {
    padding: Sizing.layout.x15,
  },
  buttonStyle_lg: {
    padding: Sizing.layout.x15,
  },
  buttonStyle_xl: {
    padding: Sizing.layout.x15,
  },
  hidden: {
    height: Sizing.layout.x0,
  },
  sectionList: {
    overflow: 'hidden',
    backgroundColor: Colors.neutral.white,
    gap: Sizing.layout.x5,
  },
  sectionTitle: {
    fontSize: Sizing.x20,
    height: Sizing.x30,
    marginTop: Sizing.x10,
  },
  sectionDescription: {
    fontSize: Sizing.x10,
    height: Sizing.x30,
    marginLeft: Sizing.x15,
  },
  textStyle: {
    ...Typography.fontName.medium,
    fontSize: Typography.fontSize.x16.fontSize,
    color: Colors.neutral.black,
  },
  subContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Sizing.layout.x6,
  },
  subDetailsText: {
    ...Typography.fontName.regular,
    ...Typography.fontSize.x14,
    color: Colors.neutral.g750,
  },
});

export default styles;
