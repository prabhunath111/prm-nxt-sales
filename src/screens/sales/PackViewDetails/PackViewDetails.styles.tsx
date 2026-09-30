import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Forms, Outlines, Sizing, Typography } from 'styles';
import { shadowContainer } from 'styles/forms';

const styles = StyleSheet.create<any>({
  mainContainer: {
    height: Sizing.layoutP.xp100,
    backgroundColor: Colors.neutral.white,
    width: Sizing.layoutP.xp100,
  },
  contentContainerStyle: {
    gap: Sizing.layout.x15,
    paddingHorizontal: Sizing.layout.x15,
    paddingVertical: Sizing.layout.x20,
    flexGrow: Sizing.flexSize.x100,
  },
  container: {
    alignItems: 'center',
    gap: Sizing.layout.x16,
  },
  textStyle: {
    fontSize: Sizing.layout.x20,
    ...Typography.fontWeight.x500,
  },
  containerStyle: {
    gap: Sizing.layout.x8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizing.layout.x12,
  },
  verticalSeparator: {
    height: Sizing.layoutP.xp100,
    borderLeftWidth: Sizing.layout.x1,
    borderLeftColor: Colors.neutral.g350,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Sizing.layout.x12,
  },
  accordionsContainer: {
    flex: Sizing.flexSize.x100,
    gap: Sizing.layout.x10,
  },
  accordionsContainer_md: {
    alignSelf: 'center',
    width: Sizing.layoutP.xp50,
  },
  accordionsContainer_lg: {
    alignSelf: 'center',
    width: Sizing.layoutP.xp50,
  },
  accordionsContainer_xl: {
    alignSelf: 'center',
    width: Sizing.layoutP.xp50,
  },
  accordionStyle: {
    padding: Sizing.layout.x12,
    gap: Sizing.layout.x12,
    borderRadius: Outlines.borderRadius.baseMedium,
    backgroundColor: Colors.neutral.white,
    shadowColor: Colors.neutral.black,
    shadowOffset: {
      width: Sizing.layout.x0,
      height: Sizing.layout.x0,
    },
    shadowOpacity: Sizing.shadowOpacity.x12,
    shadowRadius: Sizing.layout.x8,
    elevation: Sizing.layout.x6,
  },
  accordionButton: {
    padding: Sizing.layout.x0,
    margin: Sizing.layout.x0,
    backgroundColor: Colors.neutral.white,
    marginBottom: Sizing.layout.x0,
  },
  channelImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizing.layout.x8,
    justifyContent: 'center',
  },
  subAccordionIconContainer: {
    minHeight: Sizing.layout.x110,
    width: Sizing.layoutP.xp32,
    maxWidth: Sizing.layout.x90,
    borderRadius: Outlines.borderRadius.baseMedium,
    borderColor: Colors.neutral.g250,
    borderWidth: Outlines.borderWidth.thin,
    padding: Sizing.layout.x3,
    paddingBottom: Sizing.layout.x12,
    marginBottom: Sizing.layout.x12,
  },
  subAccordionIcon: {
    height: Sizing.layout.x48,
    width: Sizing.layoutP.xp100,
    resizeMode: 'contain',
  },
  hdContainer: {
    borderRadius: Sizing.layout.x25,
    marginLeft: 'auto',
    backgroundColor: Colors.violet.v500,
    paddingHorizontal: Sizing.layout.x8,
    paddingVertical: Sizing.layout.x2,
    marginBottom: Sizing.layout.x2,
  },
  hdText: {
    ...Typography.fontSize.x8,
    color: Colors.neutral.white,
  },
  channelNameText: {
    ...Typography.fontSize.x10,
    ...Typography.fontName.medium,
    paddingTop: Sizing.layout.x4,
    paddingHorizontal: Sizing.layout.x2,
    textAlign: 'center',
  },
  channelNumberContainer: {
    ...shadowContainer.tertiary,
    borderWidth: Outlines.borderWidth.thin,
    borderColor: Colors.neutral.g250,
    paddingHorizontal: Sizing.layout.x5,
    paddingVertical: Sizing.layout.x2,
    borderRadius: Outlines.borderRadius.baseMedium,
    backgroundColor: Colors.neutral.white,
    position: 'absolute',
    left: Sizing.layoutP.xp30,
    bottom: -Sizing.layout.x10,
  },
  channelNumberText: {
    ...Typography.fontSize.x10,
    ...Typography.fontName.semibold,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    gap: Sizing.layout.x10,
    marginTop: Sizing.layout.x12,
  },
  buttonContainer_xs: {
    paddingBottom: Sizing.layout.x0,
    paddingTop: Sizing.layout.x5,
    marginTop: Sizing.layout.x0,
  },
  buttonContainer_sm: {
    paddingVertical: Sizing.layout.x5,
    marginTop: Sizing.layout.x0,
  },
  buttonContainer_lg: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  buttonContainer_xl: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Sizing.layout.x10,
  },
  buttonContainerOutLine: {
    alignSelf: 'center',
    width: Sizing.layout.x328,
  },
  heightScroll: {
    height: Dimensions.get('window').height,
  },
});

export default styles;
