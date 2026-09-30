import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing, Typography } from 'styles';
import { platform } from 'utils/platformHelper';

const styles = StyleSheet.create({
  container: {
    ...Forms.shadowContainer.secondary,
    backgroundColor: Colors.violet.v100,
    paddingHorizontal: Sizing.layout.x8,
    paddingTop: Sizing.layout.x5,
    alignItems: 'flex-start',
    ...(platform().OS !== 'web' && {
      paddingTop: Sizing.layout.x2,
    }),
  },
  textContainerStyle: {
    flexDirection: 'row',
  },
  itemContainerStyle: {
    alignItems: 'flex-start',
    paddingRight: Sizing.layout.x12,
    marginRight: Sizing.layout.x12,
    flexWrap: 'wrap',
    flexShrink: Sizing.layout.x1,
    minWidth: Sizing.layout.x100,
  },
  primaryTextStyle: {
    ...Typography.regular.x12,
    color: Colors.violet.darkViolet,
  },
  secondaryTextStyle: {
    ...Typography.medium.x14,
    color: Colors.violet.darkViolet,
  },
  etskContainer: {
    backgroundColor: Colors.violet.v100,
    padding: Sizing.layout.x8,
    borderRadius: Sizing.layout.x4,
    gap: Sizing.layout.x18,
    marginTop: Sizing.layout.x8,
    minHeight: Sizing.layout.x40,
  },
  textWrapperManage: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
  },
  secondaryBookingNumber: {
    color: Colors.appColors.hotPink,
    alignSelf: 'center',
  },
});

export default styles;
