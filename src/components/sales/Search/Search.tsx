/**
 * This component can be used to search any string or number and will return the list
 *
 * @module components/Search
 * @memberof - Common Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import TextInput from 'components/sales/TextInput';
import Text from 'components/sales/Text';
import Modal, { ModalPlacement } from 'components/sales/Modal';
import Image from 'components/sales/Image';
import { Colors, Sizing } from 'styles';
import { ICONS, STRINGS } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { useEnglishInputValidation } from 'hooks/useEngInputValidation';
import styles from './Search.styles';

/**
 * Props for the Search component.
 *
 * @typedef {Object} SearchProps
 * @property {string} value - The current value of the search input.
 * @property {string} [placeholder] - Placeholder text for the search input.
 * @property {function} [onChange] - Callback function to be called when the search input value changes.
 * @property {boolean} [autoFocus] - If true, the search input will be focused when the component mounts.
 * @property {boolean} [disabled] - If true, the search input will be disabled.
 * @property {number} [modalHeight] - The height of the search modal.
 * @property {any} [modalWidth] - The width of the search modal.
 * @property {string} [id] - Identifier for the search component.
 * @property {string} [error] - Error message to display, if any.
 * @property {boolean} [searchIconDisabled] - If true, the search icon will be disabled.
 * @property {object} [searchStyles] - Additional styles to apply to the search input.
 */

export type SearchProps = {
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  isModal?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  modalHeight?: number;
  modalWidth?: any;
  id?: string;
  error?: string;
  searchIconDisabled?: boolean;
  searchStyles?: object;
  queryName?: string;
  innerContainer?: object;
  hasIcon?: boolean;
  inputFeildStyle?: object;
  formValues?: object;
  commonQueryName?: string;
};

/**
 * Represents a Search component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns Search
 */

const Search = ({
  isModal = false,
  value = '',
  placeholder,
  onChange,
  autoFocus = false,
  disabled = false,
  modalHeight = Sizing.x250,
  modalWidth = Sizing.x130,
  id,
  error,
  searchIconDisabled,
  searchStyles,
  queryName,
  innerContainer,
  hasIcon = true,
  inputFeildStyle,
  formValues,
  commonQueryName,
}: SearchProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { inputValue, inputError, onInputChange, setInputValue } = useEnglishInputValidation((text) => {
    if (onChange) onChange(text);
    setSearchValue(text);
  }, value ?? '');

  const handleOnClick = () => {
    if (!searchIconDisabled) {
      setIsVisible(!isVisible);
      if (onChange) onChange(value);
    }
    setShowModal(true);
  };

  useEffect(() => {
    if (queryName) {
      dispatch(
        callAction(
          {
            searchText: inputError ? STRINGS.INVALID : inputValue,
            queryName,
            ...formValues,
          },
          commonQueryName ?? queryName,
        ),
      );
    }
  }, [inputValue, inputError, queryName]);

  useEffect(() => {
    if (!value) {
      setSearchValue('');
      setInputValue('');
    }
  }, [value]);

  return (
    <View style={{ ...styles.container, ...searchStyles }} testID="search-test">
      <View style={[styles.innerContainer, { ...innerContainer }]}>
        {hasIcon && (
          <Pressable onPress={handleOnClick} style={styles.iconButton} disabled={disabled} ref={popoverRef}>
            <Image iconName={ICONS.SEARCH} height={Sizing.layout.x16} width={Sizing.layout.x16} isDimension={false} style={styles.iconStyle} />
          </Pressable>
        )}
        <TextInput
          placeholder={placeholder}
          value={inputValue || searchValue}
          autoFocus={autoFocus}
          inputFieldStyle={{ ...styles.inputField, ...inputFeildStyle }}
          editable={!disabled}
          onInputChange={(text: string) => onInputChange(text)}
          id={id}
          isSearch
        />
      </View>

      {isModal && (
        <Modal
          modalTarget={popoverRef}
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          height={modalHeight}
          width={modalWidth}
          placementType={ModalPlacement.BOTTOM}
          modalStyle={styles.modal}
          arrowSize={styles.arrow}
        >
          <View>{value}</View>
        </Modal>
      )}

      {(error || inputError) && <Text id={`${id}error`} label={inputError ?? error} color={Colors.error.primary} />}
    </View>
  );
};

export default Search;
