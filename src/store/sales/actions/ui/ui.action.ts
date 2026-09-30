import { sliceActions } from 'store/sales/reducer/ui';
import { ALERT, STRINGS } from 'const';
import { AppThunk, RootState } from 'store';

export interface UIObject {
  [key: string]: any;
}

/**
 * Show Toast
 * @param message - The parameters for display message to the user.
 * @param duration  - The parameters for view the alert based on duration.
 * @param type - The parameters refers toast information .
 * @returns A thunk action.
 */
export const showToast =
  (message: string, duration = 5000, type = ALERT.INFO): AppThunk =>
  (dispatch) =>
    dispatch(sliceActions.setToast({ message, duration, type }));

/**
 * It is used to hide toast
 * @returns  A thunk action.
 */
export const clearAlert = (): AppThunk => (dispatch) => dispatch(sliceActions.clearAlert());

export const showError = (message: string, duration = 5000) => showToast(message, duration, ALERT.ERROR);
export const showSuccess = (message: string, duration = 5000) => showToast(message, duration, ALERT.SUCCESS);
export const showWarning = (message: string, duration = 5000) => showToast(message, duration, ALERT.WARNING);
export const showInfo = (message: string, duration = 5000) => showToast(message, duration, ALERT.INFO);

/**
 * It is used to show modal in UI
 * @param message - The parameters for display message to the user
 * @param type - The parameters refers toast information
 * @param buttonInfo - The parameters for display confirmation to the user
 * @param childInfo - The parameters for display additional children in modal
 * @param duration  - The parameters for view the alert based on duration.
 * @returns A thunk action.
 */
export const showAlert =
  (message: string, type: string, buttonInfo: UIObject, childInfo: UIObject, duration = 5000): AppThunk =>
  (dispatch) => {
    dispatch(
      sliceActions.setAlert({
        message,
        duration,
        type,
        buttonInfo,
        childInfo,
      }),
    );
  };

/**
 * It is used to show modal in UI
 * @param modalDetails - bottom related parameter
 * @returns A thunk action.
 */
export const showBottomModal =
  (modalDetails: UIObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setBottomModal({ ...modalDetails }));
  };

/**
 * hide modal from screen
 * @returns A thunk action.
 */
export const hideBottomModal = (): AppThunk => (dispatch) => dispatch(sliceActions.setDefaultBottomModal());

/**
 * Show error alert in screen
 * @param errorMessage - The parameters for display the error message in screen
 * @returns A thunk action.
 */
export const showErrorPage =
  (errorMessage: string, redirectUser: boolean = false): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setError({ message: errorMessage?.split(`${STRINGS.APOLLO_ERROR}:`)[1] ?? errorMessage, redirectUser }));
  };

/**
 * Hide error alert in screen
 * @returns A thunk action.
 */
export const exitErrorPage = (): AppThunk => (dispatch) => dispatch(sliceActions.clearError());

/**
 * Show loader alert in screen
 * @param message - The parameters for display message to the user
 * @returns A thunk action.
 */
export const setLoader =
  (message: string | null = null): AppThunk =>
  (dispatch, getState) => {
    const { isLoading } = (getState() as RootState).ui; // Access the isLoading state

    // Only dispatch the action if the loader is already false
    if (!isLoading) {
      dispatch(
        sliceActions.setLoader({
          message,
        }),
      );
    }
  };

/**
 * Clear loader alert in screen
 * @returns A thunk action.
 */
export const clearLoader = (): AppThunk => (dispatch) => dispatch(sliceActions.clearLoader());

/**
 * toggles the bottom drawer
 * @param payload acceptes boolean value
 * @returns A thunk action
 */
export const toggleDrawer =
  (payload: boolean): AppThunk =>
  (dispatch) =>
    dispatch(sliceActions.setBottomDrawer(payload));

/**
 * Set isModalLoading from screen
 * @returns A thunk action.
 */
export const setModalLoader = (): AppThunk => (dispatch) => dispatch(sliceActions.setModalLoader());

/**
 * Set language selector modal for mobile
 * @returns A thunk action.
 */
export const handleLangSlectorModal =
  (payload: boolean): AppThunk =>
  (dispatch) =>
    dispatch(sliceActions.setLangSelectorModal(payload));
