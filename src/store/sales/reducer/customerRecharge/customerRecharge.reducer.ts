/**
 * handle customer recharge api
 *
 * @module store/reducer/customerRecharge
 * @memberof - Common reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import { customerRechargeType } from 'store/sales/types/customerRecharge';

/**
 * Initial state for the customerRecharge reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */

const initialState: customerRechargeType = {
  navigationId: {},
  mainFormData: {},
  bingeFlag: 'N',
  bingeCategory: [],
  bingeDuration: [],
  bingeOfferSelected: undefined,
  androidUpgradeSelected: false,
  bingeCategorySelected: undefined,
  bingeDurationSelected: undefined,
  isBingeSelected: false,
  isRadioSelected: false,
  dataPacks: {},
  selectedId: '',
  selectedIdRadio: '',
  selectedOffer: {},
};

/**
 * Slice representing the customerRecharge reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/reducer/customerRecharge';
 * dispatch(actions.customerRechargeStart());
 * dispatch(actions.customerRechargeSuccess(data));
 */
const customerRechargeSlice = createSlice({
  name: 'customerRecharge',
  initialState,
  reducers: {
    /**
     * Action to set navigation id.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setNavigationID: (state, action) => ({
      ...state,
      navigationId: action.payload,
    }),

    /**
     * Action to set navigation id.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBingeFlag: (state, action) => ({
      ...state,
      bingeFlag: action.payload,
    }),

    /**
     * Action to set navigation id.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setDataPacks: (state, action) => ({
      ...state,
      dataPacks: action.payload,
    }),

    /**
     * Action to set form data.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setMainFormData: (state, action) => ({
      ...state,
      mainFormData: action.payload,
    }),
    /**
     * Action to set binge category data.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBingeCatgeoryData: (state, action) => ({
      ...state,
      bingeCategory: action.payload,
    }),
    /**
     * Action to set binge duration data.
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBingeDurationData: (state, action) => ({
      ...state,
      bingeDuration: action.payload,
    }),

    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBingeOfferSelected: (state, action) => ({
      ...state,
      bingeOfferSelected: action.payload,
    }),
    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setAndroidUpgradeSelected: (state, action) => ({
      ...state,
      androidUpgradeSelected: action.payload,
    }),
    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setbingeCategorySelected: (state, action) => ({
      ...state,
      bingeCategorySelected: action.payload,
    }),
    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setBingeDurationSelected: (state, action) => ({
      ...state,
      bingeDurationSelected: action.payload,
    }),
    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setIsBingeSelected: (state, action) => ({
      ...state,
      isBingeSelected: action.payload,
    }),
    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setRadioSelected: (state, action) => ({
      ...state,
      isRadioSelected: action.payload,
    }),
    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSelectedId: (state, action) => ({
      ...state,
      selectedId: action.payload,
    }),
    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSelectedIdRadio: (state, action) => ({
      ...state,
      selectedIdRadio: action.payload,
    }),
    /**
     * Action to set binge selected offer
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @param {PayloadAction<any>} action - The action containing the payload data.
     * @returns {object} The updated state with the payload data.
     */
    setSelectedOffer: (state, action) => ({
      ...state,
      selectedOffer: action.payload,
    }),
  },
});

export const { actions } = customerRechargeSlice;

export default customerRechargeSlice.reducer;
