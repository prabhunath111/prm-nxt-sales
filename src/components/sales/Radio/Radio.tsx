import React from 'react';
import { View, Pressable } from 'react-native';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { STYLE_VARIANT } from 'const';
import { Image, Text } from 'components/sales';
import { Sizing } from 'styles';
import styles from './Radio.styles';

/**
 * Component type definitions
 * @typedef {object} RadioButtonProps
 * @property {string} text - The label text for the radio button.
 * @property {boolean} isSelected - Indicates whether the radio button is selected.
 * @property {boolean} isActive - Indicates whether the radio button is active.
 * @property {function} onPress - Callback function invoked when the radio button is pressed.
 */

interface RadioButtonProps {
  text: string;
  label?: string;
  isSelected: boolean;
  isActive?: boolean;
  onPress: () => void;
  showStatus?: boolean;
  containerStyle?: object;
  selectedContainerStyle?: object;
  styleVariant?: string;
  imageUrl?: string;
  amount?: string;
  testID?: string;
}

/**
 * Represents a Radio component
 * @param {RadioButtonProps} props - Properties passed to the Radio component.
 * @returns {JSX.Element} The rendered Radio component
 */

const Radio = ({
  text,
  label,
  isSelected,
  isActive,
  onPress,
  showStatus = true,
  containerStyle,
  selectedContainerStyle,
  styleVariant = STYLE_VARIANT.P1,
  imageUrl,
  amount,
  testID,
}: RadioButtonProps) => {
  const { inflection } = useInflection();
  const appliedStyles = styles[styleVariant];

  return (
    <Pressable testID={testID} style={[appliedStyles.radioContainer, containerStyle, isSelected && selectedContainerStyle]} onPress={onPress}>
      <View style={appliedStyles.radioCircle}>{isSelected ? <View style={appliedStyles.selectedRb} /> : null}</View>
      <View style={appliedStyles.rightContainer}>
        {imageUrl ? (
          <View style={[appliedStyles.subContainer, styles[gcs('subContainer', inflection, true, ['md', 'lg', 'xl'])], appliedStyles.rowCenterBetween]}>
            <View style={appliedStyles.rowAlignShrink}>
              <Image iconName={imageUrl} borderRadius={Sizing.layout.x8} style={[appliedStyles.imageStyle, appliedStyles.customImageStyle]} />
              <Text style={appliedStyles.radioText}>{text}</Text>
            </View>

            {amount && <Text style={appliedStyles.amountText}>{amount}</Text>}
          </View>
        ) : (
          <View style={[appliedStyles.subContainer, styles[gcs('subContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={appliedStyles.radioText}>{text}</Text>
            {showStatus && <Text style={[appliedStyles.activeText, !isActive && appliedStyles.inActiveText]}>{label}</Text>}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default Radio;
