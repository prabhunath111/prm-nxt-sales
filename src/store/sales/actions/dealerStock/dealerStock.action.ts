/**
 * Redux store for dealer stocks
 *
 * @module store/sales/actions/dealerStock
 *
 */
import { sliceActions } from 'store/sales/reducer/dealerStock';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import formActions from 'store/sales/actions/form';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import commonActions from 'store/sales/actions/common';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, PROPERTIES, QUERY, ROUTE, STATE_KEY } from 'const';
import i18next from 'i18next';
import { callAction } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Displays the Dealer stock modal.
 *
 * @function dealerStockModal
 * @returns {void}
 */
export const dealerStockModal =
  (params: ParentObject): AppThunk =>
  (dispatch) =>
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.DEALER_STOCK,
        showCloseIcon: params?.showCloseIcon ?? true,
        showHeader: true,
        formName: FORMS.dealerStock,
        headerIcon: ICONS.DEALER_STOCK,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getProductTypes({ exampleParam: 'exampleValue' }));
 */
export const getProductTypes =
  (params: ParentObject, _queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    dispatch(sliceActions.setProductTypeDropdown(PROPERTIES.DEALER_STOCK.PRODUCT_TYPE));
    dispatch(sliceActions.setFilteredStock({}));
    dispatch(callAction({ ...params }, QUERY.GetStocksList, '', navigate));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getDealerStocks({ exampleParam: 'exampleValue' }));
 */
export const getDealerStocks =
  (params: ParentObject, queryName: string, _stateKey: any, navigate: any): AppThunk =>
  (dispatch) => {
    const requestInput = {
      input: {
        id: params?.subscriberInfo,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.DealerStock.DealerStockEVDDealerIDMDNProceed.moduleName, {
          [MoengageMixpanelModules.DealerStock.DealerStockEVDDealerIDMDNProceed.attributes.Status]: true,
          [MoengageMixpanelModules.DealerStock.DealerStockEVDDealerIDMDNProceed.attributes.iD]: params?.subscriberInfo,
        });
        const data = refactorResponse(response);
        dispatch(sliceActions.setStockList(data));
        if (navigate) {
          navigate(ROUTE.WEB.DEALER_STOCK_LIST);
        }
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(commonActions.setErrorMessage(error.message));
        return { status: false, message: error.message };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Displays the Dealer stock modal.
 *
 * @function dealerStockModal
 * @returns {void}
 */
export const filterDealerStock =
  (_params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    const { multiCheckboxStockFilter } = getState().dealerStock;
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.DealerStock.DealerStockConfigureApply.moduleName, {
      [MoengageMixpanelModules.DealerStock.DealerStockConfigureApply.attributes.Status]: true,
      [MoengageMixpanelModules.DealerStock.DealerStockConfigureApply.attributes.formName]: multiCheckboxStockFilter,
    });
    dispatch(formActions.setFormValues(multiCheckboxStockFilter, STATE_KEY.MODAL_STATE));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: false,
        type: CHILD_TYPE.DYNAMIC_FORM,
        headerTitle: i18next.t(`strings.${HEADER_TITLE.CONFIGURE}`),
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.filterDealerStock,
      }),
    );
  };

/**
 * Apply the filter stocks.
 *
 * @function filterStocks
 * @returns {void}
 */
export const filterStocks =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setFilteredStock(params));
    dispatch(uiActions.hideBottomModal());
  };
