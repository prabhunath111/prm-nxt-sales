/**
 * A DropdownItem component represents an individual item in a drop-down menu.
 *
 * @module components/DropdownItem
 * @memberof - Common Component
 */
import React from 'react';
import { Pressable } from 'react-native';
import Text from 'components/sales/Text';
import { Colors } from 'styles';
import styles from './DropdownItem.styles';

/**
 * Represents the props for the DropdownItem component.
 * @typedef {object} DropdownItemProps
 * @property {Function} [onPress] - Callback function invoked when the item is pressed.
 * @property {string} [id] - Unique identifier for the DropdownItem component.
 * @property {string} label - The label or text content of the item.
 * @property {boolean} hasNoOptionText - Indicates if the item represents a placeholder or "no option" text.
 */
export type DropdownItemProps = {
  onPress?: () => void;
  id?: string | undefined;
  label: string | undefined;
  hasNoOptionText: boolean;
};

/**
 * Represents a DropdownItem component.
 * @component
 * @param {DropdownItemProps} props - The props for the DropdownItem component.
 * @returns {JSX.Element} - The rendered DropdownItem component.
 */
const DropdownItem = ({ onPress, label, id, hasNoOptionText }: DropdownItemProps) => (
  <Pressable
    onPress={onPress}
    style={
      hasNoOptionText
        ? styles.menu
        : ({ pressed }: any) => [
            {
              backgroundColor: pressed ? Colors.primary.brand : Colors.neutral.white,
            },
            styles.menu,
          ]
    }
  >
    <Text style={styles.menuItem} id={id} label={label} />
  </Pressable>
);

export default DropdownItem;
