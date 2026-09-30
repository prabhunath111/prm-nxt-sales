import { LOG } from 'config/logger';
import { AppThunk } from 'store';
import uiActions from 'store/sales/actions/ui';

import { EventEmitter } from 'events';

export const modalEventEmitter = new EventEmitter();

// Usage keys
export const MODAL_EVENTS = {
  CLOSED: 'MODAL_CLOSED_COMPLETE',
};

export const showModalWithTransition =
  (modalConfig: any): AppThunk =>
  (dispatch, getState) => {
    const openModal = () => dispatch(uiActions.showBottomModal(modalConfig));
    const { bottomModal, isModalLoading } = getState().ui;

    LOG.info(
      'showModalWithTransition => current modal:',
      bottomModal?.formName,
      '| next modal:',
      modalConfig?.formName,
      '| isLoading:',
      isModalLoading,
      '| isModalVisible:',
      bottomModal?.isModalVisible,
    );

    // Prevent reopening same modal
    if (bottomModal?.isModalVisible && bottomModal?.formName === modalConfig?.formName) {
      LOG.warn('=> Modal already visible — skipping reopen.');
      return;
    }

    // If modal or loader active → wait until closed
    if (bottomModal?.isModalVisible || isModalLoading) {
      dispatch(uiActions.hideBottomModal());
      dispatch(uiActions.clearLoader());

      const listener = () => {
        modalEventEmitter.removeListener(MODAL_EVENTS.CLOSED, listener);
        setTimeout(openModal, 50); // safe buffer
      };

      modalEventEmitter.once(MODAL_EVENTS.CLOSED, listener);
    } else {
      openModal();
    }
  };

// export const showModalWithTransition =
//   (modalConfig: any, animationDuration: number = 700): AppThunk =>
//   (dispatch, getState) => {
//     const openModal = () => {
//       dispatch(uiActions.showBottomModal(modalConfig));
//     };

//     const { bottomModal } = getState().ui;

//     if (bottomModal?.isModalVisible) {
//       // Hide current modal
//       dispatch(uiActions.hideBottomModal());

//       let retries = 0;
//       const maxRetries = 180; // ~3s max wait

//       const checkClosed = () => {
//         retries++;
//         const { bottomModal: newBottomModal } = getState().ui;

//         if (!newBottomModal?.isModalVisible) {
//           // ✅ Wait for animation to really finish before opening
//           setTimeout(openModal, animationDuration);
//         } else if (retries < maxRetries) {
//           requestAnimationFrame(checkClosed);
//         } else {
//           LOG.warn("Modal did not close in time before opening new one.");
//         }
//       };

//       requestAnimationFrame(checkClosed);
//     } else {
//       // No modal → just open with animation delay
//       setTimeout(openModal, animationDuration);
//     }
//   };
