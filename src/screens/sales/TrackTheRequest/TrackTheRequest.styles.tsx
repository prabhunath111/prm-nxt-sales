import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    marginVertical: Sizing.layout.x10,
    marginHorizontal: Sizing.layoutP.xp2,
  },
  container_md: {
    marginHorizontal: Sizing.layoutP.xp4,
    paddingHorizontal: Sizing.layout.x20,
  },
  container_lg: {
    marginHorizontal: Sizing.layoutP.xp4,
    paddingHorizontal: Sizing.layout.x20,
  },
  container_xl: {
    marginHorizontal: Sizing.layoutP.xp4,
    paddingHorizontal: Sizing.layout.x20,
  },
  tableContainer: {
    marginVertical: Sizing.layout.x10,
    marginHorizontal: Sizing.layoutP.xp2,
  },
  tableContainer_md: {
    marginHorizontal: Sizing.layoutP.xp4,
  },
  tableContainer_lg: {
    marginHorizontal: Sizing.layoutP.xp4,
  },
  tableContainer_xl: {
    marginHorizontal: Sizing.layoutP.xp4,
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: Sizing.layoutP.xp100,
  },
  formContainer: {
    width: Sizing.layoutP.xp100,
  },
  header: {
    display: 'block',
  },
  header_md: {
    display: 'none',
  },
  header_lg: {
    display: 'none',
  },
  header_xl: {
    display: 'none',
  },
  buttonContainer: {
    justifyContent: 'center',
    gap: Sizing.layout.x10,
    paddingVertical: Sizing.layout.x10,
  },
  buttonContainer_md: {
    flexDirection: 'row',
    paddingTop: Sizing.layout.x20,
  },
  buttonContainer_lg: {
    flexDirection: 'row',
    paddingTop: Sizing.layout.x20,
  },
  buttonContainer_xl: {
    flexDirection: 'row',
    paddingTop: Sizing.layout.x20,
  },
  dropdownContainerStyle: {
    ...Forms.formField.primary,
    ...Typography.fontName.medium,
    ...Typography.fontSize.x16,
    borderWidth: Sizing.layout.xDot5,
    borderRadius: Outlines.borderRadius.smallest,
    backgroundColor: Colors.neutral.white,
    marginVertical: Sizing.layout.x10,
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x0,
    height: Sizing.layout.x50,
    width: 'auto',
  },
  dropDownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.layout.x10,
  },
  inputStyle: {
    backgroundColor: 'white',
    shadowOpacity: Sizing.shadowOpacity.x14,
  },
});

export default styles;
