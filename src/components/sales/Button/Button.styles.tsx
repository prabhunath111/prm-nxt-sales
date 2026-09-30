import { StyleSheet } from 'react-native';
import { Sizing, Buttons, Typography, Colors } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  ...Buttons.size,
  button: {
    ...Buttons.style.default,
    minHeight: Sizing.layout.x40,
  },
  disabledButton: {
    ...Buttons.style.default,
    ...Buttons.style.disabled,
  },
  btnIconStyle: {
    padding: Sizing.layout.x10,
    marginHorizontal: Sizing.layout.x5,
  },
  iconLeft: {
    flexDirection: 'row',
    gap: Sizing.layout.x8,
    alignItems: 'center',
  },
  iconRight: {
    flexDirection: 'row-reverse',
    gap: Sizing.layout.x8,
    alignItems: 'center',
  },
  textStyle: {
    ...Typography.fontName.medium,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: isWeb ? Sizing.layout.x3 : 0,
    lineHeight: Sizing.layout.x20,
  },
  buttonHover: {
    backgroundColor: Colors.appColors.darkViolet,
  },
  textContainer: {
    flexShrink: Sizing.flexSize.x100,
  },
  mlTextStyle: {
    flexShrink: 0,
    flexGrow: 1,
    flexBasis: 'auto',
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
});

export default styles;
