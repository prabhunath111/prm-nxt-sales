/**
 * Creates group of radio containers so only one of them is selected
 *
 * @module components/RadioContainer
 * @memberof CommonComponent
 */

import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import { STATE_KEY, STYLE_VARIANT } from 'const';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import Radio from 'components/sales/Radio/Radio';
import Text from 'components/sales/Text';
import { ParentObject } from 'store/sales/types/common';
import { useTranslation } from 'react-i18next';
import styles from './RadioContainer.styles';

/**
 * Component type definitions
 *
 * @typedef {object} RadioContainerProps
 * @property {string} [text] - The content for the component
 */
export type RadioItem = { text: string; value?: string; imageUrl?: string; amount?: string; label?: string };

interface RadioContainerProps {
  items: RadioItem[]; // Array of items with text and value properties
  defaultSelected?: string; // The default selected value
  onSelectionChange: (selected: string) => void; // Callback to expose selected value
  containerStyle?: object;
  selectedContainerStyle?: object;
  selectedValue?: string | null;
  radioItemContainer?: object;
  allowDeselect?: boolean;
  queryName?: string;
  noDefaultSelect?: boolean;
}

/**
 * Memoized RenderRadio so only selected/unselected radios update
 */
const RenderRadio = memo(
  ({ item, isSelected, onPress, containerStyle, selectedContainerStyle }: ParentObject) => {
    const { t } = useTranslation();

    if (item?.label) {
      return (
        <View style={styles.titleContainer} testID={`radio-label-${item.label}`}>
          <Text label={item.label} style={[styles.titleText]} />
          <View style={styles.line} />
        </View>
      );
    }

    return (
      <Radio
        testID={`radio-item-${item.value || item.text}`}
        key={item.value || item.text}
        styleVariant={STYLE_VARIANT.P2}
        showStatus={false}
        text={t(`strings.${item.text}`, { defaultValue: item.text })}
        isSelected={isSelected}
        onPress={onPress}
        containerStyle={containerStyle}
        selectedContainerStyle={selectedContainerStyle}
        imageUrl={item.imageUrl}
        amount={item.amount}
      />
    );
  },
  (prev, next) => prev.isSelected === next.isSelected && prev.item.value === next.item.value,
);

/**
 * Represents a RadioContainer component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered RadioContainer component
 *
 * @example
 * <RadioContainer text="Hello World!" />
 */

const RadioContainer = ({
  selectedValue,
  items,
  defaultSelected,
  onSelectionChange,
  containerStyle,
  selectedContainerStyle,
  radioItemContainer,
  allowDeselect = false,
  queryName,
  noDefaultSelect = false,
}: RadioContainerProps) => {
  const { radioContainerOptions } = useSelector((state: RootState) => state.form[STATE_KEY.FORM_STATE]);

  const options = queryName && radioContainerOptions ? radioContainerOptions[queryName] : items;

  useEffect(() => {
    if (noDefaultSelect) return;
    if (!selectedValue && defaultSelected) {
      onSelectionChange(defaultSelected);
    } else if (!selectedValue && options?.length > 0) {
      const firstItem = options[0]?.value ?? options[0]?.text;
      onSelectionChange(firstItem);
    }
  }, [options]);

  const handlePress = (value: string) => {
    if (allowDeselect && selectedValue === value) {
      onSelectionChange('');
    } else {
      onSelectionChange(value);
    }
  };

  return options?.length > 0 ? (
    <View style={[styles.container, containerStyle]} testID="radioContainerTest">
      {options?.map((item: ParentObject) => (
        <RenderRadio
          key={item.value || item.text}
          item={item}
          isSelected={item.value === selectedValue || item.text === selectedValue}
          onPress={() => handlePress(item.value ?? item.text)}
          containerStyle={radioItemContainer || containerStyle}
          selectedContainerStyle={selectedContainerStyle}
        />
      ))}
    </View>
  ) : (
    <View testID="radioContainerEmpty" />
  );
};

export default memo(RadioContainer);
