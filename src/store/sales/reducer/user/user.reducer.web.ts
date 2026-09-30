/**
 * Store to handle all the user related activities
 *
 * @module store/reducer/user
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { UserStore } from 'store/sales/types/user';
import { resetUserSession, setToken } from 'utils/sessionHelper';

/**
 * reducer initialState
 *
 * @type {object}
 * @property {string} text - content for the reducer initialState
 */

const initialState: UserStore = {
  info: {
    roleId: '',
    userId: '',
    mdn: '',
    name: '',
    userStatus: '',
    internalRole: '',
    hideAscWarranty: '',
  },
  isAuthenticated: false,
  isRedirection: false,
  navigation: {
    menus: [],
    routes: [],
    dashboard: [],
  },
  accessExpiry: '',
  refreshExpiry: '',
  userDetails: {},
  storeRmn: '',
  isLocalAuthenticated: false,
  deviceId: '',
  eligibleStoreAutomation: false,
};

/**
 * Represents a user reducer
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns user
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<any>) {
      // set access and refresh token
      setToken({ accessToken: action.payload.info?.accessToken, refreshToken: action.payload.info?.refreshToken });
      return {
        ...state,
        info: {
          roleId: action.payload.info.roleId,
          userId: action.payload.info.userId,
          mdn: action.payload.info.mdn,
          name: action.payload.info.name,
          userStatus: action.payload.info.userStatus,
          internalRole: action.payload.info.internalRole,
          hideAscWarranty: action.payload.info.hideAscWarranty,
        },
        isAuthenticated: true,
        isRedirection: action.payload.isRedirection,
        navigation: action.payload.info.navigation,
        accessExpiry: action.payload.info?.accessExpiry,
        refreshExpiry: action.payload.info?.refreshExpiry,
        eligibleStoreAutomation: action.payload.info?.eligibleStoreAutomation,
      };
    },
    logout() {
      resetUserSession();
      return {
        ...initialState,
      };
    },
    refreshToken(state, action: PayloadAction<any>) {
      setToken({ accessToken: action.payload?.accessToken, refreshToken: action.payload?.refreshToken });
      return {
        ...state,
        accessExpiry: action.payload?.accessExpiry,
        refreshExpiry: action.payload?.refreshExpiry,
      };
    },

    resetExpiry(state) {
      return {
        ...state,
        accessExpiry: '',
      };
    },

    getAsmCsmMobileName(state, action: PayloadAction<Partial<ParentObject>>) {
      return {
        ...state,
        info: {
          ...state.info, // ✅ Keep other `info` properties
          mdn: action.payload.mobile ?? state.info.mdn,
          name: action.payload.name ?? state.info.name,
        },
      };
    },

    handleUserDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        userDetails: action.payload,
      };
    },
    handleNavigationDetails(state, action: PayloadAction<any>) {
      return {
        ...state,
        navigation: action.payload,
      };
    },
  },
});

export const { actions } = userSlice;

export default userSlice.reducer;
