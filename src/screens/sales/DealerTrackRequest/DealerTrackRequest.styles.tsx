import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },
  searchContainer: {
    flex: 2,
    marginTop: Sizing.layout.x10,
    marginBottom: Sizing.layout.x15,
  },
  tableContainer: {
    paddingHorizontal: Sizing.layout.x16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: Sizing.layout.x24,
  },

  filterInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
  },

  filterInputText: {
    fontSize: 14,
  },
  detailsCardContainer: {
    padding: Sizing.layout.x14,
    justifyContent: 'center',
  },
  detailsCardContainer_xs: {
    padding: Sizing.layout.x5,
  },
  detailsCardContainer_sm: {
    padding: Sizing.layout.x5,
  },
  detailsCardContainer_md: {
    width: Sizing.layoutP.xp80,
    padding: Sizing.layout.x0,
    marginVertical: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_lg: {
    width: Sizing.layoutP.xp80,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  detailsCardContainer_xl: {
    width: Sizing.layoutP.xp80,
    marginTop: Sizing.layout.x9,
    alignSelf: 'center',
  },
  labelTextStyle: {
    ...Typography.regular.x12,
    color: Colors.violet.darkViolet,
    marginBottom: Sizing.layout.x10,
  },

  filterContainer: {
    flex: 2,
    flexDirection: 'row',
    gap: Sizing.layout.x16,
    marginBottom: Sizing.layout.x16,
  },

  filterInputBox: {
    height: Sizing.layout.x40,
    borderRadius: Sizing.layout.x8,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g200,
    backgroundColor: Colors.neutral.white,
  },
  selectedDatebox: {
    height: isWeb ? undefined : Sizing.layout.x56,
  },
  alignItemCenter: {
    alignItems: 'center',
    width: Sizing.layoutP.xp100,
  },
  itemViewStyle: {
    gap: Sizing.layout.x0,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  dynamicCardContainer80P_md: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer80P_lg: {
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer80P_xl: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
    gap: Sizing.layout.x10,
  },
  backButton: {
    ...Forms.buttonContainer.shadowContainer,
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x16,
    paddingVertical: Sizing.layout.x4,
  },
  backButtonStyle: {
    paddingVertical: Sizing.layout.x13,
    borderRadius: Outlines.borderRadius.smallest,
  },
  backButtonStyle_md: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
  },
  backButtonStyle_lg: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
  },
  backButtonStyle_xl: {
    minWidth: Sizing.layout.x170,
    flex: Sizing.layout.x0,
    alignSelf: 'center',
  },
  dropdownContainer: {
    flex: 1,
  },
  alignCenter: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
    gap: Sizing.layout.x2,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
});

export default styles;
