/**
 * tsra inventory reducer will be responcible for tsra inventory actions
 *
 * @module store/sales/actions/tsraInventory
 *
 */
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { tsraInventoryType } from 'store/sales/types/tsraInventory';
import { refactorResponse } from 'utils/responseHelper';
import { LOG } from 'config/logger';
import { CHILD_TYPE, FORMS, HEADER_TITLE, STATE_KEY, STRINGS } from 'const';
import { sliceActions } from 'store/sales/reducer/tsraInventory';
import { filterByParams } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import i18next from 'i18next';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(tsraInventory({ exampleParam: 'exampleValue' }));
 */
export const tsraInventory =
  (params: tsraInventoryType, queryName: string): AppThunk =>
  async (dispatch) => {
    const selectedIds = Array.isArray((params as ParentObject)?.multiCheckbox) ? (params as ParentObject).multiCheckbox.map((item: ParentObject) => item.id) : [];

    const normalizedParams: Record<string, boolean | null> = {
      supplyInformation: null,
      maximumStock: null,
      currentStock: null,
      consumtionInformation: null,
    };
    selectedIds.forEach((id: string) => {
      normalizedParams[id] = true;
    });

    dispatch(uiActions.hideBottomModal());
    // setTimeout(() => {
    dispatch(uiActions.setLoader());
    // }, 100);

    dispatch(commonActions.setTableColumnData({ tableColumns: [], result: [] }));

    try {
      const response = await api.get(queries[queryName], {
        formName: FORMS.tsraInventory,
      });
      const data = refactorResponse(response);

      dispatch(formActions.setUpdatedFormFields({ hideZeroInventory: false, showLowSupply: false }));

      dispatch(
        sliceActions.setSelcectedFilters({
          ...normalizedParams,
          multiCheckbox: (params as ParentObject)?.multiCheckbox || null,
        }),
      );

      if (data?.tsraInventory?.length > 0) {
        // Define a mapping of params to parentHeading values
        const allowedHeadingsMap: Record<string, string> = {
          all: STRINGS.ALL,
          supplyInformation: STRINGS.SUPPLY_INFORMATION,
          maximumStock: STRINGS.MAXIMUM_STOCK,
          currentStock: STRINGS.CURRENT_STOCK,
          consumtionInformation: STRINGS.CONSUMPTION_INFO,
        };
        // Check if params is empty or all values are falsy (null/false)
        // Calculate the count of `true` values in params

        const filterCount = Object.values(normalizedParams).filter(Boolean).length;
        const isParamsEmpty = Object.keys(normalizedParams).length === 0;
        const hasNoTruthyValues = Object.values(normalizedParams).every((value) => !value);
        // If params is empty OR all values are falsy, show all columns
        if (isParamsEmpty || hasNoTruthyValues) {
          dispatch(
            commonActions.setTableColumnData({
              tableColumns: data?.tableColumns,
              result: data?.tsraInventory,
            }),
          );
          dispatch(commonActions.setTotalListCount(data?.count));
          dispatch(sliceActions.tsraFilterCount(0));
          return { data, status: true };
        }
        // Get allowed headings from params that are true
        const allowedHeadings = normalizedParams.all
          ? [STRINGS.SUPPLY_INFORMATION, STRINGS.MAXIMUM_STOCK, STRINGS.CURRENT_STOCK, STRINGS.CONSUMPTION_INFO]
          : Object.keys(normalizedParams)
              .filter((key) => normalizedParams[key as keyof typeof normalizedParams])
              .map((key) => allowedHeadingsMap[key]); // Get corresponding headings
        // Ensure "Material List" is always included

        const filteredTableColumns = data?.tableColumns?.filter(
          (column: ParentObject) => column.parentHeadingNT === STRINGS.MATERIAL_LIST || allowedHeadings.includes(column.parentHeadingNT),
        );

        dispatch(
          commonActions.setTableColumnData({
            tableColumns: filteredTableColumns,
            result: data?.tsraInventory,
          }),
        );
        dispatch(uiActions.hideBottomModal());
        dispatch(formActions.setFormValues({ searchText: '', tsraSearch: '' }));
        dispatch(commonActions.setTotalListCount(data?.count));
        dispatch(sliceActions.tsraFilterCount(filterCount));
        return { data, status: true };
      }

      dispatch(commonActions.setErrorMessage(data?.message));
      return { data, status: false };
    } catch (error: any) {
      dispatch(uiActions.hideBottomModal());
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA}: ${error}`);
      return { status: false };
    } finally {
      dispatch(uiActions.clearLoader());
    }
  };

export const filterInventory =
  (_params: tsraInventoryType): AppThunk =>
  async (dispatch, getState) => {
    const { selcectedFilters } = getState().tsraInventory;

    dispatch(formActions.setFormValues(selcectedFilters, STATE_KEY.MODAL_STATE));
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: false,
        type: CHILD_TYPE.DYNAMIC_FORM,
        headerTitle: i18next.t(`strings.${HEADER_TITLE.CONFIGURE}`),
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.filterTsraInventory,
      }),
    );
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.tsraInventory.TSRAInventory_Configure.moduleName, {
      [MoengageMixpanelModules.tsraInventory.TSRAInventory_Configure.attributes.Status]: true,
      [MoengageMixpanelModules.tsraInventory.TSRAInventory_Configure.attributes.formName]: FORMS.filterTsraInventory,
    });
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(resetTsraFilterData({ exampleParam: 'exampleValue' }));
 */
export const resetTsraFilterData =
  (_params: tsraInventoryType): AppThunk =>
  async (_dispatch) => {
    _dispatch(sliceActions.tsraFilterCount(''));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(searchTsraInventory({ exampleParam: 'exampleValue' }));
 */

export const searchTsraInventory =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    const { showLowSupply, hideZeroInventory } = params;
    const requestInput = {
      materialNameNT: params?.searchText || (params?.tsraSearch?.length > 1 && params?.tsraSearch) || '',
    };
    let filteredData = filterByParams(tableData, requestInput);
    if (hideZeroInventory) {
      filteredData = filteredData.filter((item: any) => {
        const maxStock = Number(item.inhandstock) || 0;
        const stockLeft = Number(item.daysOfStockLeft) || 0;
        return maxStock > 0 || stockLeft > 0;
      });
    }
    if (showLowSupply) {
      filteredData = [...filteredData].sort((a, b) => {
        const aVal = Number(a.quantitytobesupplied) || 0;
        const bVal = Number(b.quantitytobesupplied) || 0;
        return aVal - bVal;
      });
    }
    dispatch(commonActions.setTotalListCount(filteredData.length));
    dispatch(commonActions.setTableFilteredData({ result: filteredData }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(sortInventoryTable({ exampleParam: 'exampleValue' }));
 */

export const sortTsraInventoryAlphabetically = (): AppThunk => (dispatch, getState) => {
  const { tableData, tableFilteredData } = getState().common;
  const baseData = tableFilteredData || tableData;
  const sortedData = [...baseData].sort((a, b) => a.materialNameNT.localeCompare(b.materialNameNT));

  dispatch(commonActions.setTableFilteredData({ result: sortedData }));
  dispatch(commonActions.setTotalListCount(sortedData.length));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(sortInventoryTableInDes({ exampleParam: 'exampleValue' }));
 */

export const sortTsraInventoryByMaxStockDays = (): AppThunk => (dispatch, getState) => {
  const { tableData, tableFilteredData } = getState().common;
  const baseData = tableFilteredData || tableData;
  const sortedData = [...baseData].sort((a, b) => b.inhandstock - a.inhandstock);

  dispatch(commonActions.setTableFilteredData({ result: sortedData }));
  dispatch(commonActions.setTotalListCount(sortedData.length));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(sortInventoryTableAsc({ exampleParam: 'exampleValue' }));
 */

export const sortTsraInventoryByMaxStockDaysAsc = (): AppThunk => (dispatch, getState) => {
  const { tableData, tableFilteredData } = getState().common;
  const baseData = tableFilteredData || tableData;
  const sortedData = [...baseData].sort((a, b) => a.inhandstock - b.inhandstock);

  dispatch(commonActions.setTableFilteredData({ result: sortedData }));
  dispatch(commonActions.setTotalListCount(sortedData.length));
};
