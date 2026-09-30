import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create({
  itemTextStyle: {
    ...Typography.fontName.semibold,
    ...Typography.fontSize.x14,
    color: Colors.violet.v400,
  },
  accordionStyle: {
    width: Sizing.layoutP.xp100,
    paddingVertical: Sizing.layout.x0,
  },
  accoodianButtonStyle: {
    backgroundColor: Colors.neutral.white,
  },
  accordionContainer: {
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    borderRadius: Sizing.layout.x8,
    padding: Sizing.layout.x8,
    ...Forms.shadowContainer.primary,
    marginVertical: Sizing.layout.x16,
  },
  accordianChildren: {
    padding: Sizing.layout.x8,
  },
  filterDropdown: {
    flexDirection: 'row',
    gap: Sizing.layout.x12,
  },
  filterStyle: {
    borderColor: Colors.neutral.g250,
    borderWidth: Sizing.layout.x1,
    marginVertical: Sizing.layout.x12,
  },
  inputFieldStyle: {
    height: Sizing.layout.x34,
  },
  buttonLabelStyle: {
    ...Typography.fontSize.x14,
  },
  buttonStyle: {
    width: Sizing.layoutP.xp100,
  },
  searchStyle: {
    marginBottom: Sizing.layout.x16,
  },
  noDataText: {
    ...Typography.fontSize.x14,
    ...Typography.fontName.medium,
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
  },
  radioItemBorder: {
    borderWidth: Sizing.layout.x0,
    paddingVertical: Sizing.layout.x0,
  },
  radioContainer: {
    flexDirection: isWeb ? 'row' : 'column',
    marginBottom: Sizing.layout.x10,
  },
});

export default styles;
