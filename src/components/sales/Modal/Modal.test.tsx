/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { modalEventEmitter, MODAL_EVENTS } from 'utils/modalWithTransition';
import Modal, { ModalPlacement } from './Modal';

jest.mock('react-native-popover-view', () => {
  const { View: RNView } = require('react-native');
  return {
    __esModule: true,
    PopoverMode: {
      RN_MODAL: 'rn-modal',
    },
    PopoverPlacement: {
      BOTTOM: 'bottom',
      TOP: 'top',
      LEFT: 'left',
      RIGHT: 'right',
    },
    default: ({ children, isVisible, onRequestClose, onCloseComplete }: any) =>
      isVisible ? (
        <RNView testID="popover-mock">
          {children}
          <RNView testID="popover-close" onTouchEnd={() => onRequestClose()} />
          <RNView
            testID="popover-complete"
            onTouchEnd={() => {
              const result = onCloseComplete();
              if (typeof result === 'function') result();
            }}
          />
        </RNView>
      ) : null,
  };
});

jest.mock('utils/modalWithTransition', () => ({
  MODAL_EVENTS: { CLOSED: 'MODAL_CLOSED_COMPLETE' },
  modalEventEmitter: { emit: jest.fn() },
}));

describe('Test for the component Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render component Modal', () => {
    // Covers isVisible default true in our tests usually, let's explicitly test without it
    render(<Modal isVisible />);
    expect(screen.getByTestId('modal-test')).toBeTruthy();
  });

  test('render Modal with no isVisible prop and check background/animation props', () => {
    const { rerender } = render(<Modal />);

    // By default it should not show since isVisible=false
    // The popover mock returns null when isVisible is false
    expect(screen.queryByTestId('modal-test')).toBeNull();

    // Re-render with blur and animation to cover lines 117-118
    rerender(<Modal isVisible isBackgroundBlurRequired animation />);
    expect(screen.getByTestId('modal-test')).toBeTruthy();
  });

  test('handle onClose', () => {
    const onClose = jest.fn();
    render(<Modal isVisible onClose={onClose} />);

    // Trigger onRequestClose from Popover
    fireEvent(screen.getByTestId('popover-close'), 'touchEnd');
    expect(onClose).toHaveBeenCalled();
  });

  test('handle onClose with closeOnOutsideClick false', () => {
    const onClose = jest.fn();
    render(<Modal isVisible onClose={onClose} closeOnOutsideClick={false} />);

    fireEvent(screen.getByTestId('popover-close'), 'touchEnd');
    expect(onClose).toHaveBeenCalledWith(true, '');
  });

  test('handle onCloseComplete', () => {
    render(<Modal isVisible />);

    // Trigger onCloseComplete from Popover
    fireEvent(screen.getByTestId('popover-complete'), 'touchEnd');
    expect(modalEventEmitter.emit).toHaveBeenCalledWith(MODAL_EVENTS.CLOSED);
  });

  test('placementType as array', () => {
    render(<Modal isVisible placementType={[ModalPlacement.BOTTOM]} />);
    expect(screen.getByTestId('modal-test')).toBeTruthy();
  });

  test('snapshot tests for Modal', () => {
    const component = render(
      <View>
        <Modal isVisible={false} />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
