/**
 * Modal show their content next to a specific anchor component upon user interaction.
 *
 * @module components/Modal
 * @memberof - Common Component
 */
import React, { ReactNode, useEffect, useState, JSX, MutableRefObject } from 'react';
import { View, Easing, ViewStyle, DimensionValue } from 'react-native';
import Popover, { PopoverMode, PopoverPlacement, Size } from 'react-native-popover-view';
import { Sizing } from 'styles';
import { MODAL_EVENTS, modalEventEmitter } from 'utils/modalWithTransition';
import styles from './Modal.styles';

/** @typedef {'top' | 'bottom' | 'left' | 'right'} CustomPlacement */
type CustomPlacement = PopoverPlacement | PopoverPlacement[] | 'top' | 'bottom' | 'left' | 'right';

/** @type {PopoverPlacement} */
export const ModalPlacement = PopoverPlacement;
export type ModalPlacementType = PopoverPlacement;

/** @type {PopoverMode} */
export const ModalPopOverMode = PopoverMode;

/** @type {Size} */
export const ModalSizeProp = Size;

/**
 * @typedef {object} ModalProps
 * @property {boolean} [isVisible=false] - Indicates whether the modal is visible or not.
 * @property {onClose} [onClose] - Function to be called when the modal is closed.
 * @property {object} [modalStyle] - Style object for the modal.
 * @property {number} [height=Sizing.x100] - Height of the modal.
 * @property {number} [width=Sizing.x350] - Width of the modal.
 * @property {string | JSX.Element | JSX.Element[] | ReactNode} [children] - Content of the modal.
 * @property {MutableRefObject<null>} [modalTarget] - Reference to the anchor component.
 * @property {CustomPlacement | PopoverPlacement} [placementType] - Placement type of the modal.
 * @property {boolean} [animation] - Indicates whether animation is enabled for the modal.
 * @property {{width: number, height: number}} [arrowSize] - Optional size of the modal's arrow.
 * @property {PopoverMode} [mode] - The mode of the popover.
 * @property {ViewStyle} [popoverStyle] - Optional style for the popover container.
 */

/**
 * Represents a callback function invoked when the modal is closed.
 * @callback onClose
 * @param {boolean} open - The new value of the checkbox.
 * @returns {void}
 */
export type ModalProps = {
  isVisible?: boolean;
  onClose?: (open: boolean, data: any) => void;
  modalStyle?: object;
  height?: DimensionValue;
  width?: DimensionValue;
  children?: string | JSX.Element | JSX.Element[] | ReactNode;
  modalTarget?: MutableRefObject<null>;
  placementType?: CustomPlacement;
  animation?: boolean;
  arrowSize?: Pick<Size, 'width' | 'height'>;
  mode?: PopoverMode;
  popoverStyle?: ViewStyle;
  isBackgroundBlurRequired?: boolean;
  arrowShift?: number;
  backgroundStyle?: object;
  closeOnOutsideClick?: boolean;
};

const Animation = { duration: Sizing.x500, easing: Easing.inOut(Easing.quad) };

/**
 * Represents a Modal component.
 *
 * @component
 * @param {ModalProps} props - React properties passed from composition.
 * @returns {JSX.Element} The Modal component.
 */
const Modal = ({
  isVisible = false,
  modalStyle = {},
  height = Sizing.x100,
  width = Sizing.x350,
  children,
  modalTarget,
  onClose,
  placementType,
  animation,
  arrowSize,
  mode = PopoverMode.RN_MODAL,
  popoverStyle,
  isBackgroundBlurRequired = false,
  arrowShift,
  backgroundStyle,
  closeOnOutsideClick = true,
}: ModalProps) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(isVisible);
  }, [isVisible]);

  const handleOnClose = (isOpened: boolean = !closeOnOutsideClick) => {
    setShowModal(isOpened);
    onClose?.(isOpened, '');
  };

  const onCloseComplete = () => {
    handleOnClose(false);
    modalEventEmitter.emit(MODAL_EVENTS.CLOSED);
  };

  return (
    <Popover
      from={modalTarget}
      isVisible={showModal}
      onRequestClose={handleOnClose}
      onCloseComplete={() => onCloseComplete}
      backgroundStyle={[styles.backgroundStyle, backgroundStyle, isBackgroundBlurRequired && styles.backgroundBlurStyle]}
      animationConfig={animation ? Animation : {}}
      arrowSize={arrowSize}
      mode={mode}
      placement={Array.isArray(placementType) ? (placementType as PopoverPlacement[]) : (placementType as PopoverPlacement)}
      popoverStyle={popoverStyle}
      arrowShift={arrowShift}
    >
      <View style={[styles.modalViewStyle, { height, width }, modalStyle]} testID="modal-test">
        {children}
      </View>
    </Popover>
  );
};

export default Modal;
