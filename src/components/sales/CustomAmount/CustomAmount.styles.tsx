import { StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';

const styles = StyleSheet.create({
  container: {
    ...Forms.shadowContainer.primary,
    width: Sizing.layoutP.xp100,
    padding: Sizing.layout.x0,
    backgroundColor: Colors.neutral.white,
    borderRadius: Outlines.borderRadius.small,
    gap: Sizing.layout.x2,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizing.layout.x10,
    width: Sizing.layoutP.xp100,
    backgroundColor: Colors.violet.v100,
    paddingHorizontal: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x8,
  },
  selectPartnerLabel: {
    ...Typography.bold.x14,
    color: Colors.violet.v400,
  },
  partnerContainer: {
    padding: Sizing.layout.x12,
  },
  inputLabelStyle: {
    ...Typography.medium.x16,
  },
  pinInputContainer: {
    ...Forms.input.secondary,
  },
  columnContainer: {
    gap: Sizing.layout.x2,
  },
  amountTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Sizing.layout.x35,
    gap: Sizing.layout.x12,
  },
  lightTextStyle: {
    ...Typography.medium.x16,
  },
  radioContainerStyle: {
    borderWidth: Sizing.layout.x0,
  },
  amountContainerStyle: {
    marginLeft: Sizing.layout.x35,
  },
});

export default styles;
