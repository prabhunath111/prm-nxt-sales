import { StyleSheet } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  safeAreaStyle: {
    flex: Sizing.layout.x1,
  },
  container: {
    justifyContent: 'flex-start',
    paddingTop: Sizing.layout.x20,
  },
  cardContainer: {
    width: Sizing.layoutP.xp100,
    marginVertical: Sizing.layout.x16,
  },
  cardContainer_md: {
    marginVertical: Sizing.layout.x20,
  },
  cardContainer_lg: {
    marginVertical: Sizing.layout.x40,
  },
  cardContainer_xl: {
    marginVertical: Sizing.layout.x40,
  },
  textStyle: {
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    color: Colors.neutral.black,
  },
  textContainer: {
    marginHorizontal: Sizing.layout.x15,
    marginVertical: Sizing.layout.x10,
    alignSelf: 'flex-start',
  },
  cardStyle: {
    textAlign: 'left',
    marginTop: Sizing.layout.x0,
    marginBottom: Sizing.layout.x5,
    marginHorizontal: Sizing.layout.x15,
    borderRadius: Sizing.layout.x4,
    shadowOpacity: Sizing.layout.x0,
    borderWidth: Sizing.layout.xDot5,
    borderColor: Colors.neutral.g450,
  },
  cardStyle_md: {
    marginHorizontal: Sizing.layout.x20,
    padding: Sizing.layout.x5,
    marginBottom: Sizing.layout.x14,
  },
  cardStyle_lg: {
    marginHorizontal: Sizing.layout.x40,
    padding: Sizing.layout.x5,
    marginBottom: Sizing.layout.x14,
  },
  cardStyle_xl: {
    marginHorizontal: Sizing.layout.x40,
    padding: Sizing.layout.x5,
    marginBottom: Sizing.layout.x14,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.appColors.frenchViolet,
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x25,
  },
  headerText: {
    ...Typography.fontName.medium,
    ...Typography.fontSize.x18,
    color: Colors.neutral.white,
    marginBottom: Sizing.layout.x9,
  },
  subHeaderText: {
    ...Typography.fontName.light,
    ...Typography.fontSize.x14,
    color: Colors.neutral.white,
  },
  header: {
    display: 'flex',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  header_md: {
    display: 'flex',
  },
  header_lg: {
    display: 'flex',
  },
  header_xl: {
    display: 'flex',
  },
  commonCardContainer: {
    maxHeight: 'auto',
  },
  commonCardContainer_md: {
    marginTop: Sizing.layout.x0,
  },
  commonCardContainer_lg: {
    marginTop: Sizing.layout.x0,
  },
  commonCardContainer_xl: {
    marginTop: Sizing.layout.x0,
  },
});

export default styles;
