/**
 * This is the reducer for tsra approcal module.
 *
 * @module store/sales/actions/tsraApproval
 *
 */
import { sliceActions } from 'store/sales/reducer/tsraApproval';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import commonActions from 'store/sales/actions/common';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { FORMS, STRINGS } from 'const';
import { filterByParams } from 'utils/formBuilderHelper';
import i18next from 'i18next';
import { LOG } from 'config/logger';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

const MONTH_MAP: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getTSRAApprovalList({ exampleParam: 'exampleValue' }));
 */
export const getTSRAApprovalList =
  (_params: ParentObject, queryName: string, _stateKey: ParentObject, _navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      role: null,
      userId: null,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.result?.dataList?.length > 0) {
          const sortedData = [...data.result.dataList].sort((a: ParentObject, b: ParentObject) => new Date(b.createdDateNT).getTime() - new Date(a.createdDateNT).getTime());
          const updatedData = {
            ...data,
            result: {
              ...data.result,
              dataList: sortedData,
            },
          };
          dispatch(sliceActions.setTsraApprovalListData(updatedData));
        } else {
          dispatch(sliceActions.setTsraApprovalListData(data));
        }
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.TsraApproval.ActionTSRARequest_PageVisit.moduleName, {
          [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_PageVisit.attributes.Status]: true,
          [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_PageVisit.attributes.Role]: null,
          [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_PageVisit.attributes.UserId]: null,
        });
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
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
 * dispatch(getTSRATrackList({ exampleParam: 'exampleValue' }));
 */
export const getTSRATrackList =
  (_params: ParentObject, queryName: string, _stateKey: ParentObject, _navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      role: null,
      userId: null,
      days: null,
      formName: FORMS.trackTsraRequest,
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.result?.dataList?.length > 0) {
          const parseRequestedDate = (dateStr?: string) => {
            if (!dateStr) return 0;
            const [day, month, year] = dateStr.split(' ');
            return new Date(Number(year), MONTH_MAP[month], Number(day)).getTime();
          };
          const sortedData = data.result.dataList
            .map((item: ParentObject) => ({
              ...item,
              subStatus: item?.subStatus ?? i18next.t('strings.rejectedBySales'),
              requestedDateTime: parseRequestedDate(item.requestedDateNT),
            }))
            .sort((a: ParentObject, b: ParentObject) => b.requestedDateTime - a.requestedDateTime);

          LOG.info(sortedData);
          dispatch(
            commonActions.setTableColumnData({
              tableColumns: data?.tableColumns,
              result: sortedData,
            }),
          );
        }
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.TsraApproval.TrackTSRARequest_PageVisit.moduleName, {
          [MoengageMixpanelModules.TsraApproval.TrackTSRARequest_PageVisit.attributes.Status]: true,
          [MoengageMixpanelModules.TsraApproval.TrackTSRARequest_PageVisit.attributes.Days]: null,
          [MoengageMixpanelModules.TsraApproval.TrackTSRARequest_PageVisit.attributes.Role]: null,
          [MoengageMixpanelModules.TsraApproval.TrackTSRARequest_PageVisit.attributes.UserId]: null,
        });
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
        dispatch(uiActions.clearLoader());
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
 * dispatch(filterSearchTrackTsra({ exampleParam: 'exampleValue' }));
 */
export const filterSearchTrackTsra =
  (params: ParentObject, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    // Normalize search text
    const searchText = params?.searchText || (params?.search?.length > 1 ? params.search : '') || '';
    const requestInput = {
      tsraNameNT: searchText,
      tsraCode: searchText,
      requestedDateNT: searchText,
      actionDateNT: searchText,
      tsraMobileNumber: searchText,
      tsraStatusNT: searchText,
      commentsNT: searchText,
    };
    // Filter by search input
    let filteredData = filterByParams(tableData, requestInput);
    // Extract status ID
    const statusId = params['']?.id || params?.status?.id;
    if (statusId && statusId !== STRINGS.ALL) {
      filteredData = filteredData.filter((item: ParentObject) => {
        const subStatus = item?.subStatusNT?.toLowerCase() ?? '';
        if (statusId?.toLowerCase().includes(STRINGS.REJECTED)) {
          return !subStatus;
        }
        return subStatus === statusId?.toLowerCase();
      });
    }

    const createdDateId = params?.null?.id || params?.createdDateDropdown?.id;
    if (createdDateId) {
      const DAYS_MAPPING: Record<string, number> = {
        '3days': 3,
        '7days': 7,
        '15days': 15,
        lastMonth: 30,
      };
      const daysLimit = DAYS_MAPPING[createdDateId];
      if (typeof daysLimit === 'number') {
        const compareTimestamp = Date.now() - daysLimit * 24 * 60 * 60 * 1000;
        filteredData = filteredData.filter((item: ParentObject) => item.requestedDateTime >= compareTimestamp);
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
 * dispatch(approveOrRejectTsraDealer({ exampleParam: 'exampleValue' }));
 */
export const approveOrRejectTsraDealer =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { selectedDealer } = getState().tsraApproval;
    const requestInput = {
      firstName: params?.firstName || null,
      lastName: params?.lastName || null,
      arn1: params?.mobileNumber1 || null,
      arn2: params?.mobileNumber2 || null,
      qualification: params?.qualification?.object.valueNT || null,
      twoWheelerAvailable: params?.twoWheelerAvailablity || null,
      partnerCode: selectedDealer?.tsraCode || null,
      parentCode: selectedDealer?.parentCode || null,
      partnerSubStatus: null, // null
      partnerStatus: null, // null
      comments: params?.rejectReason?.name || null,
      tsraFlag: null, // null
      installerType: params?.installerType || null,
      status: params?.firstName ? STRINGS.APPROVE : STRINGS.REJECT, // approve or reject
    };

    if (requestInput?.status === STRINGS.REJECT) {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.TsraApproval.ActionTSRARequest_RejectProceed.moduleName, {
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_RejectProceed.attributes.Status]: params?.firstName ? STRINGS.APPROVE : STRINGS.REJECT,
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_RejectProceed.attributes.InstallerType]: params?.installerType || null,
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_RejectProceed.attributes.PartnerCode]: selectedDealer?.tsraCode || null,
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_RejectProceed.attributes.PartnerStatus]: null,
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_RejectProceed.attributes.TsraFlag]: null,
      });
    }
    if (requestInput?.status === STRINGS.APPROVE) {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.TsraApproval.ActionTSRARequest_ApproveProceed.moduleName, {
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_ApproveProceed.attributes.Status]: params?.firstName ? STRINGS.APPROVE : STRINGS.REJECT,
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_ApproveProceed.attributes.InstallerType]: params?.installerType || null,
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_ApproveProceed.attributes.PartnerCode]: selectedDealer?.tsraCode || null,
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_ApproveProceed.attributes.PartnerStatus]: null,
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_ApproveProceed.attributes.TsraFlag]: null,
      });
    }
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setTsraSuccessData({ ...data, isRejected: !params?.firstName }));
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.TsraApproval.TSRA_ApprovalSuccess_PageVisit.moduleName, {
          [MoengageMixpanelModules.TsraApproval.TSRA_ApprovalSuccess_PageVisit.attributes.Status]: true,
        });
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        dispatch(uiActions.clearLoader());
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
 * dispatch(setSelectedDealer({ exampleParam: 'exampleValue' }));
 */
export const setSelectedDealer =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setSelectedDealer(params));
  };
