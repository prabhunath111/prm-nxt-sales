/**
 * create and view new dealer
 *
 * @module store/sales/actions/newDealer
 *
 */
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { refactorResponse } from 'utils/responseHelper';
import commonActions from 'store/sales/actions/common';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, FORMS, MODAL, QUERY, ROUTE, STRINGS } from 'const';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { sliceActions } from 'store/sales/reducer/newDealer';
import formActions from 'store/sales/actions/form';
import { callAction, filterByParams } from 'utils/formBuilderHelper';
import { LOG } from 'config/logger';
import { Sizing } from 'styles';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

let timeOut: ReturnType<typeof setTimeout>;

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(ViewNewDealerUnderFOS({ exampleParam: 'exampleValue' }));
 */

export const ViewNewDealerUnderFOS =
  (_params: ParentObject, queryName: string): AppThunk =>
  async (dispatch) => {
    dispatch(uiActions.setLoader());

    const requestInput = {
      formName: FORMS.viewNewDealers,
    };

    try {
      const response = await api.get(queries[queryName], requestInput);
      const data = refactorResponse(response);

      MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.ViewNewDealer_PageVisit.moduleName, {
        [MoengageMixpanelModules.Manage_Hierarchy.ViewNewDealer_PageVisit.attributes.Status]: true,
      });
      if (data?.result?.length > 0) {
        const sortedResult = [...data.result].sort((a, b) => Number(b.dealerCode) - Number(a.dealerCode));

        dispatch(
          commonActions.setTableColumnData({
            tableColumns: data.tableColumns,
            result: sortedResult,
          }),
        );

        return { sortedResult };
      }

      dispatch(commonActions.setErrorMessage(data?.message));
      return { status: false };
    } catch (error: any) {
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA}: ${error}`);
      return { status: false };
    } finally {
      dispatch(uiActions.clearLoader());
    }
  };

export const clearDealerTimeout = (): AppThunk => () => {
  if (timeOut) {
    clearTimeout(timeOut);
  }
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(filterSearchViewNewDealer({ exampleParam: 'exampleValue' }));
 */
export const filterSearchViewNewDealer =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    // Normalize search text
    const searchText = params?.search || (params?.search?.length > 1 ? params.search : '') || '';

    const requestInput = {
      dealerName: searchText,
      dealerCode: searchText,
      dealerMdn: searchText,
      outletType: searchText,
      status: searchText,
      createdDate: searchText,
      pinCode: searchText,
      distributorCode: searchText,
      distributorName: searchText,
      fosId: searchText,
      fosMdn: searchText,
      fosName: searchText,
      createdBy: searchText,
    };

    // Filter by search input
    let filteredData = filterByParams(tableData, requestInput);

    // Extract status ID
    const statusId = params['']?.id || params?.status?.id;
    if (statusId && statusId !== STRINGS.ALL) {
      filteredData = filteredData.filter((item: any) => item.status === statusId);
    }

    // Extract created date filter
    const createdDateId = params?.null?.id || params?.createdDateDropdown?.id;
    if (createdDateId) {
      const DAYS_MAPPING: Record<string, number> = {
        '3days': 3,
        '7days': 7,
        '15days': 15,
        lastMonth: 30,
      };

      const daysLimit = DAYS_MAPPING[createdDateId];
      if (daysLimit) {
        const compareTimestamp = Date.now() - daysLimit * 24 * 60 * 60 * 1000;

        filteredData = filteredData.filter((item: any) => {
          if (!item.createdDate) return false;

          const [day, month, year] = item.createdDate.split('/').map(Number);
          const itemDate = new Date(year, month - 1, day).getTime();
          return itemDate >= compareTimestamp;
        });
      }
    }

    // Dispatch final filtered result
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
 * dispatch(viewNewDealerASI({ exampleParam: 'exampleValue' }));
 */
export const viewNewDealerASI =
  (params: ParentObject, queryName: string): AppThunk =>
  async (dispatch) => {
    timeOut = setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, 500);

    const requestInput = {
      input: {
        formName: FORMS.viewNewDealers,
        userId: params?.distributorCode,
      },
    };

    try {
      const response = await api.get(queries[queryName], requestInput);
      const data = refactorResponse(response);

      if (data?.result?.length > 0) {
        const sortedResult = [...data.result].sort((a, b) => Number(b.dealerCode) - Number(a.dealerCode));
        dispatch(
          commonActions.setTableColumnData({
            tableColumns: data.tableColumns,
            result: sortedResult,
          }),
        );
        return { sortedResult };
      }
      dispatch(commonActions.setErrorMessage(data?.message));
      return { status: false };
    } catch (error: any) {
      dispatch(commonActions.setTableColumnData({}));
      dispatch(uiActions.showErrorPage(error.message));
      LOG.info(`${STRINGS.ERROR_OCCURED_WHILE_FETCHING_DATA}: ${error}`);
      return { status: false };
    } finally {
      dispatch(clearDealerTimeout());
      dispatch(uiActions.clearLoader());
    }
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(viewDistributorList({ exampleParam: 'exampleValue' }));
 */

export const viewDistributorList =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    api
      .get(queries.viewDistributorList, params)
      .then((response) => {
        const data = refactorResponse(response);

        const dropdownDataName = data?.result?.distCodeAndName?.map((item: ParentObject) => ({
          id: item.name,
          name: item.name,
          object: item,
        }));

        dispatch(
          commonActions.setTableColumnData({
            tableColumns: [],
            result: [],
          }),
        );
        dispatch(formAction.setDropdownOptionsData({ data: dropdownDataName, queryName }));

        const distributorList = data?.result?.distCodeAndName || [];
        const distributorResponse = data?.result?.distributorResponse || [];

        dispatch(sliceActions.setDistributorList(distributorList));
        dispatch(sliceActions.setDistributorResponse(distributorResponse));

        const selected = params?.null?.name;

        const selectedDistCode = selected?.split('-')[0]?.trim();

        // Match distCode in distributorResponse
        const match = distributorResponse.find((item: any) => item.distCode === selectedDistCode);

        if (match) {
          const inputParams = { distributorCode: match.distCode };

          dispatch(callAction(inputParams, QUERY.ViewNewDealerASI));
          dispatch(sliceActions.setSelectedDistCode(match.distCode));
        }
        dispatch(
          formActions.setUpdatedFormFields({
            createdDateDropdown: '',
            status: '',
            searchText: '',
            search: '',
          }),
        );
        return { status: true, data };
      })
      .catch((error) => {
        const message = error?.message?.split(`${STRINGS.APOLLO_ERROR}:`)?.[1]?.trim();
        dispatch(uiActions.showAlert(message, ALERT.ERROR, { primaryText: MODAL.OK, routeName: ROUTE.WEB.HOME, closeView: true }, { data: null }));
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
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
 * dispatch(viewDistributorListCSM({ exampleParam: 'exampleValue' }));
 */
export const viewDistributorListCSM =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) =>
    api
      .get(queries.viewDistributorList, params)
      .then((response) => {
        dispatch(
          commonActions.setTableColumnData({
            tableColumns: [],
            result: [],
          }),
        );
        const data = refactorResponse(response);

        const dropdownDataName = data?.result?.distCodeAndName?.map((item: ParentObject) => ({
          id: item.name,
          name: item.name,
          object: item,
        }));

        dispatch(formAction.setDropdownOptionsData({ data: dropdownDataName, queryName }));

        const distributorList = data?.result?.distCodeAndName || [];
        const distributorResponse = data?.result?.distributorResponse || [];

        dispatch(sliceActions.setDistributorList(distributorList));
        dispatch(sliceActions.setDistributorResponse(distributorResponse));

        // UPDATED: Extract distCode from selected distributor name
        const selectedDistributor = params?.null?.name;

        const selectedDistCode = selectedDistributor?.split('-')[0]?.trim();

        // UPDATED: Match by distCode in distributorResponse
        const match = distributorResponse.find((item: ParentObject) => item.distCode === selectedDistCode);

        if (match) {
          const inputParams = {
            role: match.role,
            userId: match.userId,
          };

          dispatch(callAction(inputParams, QUERY.ViewDistributorListCSMList));

          dispatch(sliceActions.setSelectedRole(match.role));
          dispatch(sliceActions.setSelectedUserId(match.userId));
        }

        dispatch(
          formActions.setUpdatedFormFields({
            asiList: '',
            createdDateDropdown: '',
            status: '',
            searchText: '',
            search: '',
          }),
        );
        return { status: true, data };
      })
      .catch((error) => {
        const message = error?.message?.split(`${STRINGS.APOLLO_ERROR}:`)?.[1]?.trim();
        dispatch(uiActions.showAlert(message, ALERT.ERROR, { primaryText: MODAL.OK, routeName: ROUTE.WEB.HOME, closeView: true }, { data: null }));
      });

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(viewDistributorListCSMList({ exampleParam: 'exampleValue' }));
 */

export const viewDistributorListCSMList =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());

    const variables = {
      userRole: params?.role,
      userIdValue: params.userId,
    };
    dispatch(formAction.setDropdownOptionsData({ data: [], queryName }));

    return api
      .get(queries.viewDistributorList, variables)
      .then((response) => {
        const data = refactorResponse(response);

        const dropdownDataName =
          data?.result?.distCodeAndName?.map((item: ParentObject) => ({
            id: item.name,
            name: item.name,
            object: item,
          })) || [];

        const distributorResponse = data?.result?.distributorResponse || [];

        dispatch(
          commonActions.setTableColumnData({
            tableColumns: [],
            result: [],
          }),
        );

        dispatch(sliceActions.setDistributorList(dropdownDataName));
        dispatch(sliceActions.setDistributorResponse(distributorResponse));

        dispatch(formAction.setDropdownOptionsData({ data: dropdownDataName, queryName }));

        return { status: true, data };
      })

      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(useStoredDropdownAndCallAPI({ exampleParam: 'exampleValue' }));
 */

export const useStoredDropdownAndCallAPI =
  (params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    timeOut = setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, Sizing.x50);

    try {
      dispatch(
        formActions.setUpdatedFormFields({
          createdDateDropdown: '',
          status: '',
          searchText: '',
          search: '',
        }),
      );
      const state = getState();
      const distributorResponse = state.newDealer?.distributorResponse;

      // Handle case if selectedName is accidentally an object
      const nameString = typeof params === 'string' ? params : params?.null?.name ?? '';
      const selectedDistCode = nameString.split('-')[0]?.trim();

      const match = distributorResponse.find((item: ParentObject) => item.distCode === selectedDistCode);

      if (match) {
        const inputParams = { distributorCode: match.distCode };

        await dispatch(callAction(inputParams, QUERY.ViewNewDealerASI));

        dispatch(sliceActions.setSelectedDistCode(match.distCode));
        return { status: true, distributorCode: match.distCode };
      }
      return { state: false };
    } catch (error: any) {
      dispatch(uiActions.showErrorPage(error.message));
      return { status: false };
    } finally {
      dispatch(uiActions.clearLoader());
    }
  };
