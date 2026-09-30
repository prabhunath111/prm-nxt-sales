import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ALERT, MODAL } from 'const';
import { ParentObject } from 'store/sales/types/common';

export interface UIObject {
  [key: string]: any;
}
interface UIState {
  error: {
    message: string | null;
  };
  hasAlert: boolean;
  hasError: boolean;
  alert: {
    message: string | null;
    duration: number;
    type: string;
    buttonInfo?: UIObject;
    childInfo?: UIObject;
  };
  loaderInfo: {
    message: string | null;
  };
  isLoading: boolean;
  isModalLoading: boolean;
  isToast: boolean;
  isDrawerOpen: boolean;
  bottomModal: {
    isModalVisible: boolean;
    type: string;
    headerTitle: string;
    headerIcon: string;
    showCloseIcon: boolean;
    showHeader: boolean;
    formName: string;
    data: ParentObject;
    buttonInfo?: ParentObject;
    isCenterModal?: boolean;
    buttonInlineStyle?: boolean;
  };
  isLangSelectorModalVisible: boolean;
}

const modalDefault = {
  isModalVisible: false,
  type: 'form',
  headerTitle: '',
  headerIcon: '',
  showCloseIcon: true,
  showHeader: true,
  formName: '',
  data: {},
  buttonInfo: {},
  isCenterModal: false,
  buttonInlineStyle: false,
};

const initialState: UIState = {
  hasAlert: false,
  hasError: false,
  alert: {
    message: null,
    duration: 5000,
    type: ALERT.INFO,
    buttonInfo: {
      primaryText: MODAL.YES,
      secondaryText: MODAL.NO,
      isPrimaryRequire: true,
      isSecondaryRequire: true,
      primaryAction: null,
      redirectUser: false,
    },
    childInfo: {
      type: null,
      data: null,
      action: {},
    },
  },
  error: {
    message: null,
  },
  loaderInfo: {
    message: null,
  },
  isLoading: false,
  isModalLoading: false,
  isToast: false,
  isDrawerOpen: false,
  bottomModal: modalDefault,
  isLangSelectorModalVisible: false,
};

const uiSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<any>) {
      return {
        ...state,
        error: { message: action.payload.message },
        alert: {
          ...state.alert,
          message: action.payload.message,
          type: ALERT.ERROR,
          buttonInfo: {
            primaryText: MODAL.OK,
            secondaryText: MODAL.NO,
            isPrimaryRequire: true,
            isSecondaryRequire: false,
            primaryAction: null,
            redirectUser: action.payload.redirectUser,
          },
        },
        hasError: true,
        isToast: true,
      };
    },
    setToast(state, action: PayloadAction<any>) {
      return {
        ...state,
        alert: {
          ...state.alert,
          message: action.payload.message,
          duration: action.payload.duration,
          type: action.payload.type,
        },
        hasAlert: true,
      };
    },
    setAlert(state, action: PayloadAction<any>) {
      return {
        ...state,
        alert: {
          message: action.payload.message,
          duration: action.payload.duration,
          type: action.payload.type,
          buttonInfo: {
            ...action.payload.buttonInfo,
          },
          childInfo: {
            ...action.payload.childInfo,
          },
        },
        isToast: true,
      };
    },
    clearError(state) {
      return {
        ...state,
        hasAlert: false,
        hasError: false,
        isToast: false,
        error: {
          message: null,
        },
        alert: {
          message: null,
          duration: 5000,
          type: ALERT.INFO,
          buttonInfo: {
            primaryText: MODAL.YES,
            secondaryText: MODAL.NO,
            isPrimaryRequire: true,
            isSecondaryRequire: true,
            primaryAction: null,
          },
          childInfo: {
            type: null,
            action: null,
            data: {},
          },
        },
      };
    },
    clearAlert(state) {
      return {
        ...state,
        alert: {
          message: null,
          duration: 5000,
          type: ALERT.INFO,
          buttonInfo: {
            primaryText: MODAL.YES,
            secondaryText: MODAL.NO,
            isPrimaryRequire: true,
            isSecondaryRequire: true,
            primaryAction: null,
          },
          childInfo: {
            type: null,
            action: null,
            data: {},
          },
        },
        hasAlert: false,
        hasError: false,
        isToast: false,
      };
    },
    setLoader(state, action: PayloadAction<any>) {
      return {
        ...state,
        loaderInfo: {
          message: action.payload?.message,
        },
        isLoading: true,
      };
    },
    setModalLoader(state) {
      return {
        ...state,
        isModalLoading: true,
      };
    },
    clearLoader(state) {
      return {
        ...state,
        isLoading: false,
        isModalLoading: false,
        loaderInfo: {
          message: null,
        },
      };
    },
    setBottomDrawer(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isDrawerOpen: action.payload,
      };
    },
    setBottomModal(state, action: PayloadAction<any>) {
      const { isModalVisible, type, headerTitle, headerIcon, showCloseIcon, showHeader, formName, data, buttonInfo, isCenterModal, onClose, buttonInlineStyle } = action.payload;
      return {
        ...state,
        bottomModal: {
          isModalVisible,
          type,
          headerTitle,
          headerIcon,
          showCloseIcon,
          showHeader,
          formName,
          data,
          buttonInfo,
          isCenterModal,
          buttonInlineStyle,
          onClose,
        },
      };
    },
    setDefaultBottomModal(state) {
      return {
        ...state,
        bottomModal: modalDefault,
      };
    },
    setLangSelectorModal(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLangSelectorModalVisible: action.payload,
      };
    },
  },
});

export const { actions } = uiSlice;

export default uiSlice.reducer;
