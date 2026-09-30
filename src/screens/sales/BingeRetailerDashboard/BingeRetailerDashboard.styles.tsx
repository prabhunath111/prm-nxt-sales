import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';
import { getFullScreenHeight, getScreenWidth } from 'styles/dimentionHelper';
import { isWeb } from 'utils/platformHelper';

const screenWidth = getScreenWidth();
const styles = StyleSheet.create<any>({
  container: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
    flexGrow: Sizing.layout.x1,
  },

  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizing.layout.x20,
  },

  durationBox: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: Sizing.layout.x12,
    borderRadius: Sizing.layout.x8,
  },

  durationText: {
    fontSize: 14,
    color: '#333',
  },

  submitButton: {
    marginLeft: Sizing.layout.x10,
    backgroundColor: Colors.primary.brand,
    paddingVertical: Sizing.layout.x12,
    paddingHorizontal: Sizing.layout.x16,
    borderRadius: Sizing.layout.x8,
  },

  submitText: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x600,
  },

  summaryTitle: {
    color: Colors.neutral.white,
    ...Typography.fontSize.x16,
    ...Typography.fontName.medium,
    ...Typography.fontWeight.x500,
    marginBottom: Sizing.layout.x10,
    alignSelf: 'flex-start',
  },

  summaryContainer: {
    borderRadius: Sizing.layout.x12,
    padding: Sizing.layout.x10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: Sizing.layoutP.xp48,
    backgroundColor: Colors.neutral.g20,
    borderRadius: Sizing.layout.x10,
    padding: Sizing.layout.x12,
    marginBottom: Sizing.layout.x12,
  },

  cardTitle: {
    color: Colors.appColors.darkViolet,
    ...Typography.fontSize.x14,
    ...Typography.fontName.regular,
    ...Typography.fontWeight.x400,
  },

  cardValue: {
    color: Colors.neutral.black,
    ...Typography.fontSize.x18,
    ...Typography.fontName.semibold,
    ...Typography.fontWeight.x600,
    marginTop: Sizing.layout.x5,
  },

  tableContainer: {
    marginTop: Sizing.layout.x20,
    backgroundColor: '#F2F2F2',
    borderRadius: Sizing.layout.x8,
    overflow: 'hidden',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#5C4A7D',
    padding: Sizing.layout.x12,
  },

  tableHeaderText: {
    flex: Sizing.layout.x1,
    color: '#fff',
    fontWeight: 'bold',
  },

  tableRow: {
    flexDirection: 'row',
    padding: Sizing.layout.x12,
  },

  tableCellTitle: {
    flex: Sizing.layout.x2,
    color: '#333',
  },

  tableCell: {
    flex: Sizing.layout.x1,
    color: '#333',
  },
  dropdownContainer: {
    flex: 1,
  },
  filterInputBox: {
    height: Sizing.layout.x40,
    borderRadius: Sizing.layout.x8,
    borderWidth: Sizing.layout.x1,
    borderColor: Colors.neutral.g200,
    backgroundColor: Colors.neutral.white,
  },
  dynamicCardContainer80P_md: {
    paddingTop: Sizing.layout.x10,
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer80P_lg: {
    paddingTop: Sizing.layout.x10,
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  dynamicCardContainer80P_xl: {
    paddingTop: Sizing.layout.x10,
    width: Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  detailsCardContainer: {
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
  alignItemCenter: {
    // alignItems: 'center',
    marginTop: Sizing.layout.x12,
    width: Sizing.layoutP.xp100,
    alignItems: 'stretch',
  },
  gradientContainer: {
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x14,
    borderRadius: isWeb ? Sizing.layout.x8 : undefined,
  },
  errorText: {
    ...Typography.fontSize.x14,
    alignSelf: 'flex-start',
    paddingTop: Sizing.layout.x0,
    paddingBottom: Sizing.layout.x15,
    color: Colors.appColors.lightRed,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    paddingVertical: screenWidth > Sizing.layout.x660 ? Sizing.layout.x16 : Sizing.layout.x12,
    gap: Sizing.layout.x5,
    alignItems: 'center',
  },
  innerButtonContainer: {
    gap: Sizing.layout.x10,
    minWidth: Sizing.layout.x180,
    flexDirection: screenWidth > Sizing.layout.x660 ? 'row' : 'column',
  },
  textWrapperETSK: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    minWidth: Sizing.layout.x300,
  },
  alignCenter: {
    flex: Sizing.flexSize.x100,
    alignSelf: 'center',
    gap: Sizing.layout.x2,
    flexGrow: Sizing.flexSize.x100,
    flexShrink: Sizing.flexSize.x100,
  },
  heightAdjust: {
    height: getFullScreenHeight() - Sizing.layout.x500,
  },
});
export default styles;
