/**
 * Button component for use in the app.
 *
 * @module components/Button
 * @memberof CommonButtonComponent
 */
import React, { useState } from 'react';
import { TouchableOpacity, View, ActivityIndicator, ViewStyle, ColorValue } from 'react-native';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import { Buttons, Colors, Outlines, Sizing, Typography } from 'styles';
import { PROPERTIES, STYLES } from 'const';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { isWeb } from 'utils/platformHelper';
import { useTranslation } from 'react-i18next';
import styles from './Button.styles';

/**
 * Props for the Button component.
 * @typedef {object} ButtonProps
 * @property {Function} onPress - Function to be called when the button is pressed.
 * @property {boolean} [isOnlyIcon] - Indicates whether the button contains only an icon.
 * @property {string} [iconName] - Name of the icon to be displayed.
 * @property {string} [label] - Text label for the button.
 * @property {Buttons.ButtonType} [type] - Type of button (primary, secondary, etc.).
 * @property {boolean} [outline] - Indicates whether the button should have an outline.
 * @property {string} [size] - Size of the button (small, medium, large).
 * @property {number} [borderRadius] - Border radius of the button.
 * @property {string} [iconPosition] - Position of the icon relative to the label (left, right).
 * @property {number} [iconHeight] - Height of the icon.
 * @property {number} [iconWidth] - Width of the icon.
 * @property {number} [iconRadius] - Border radius of the icon.
 * @property {string} [fontSize] - Font size of the label.
 * @property {string} [fontColor] - Color of the label text.
 * @property {object} [style] - Additional styles for the button.
 * @property {object} [iconStyle] - Additional styles for the icon.
 * @property {object} [labelStyle] - Additional styles for the label.
 * @property {boolean} [disabled] - Indicates whether the button is disabled.
 * @property {boolean} [loading] - Indicates whether the button is in a loading state.
 */
export type ButtonProps = {
  onPress: () => void;
  isOnlyIcon?: boolean;
  iconName?: string | undefined;
  label?: string | undefined;
  type?: Buttons.ButtonType;
  outline?: boolean;
  size?: string;
  borderRadius?: number;
  iconPosition?: string;
  iconHeight?: number;
  fontSize?: number;
  fontColor?: string;
  iconWidth?: number;
  iconRadius?: number;
  style?: ViewStyle | ViewStyle[];
  iconStyle?: object;
  labelStyle?: object;
  disabled?: boolean;
  loading?: boolean;
  useHover?: boolean;
  id?: string;
  isDimension?: boolean;
};

/**
 * Props for the RenderButton component.
 * @typedef {object} RenderButtonProps
 * @property {string} label - Text label for the button.
 * @property {string} [iconName] - Name of the icon to be displayed.
 * @property {string} [iconPosition] - Position of the icon relative to the label (left, right).
 * @property {object} [style] - Additional styles for the button.
 * @property {object} [iconStyle] - Additional styles for the icon.
 * @property {boolean} [loading] - Indicates whether the button is in a loading state.
 * @property {number} [iconHeight] - Height of the icon.
 * @property {number} [iconWidth] - Width of the icon.
 * @property {number} [iconRadius] - Border radius of the icon.
 * @property {string} [fontSize] - Font size of the label.
 * @property {string} [fontColor] - Color of the label text.
 */
export type RenderButtonProps = {
  label: string | undefined;
  iconName?: string;
  iconPosition?: string;
  style?: ViewStyle;
  iconStyle?: object;
  loading?: boolean;
  iconHeight?: number;
  iconWidth?: number;
  iconRadius?: number;
  fontSize?: number;
  fontColor?: string | ColorValue;
  isDimension?: boolean;
};

/**
 * Manages the position of the icon within the button.
 * @param {string} iconPosition - Position of the icon (left, right).
 * @returns {object} Styles for the icon position.
 */
const manageIconPosition = (iconPosition: string) => {
  let iconLeftOrRight;
  if (iconPosition === STYLES.POSITION.LEFT) iconLeftOrRight = styles.iconLeft;
  else if (iconPosition === STYLES.POSITION.RIGHT) iconLeftOrRight = styles.iconRight;
  return iconLeftOrRight;
};

/**
 * Renders the button component.
 * @param {RenderButtonProps} props - Props passed to the component.
 * @returns {JSX.Element} Rendered button component.
 */
const RenderButton = ({
  label,
  iconName,
  iconPosition = '',
  style,
  loading,
  iconHeight,
  iconWidth,
  iconRadius,
  fontSize,
  fontColor,
  iconStyle,
  isDimension,
}: RenderButtonProps) => {
  const { inflection } = useInflection();
  const { i18n } = useTranslation();

  return (
    <View style={styles.textContainer}>
      {loading ? (
        <ActivityIndicator color={Colors.neutral.white} />
      ) : (
        <View style={manageIconPosition(iconPosition)}>
          {iconPosition ? (
            <Image iconName={iconName} height={iconHeight} width={iconWidth} borderRadius={iconRadius} style={{ ...styles.btnIconStyle, ...iconStyle }} isDimension={isDimension} />
          ) : undefined}

          <Text
            label={label}
            color={fontColor}
            fontSize={fontSize}
            maxFontSize={fontSize}
            minFontSize={Sizing.layout.x18}
            style={[
              styles.textStyle,
              styles[gcs('textStyle', inflection, true, ['md', 'lg', 'xl'])],
              style,
              { color: fontColor },
              PROPERTIES.LANG_LIST_SOUTH.includes(i18n?.language) && styles.mlTextStyle,
            ]}
          />
        </View>
      )}
    </View>
  );
};

type buttonStyleType = {
  [key: string]: any;
};
const buttonStyle: buttonStyleType = styles;

/**
 * Represents a Button component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns Button
 */
const Button = ({
  onPress,
  label,
  type = STYLES.TYPE.PRIMARY,
  outline = false,
  size = STYLES.SIZE.SM,
  borderRadius = Outlines.borderRadius.small,
  isOnlyIcon,
  iconName,
  iconPosition,
  iconHeight,
  iconWidth,
  iconRadius,
  fontSize = Typography.fontSize.x18.fontSize,
  fontColor,
  disabled,
  loading,
  style,
  iconStyle = {},
  labelStyle,
  isDimension = true,
  id,
  useHover = false,
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const getStyleArray = (style?: any) => {
    if (Array.isArray(style)) return style;
    if (style) return [style];
    return [];
  };
  return (
    <TouchableOpacity
      testID="button-test"
      id={id}
      {...(isWeb &&
        useHover && {
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
        })}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
      style={[
        disabled ? styles.disabledButton : styles.button,
        !isOnlyIcon ? Buttons.button[type] : undefined,
        buttonStyle[`${size}`],
        { borderRadius },
        ...getStyleArray(style),
        outline ? Buttons.outline[type] : undefined,
        isHovered && styles.buttonHover,
      ]}
    >
      {isOnlyIcon ? (
        <Image iconName={iconName} height={iconHeight} width={iconWidth} borderRadius={iconRadius} style={iconStyle} />
      ) : (
        <RenderButton
          label={label}
          iconName={iconName}
          iconPosition={iconPosition}
          iconHeight={iconHeight}
          iconWidth={iconWidth}
          iconRadius={iconRadius}
          iconStyle={iconStyle}
          fontSize={fontSize}
          fontColor={fontColor || Buttons.text[type]?.color}
          style={labelStyle}
          loading={loading}
          isDimension={isDimension}
        />
      )}
    </TouchableOpacity>
  );
};

export default Button;
