/**
 * this is the reducer for the quotation module
 *
 * @module store/sales/reducer/quotation
 * @memberof - Common reducer
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParentObject } from 'store/sales/types/common';
import { quotationType } from 'store/sales/types/quotation';

/**
 * Initial state for the quotation reducer.
 *
 * @type {object}
 * @property {string} text - Default text for the initial state.
 */
const initialState: quotationType = {
  etskOfferType: [],
  etskLocationData: [],
  etskPincode: '',
  boxType1: {},
  boxType2: {},
  boxType3: {},
  mobileNo: '',
  email: '',
  isQuotationNavigate: false,
  etskTownLocality: {},
  etskOfferSelected: {},
  etskboxType: {},
  multiTvSubID: '',
  multiTvBoxType: {},
  multiTVregisterFromQuote: false,
  multiTvTskProps: {},
  multiTVDetails: {},
  tskTypesData: {},
  boxTypeData: [],
  primaryTskType: '',
  numberOfConnections: {},
  numberOfConnectionsData: [],
  isPrimaryEdit: false,
  isEtskEdit: false,
  selectedTsk: '',
  boxPriceFinal: '',
  totalPrice: '',
  urlLastPart: '',
  isMultiTv: false,
  isWalkIn: false,
  redirectParams: {},
  redirectUrl: '',
  primaryTskTypeObject: {},
  tSKtype1SelectedObject: {},
  tSKtype2SelectedObject: {},
  tSKtype3SelectedObject: {},
};

/**
 * Slice representing the quotation reducer.
 *
 * @constant
 * @type {Slice}
 * @param {object} state - The current state of the reducer.
 * @param {PayloadAction} action - The action dispatched to the reducer.
 * @returns {Slice}
 *
 * @example
 * import { actions } from 'store/sales/reducer/quotation';
 * dispatch(actions.quotationStart());
 * dispatch(actions.quotationSuccess(data));
 */
const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    /**
     * Action to add the offer type in offer dropdown
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetOfferType(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        etskOfferType: action.payload,
      };
    },
    /**
     * Action to add the location data in town/locality dropdown
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetLocationData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        etskLocationData: action.payload,
      };
    },
    /**
     * Action to add the pincode filled by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetPincode(state, action: PayloadAction<string>) {
      return {
        ...state,
        etskPincode: action.payload,
      };
    },
    /**
     * Action to set the town/locality object selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetTownLocality(state, action: PayloadAction<ParentObject | undefined>) {
      return {
        ...state,
        etskTownLocality: action.payload,
      };
    },
    /**
     * Action to add the offer type object selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetOfferSelected(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        etskOfferSelected: action.payload,
      };
    },
    /**
     * Action to set the box type object selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetPrimaryBoxSelected(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        etskboxType: action.payload,
      };
    },
    /**
     * Action to set the secondary box 1 object selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    etskSetBoxType1Selected(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        boxType1: action.payload,
      };
    },
    /**
     * Action to set the secondary box 2 object selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    etskSetBoxType2Selected(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        boxType2: action.payload,
      };
    },
    /**
     * Action to set the secondary box 3 object selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    etskSetBoxType3Selected(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        boxType3: action.payload,
      };
    },
    /**
     * Action to set the mobile number selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetMobile(state, action: PayloadAction<string>) {
      return {
        ...state,
        mobileNo: action.payload,
      };
    },
    /**
     * Action to set the email id selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetEmail(state, action: PayloadAction<string>) {
      return {
        ...state,
        email: action.payload,
      };
    },
    /**
     * Action to check if the user is coming to registration modules from quotation
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetIsQuotationNavigate(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isQuotationNavigate: action.payload,
      };
    },

    /**
     * Action to add the pincode filled by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationMultiTVSetSubID(state, action: PayloadAction<string>) {
      return {
        ...state,
        multiTvSubID: action.payload,
      };
    },

    /**
     * Action to add the pincode filled by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationMultiTVsetBoxType(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        multiTvBoxType: action.payload,
      };
    },

    /**
     * Action to add the pincode filled by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationsetMultiTVRegistration(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        multiTVregisterFromQuote: action.payload,
      };
    },
    /**
     * Action to add the pincode filled by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationTskTypeforMultiTv(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        multiTvTskProps: action.payload,
      };
    },

    /**
     * Action to add the pincode filled by the user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationSetMultiTVDetails(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        multiTVDetails: action.payload,
      };
    },
    /**
     * Action to set the entire tsk types data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationPrimarySetTskTypeData(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tskTypesData: action.payload,
      };
    },
    /**
     * Action to set the entire box types data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationPrimarySetBoxTypeData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        boxTypeData: action.payload,
      };
    },
    /**
     * Action to set the primary tsk type selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationPrimarySetTskType(state, action: PayloadAction<string>) {
      return {
        ...state,
        primaryTskType: action.payload,
      };
    },
    /**
     * Action to set the primary tsk type selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationPrimarySetTskTypeObject(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        primaryTskTypeObject: action.payload,
      };
    },
    /**
     * Action to set the number od connections selected by user
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationPrimarySetNumberOfConnections(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        numberOfConnections: action.payload,
      };
    },
    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationPrimarySetNoOfConnectionsData(state, action: PayloadAction<ParentObject[]>) {
      return {
        ...state,
        numberOfConnectionsData: action.payload,
      };
    },
    /**
     * Action to set if the user is editing the pincode in primary sub module
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationPrimarySetIsPrimaryEdit(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isPrimaryEdit: action.payload,
      };
    },
    /**
     * Action to set if the user is editing the pincode in etsk sub module
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotationEtskSetIsEtskEdit(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isEtskEdit: action.payload,
      };
    },
    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setSelectedTskPrice(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedTsk: action.payload,
      };
    },
    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setBoxPriceFinal(state, action: PayloadAction<string>) {
      return {
        ...state,
        boxPriceFinal: action.payload,
      };
    },
    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setTotalPrice(state, action: PayloadAction<string>) {
      return {
        ...state,
        totalPrice: action.payload,
      };
    },
    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setURLLastPart(state, action: PayloadAction<string>) {
      return {
        ...state,
        urlLastPart: action.payload,
      };
    },

    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setIsMultiTv(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isMultiTv: action.payload,
      };
    },

    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setisWalkIn(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isWalkIn: action.payload,
      };
    },

    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setRedirectParams(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        redirectParams: action.payload,
      };
    },

    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    setRedirectUrl(state, action: PayloadAction<string>) {
      return {
        ...state,
        redirectUrl: action.payload,
      };
    },
    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotSetTSKtype1SelectedObject(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tSKtype1SelectedObject: action.payload,
      };
    },
    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotSetTSKtype2SelectedObject(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tSKtype2SelectedObject: action.payload,
      };
    },
    /**
     * Action to set the entire number of connections data coming from api
     *
     * @function
     * @param {object} state - The current state of the reducer.
     * @returns {object} The updated state.
     */
    quotSetTSKtype3SelectedObject(state, action: PayloadAction<ParentObject>) {
      return {
        ...state,
        tSKtype3SelectedObject: action.payload,
      };
    },
  },
});

export const { actions } = quotationSlice;

export default quotationSlice.reducer;
