/**
 * In this reducer we will manage all partner approval information
 *
 * @module store/sales/actions/partnerApproval
 *
 */
import { sliceActions } from 'store/sales/reducer/partnerApproval';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import commonActions from 'store/sales/actions/common';
import { CHILD_TYPE, FORMS, HEADER_TITLE, MODAL, PROPERTIES, QUERY, ROUTE, STRINGS } from 'const';
import { refactorResponse } from 'utils/responseHelper';
import formActions from 'store/sales/actions/form';
import { ParentObject } from 'store/sales/types/common';
import { callAction, filterByParams } from 'utils/formBuilderHelper';
import { PARTNER_ROLES } from 'const/strings';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

let partnerApprovalTimeoutId: ReturnType<typeof setTimeout>;

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getDropDownListAndRejectReasons({ exampleParam: 'exampleValue' }));
 */
export const getDropDownListAndRejectReasons =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    partnerApprovalTimeoutId = setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, 100);
    const { info } = getState().user;
    const { initialData } = getState().partnerApproval;
    const asiDetails = initialData?.result?.asiDetails?.filter((val: ParentObject) => val?.fullName?.trim() === params?.name);

    let userId = null;
    let role = null;
    let directDis = null;
    if (asiDetails?.[0]) {
      if (asiDetails[0].fullName === STRINGS.DIS_DIRECTLY_MAPPED_TO_CSM) {
        userId = info?.userId ?? null;
        role = PROPERTIES.ROLES.asi;
        directDis = STRINGS.YES;
      } else {
        userId = asiDetails[0].userId ?? null;
        role = asiDetails[0].role ?? null;
        directDis = STRINGS.NO ?? null;
      }
    }
    const requestInputForASI = {
      userId,
      role,
      noFosRequestunderDirectAsi: asiDetails?.[0]?.fullName ? STRINGS.NO : null,
      directDis,
      asiCode: asiDetails?.[0]?.asiCode || null,
      fetchAllData: false,
    };
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PartnerApproval.ActionPartnerRequest_PageVisit.moduleName, {
      [MoengageMixpanelModules.PartnerApproval.ActionPartnerRequest_PageVisit.attributes.Status]: true,
      [MoengageMixpanelModules.PartnerApproval.ActionPartnerRequest_PageVisit.attributes.AsiCode]: requestInputForASI?.asiCode,
      [MoengageMixpanelModules.PartnerApproval.ActionPartnerRequest_PageVisit.attributes.DirectDis]: requestInputForASI?.directDis,
      [MoengageMixpanelModules.PartnerApproval.ActionPartnerRequest_PageVisit.attributes.FetchAllData]: requestInputForASI?.fetchAllData,
      [MoengageMixpanelModules.PartnerApproval.ActionPartnerRequest_PageVisit.attributes.NoFosRequestunderDirectAsi]: requestInputForASI?.noFosRequestunderDirectAsi,
      [MoengageMixpanelModules.PartnerApproval.ActionPartnerRequest_PageVisit.attributes.Role]: requestInputForASI?.role,
      [MoengageMixpanelModules.PartnerApproval.ActionPartnerRequest_PageVisit.attributes.UserId]: requestInputForASI?.userId,
    });
    dispatch(sliceActions.setPartnerList([]));
    dispatch(sliceActions.setShowDynamicNoData(false));
    return api
      .post(queries.partnerapprovalDetails, requestInputForASI)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(sliceActions.setDropDownListAndRejectReasons(data?.result));
          dispatch(formActions.setMultipleDropdownOptionsData({ asiDropDown: data?.result?.DropdownList }));
          dispatch(sliceActions.setDropDownDataList(data));
          dispatch(sliceActions.setPartnerList(data?.result?.partnerApprovalList));
          dispatch(uiActions.clearLoader());
        }
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        clearTimeout(partnerApprovalTimeoutId);
      })
      .finally(() => {
        clearTimeout(partnerApprovalTimeoutId);
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
 * dispatch(approvalConfirmation({ exampleParam: 'exampleValue' }));
 */
export const approvalConfirmation =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.LABEl,
        showCloseIcon: false,
        isCenterModal: true,
        buttonInfo: {
          showCenteredHeaderIcon: false,
          primaryButtonLabel: MODAL.YES_APPROVE,
          secondaryButtonLabel: MODAL.CANCEL,
          queryName: QUERY.PartnerApprovalRejectAndApprove,
          centerLabel: true,
          childData: STRINGS.CONFIRMATION,
          subLabel: STRINGS.ARE_YOU_SURE_WANT_TO_APPROVE_REQUEST,
          queryParams: params,
          hasOutline: true,
        },
      }),
    );
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(rejectPartnerApproval({ exampleParam: 'exampleValue' }));
 */
export const rejectPartnerApproval =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setSelectedPartner({ ...params }));
    dispatch(
      uiActions.showBottomModal({
        isCenterModal: true,
        isModalVisible: true,
        type: CHILD_TYPE.DYNAMIC_FORM,
        headerTitle: HEADER_TITLE.SELECT_REASON_FOR_REJECTION,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.partnerApprovalRejectReasons,
      }),
    );
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(partnerapprovaltracklistDetails({ exampleParam: 'exampleValue' }));
 */
export const partnerapprovaltracklistDetails =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    partnerApprovalTimeoutId = setTimeout(() => {
      dispatch(uiActions.setLoader());
    }, 100);
    const { initialData } = getState().partnerApproval;
    const { info } = getState().user;
    const asiDetails = initialData?.result?.asiDetails?.filter((val: ParentObject) => val?.fullName?.trim() === params?.null);
    if (info?.roleId === PARTNER_ROLES.ASM || info?.roleId === PARTNER_ROLES.ASI) {
      setTimeout(() => {
        dispatch(formActions.setFieldsToShow(['search']));
      }, 200);
    }

    let userId = null;
    let role = null;
    let directDis = null;
    let fetchAllData = false;
    if (asiDetails?.[0]) {
      if (asiDetails[0].fullName === STRINGS.DIS_DIRECTLY_MAPPED_TO_CSM) {
        userId = info?.userId ?? null;
        role = PROPERTIES.ROLES.asi;
        directDis = STRINGS.YES;
        fetchAllData = false;
      } else {
        userId = asiDetails[0].userId ?? null;
        role = asiDetails[0].role ?? null;
        directDis = STRINGS.NO ?? null;
        fetchAllData = false;
      }
    }

    const requestInput = {
      formName: FORMS.trackPartnerRequest,
      userId,
      role,
      directDis,
      asiCode: asiDetails?.[0]?.asiCode || null,
      fetchAllData,
    };

    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PartnerApproval.TrackPartnerRequest_PageVisit.moduleName, {
      [MoengageMixpanelModules.PartnerApproval.TrackPartnerRequest_PageVisit.attributes.Status]: true,
      [MoengageMixpanelModules.PartnerApproval.TrackPartnerRequest_PageVisit.attributes.AsiCode]: requestInput?.asiCode,
      [MoengageMixpanelModules.PartnerApproval.TrackPartnerRequest_PageVisit.attributes.DirectDis]: requestInput?.directDis,
      [MoengageMixpanelModules.PartnerApproval.TrackPartnerRequest_PageVisit.attributes.FetchAllData]: requestInput?.fetchAllData,
      [MoengageMixpanelModules.PartnerApproval.TrackPartnerRequest_PageVisit.attributes.Role]: requestInput?.role,
      [MoengageMixpanelModules.PartnerApproval.TrackPartnerRequest_PageVisit.attributes.UserId]: requestInput?.userId,
    });

    if (info?.internalRole === PROPERTIES.ROLES.asi || info?.internalRole === PROPERTIES.ROLES.asm) {
      dispatch(
        commonActions.setTableColumnData({
          tableColumns: [],
          result: [],
        }),
      );
      return api
        .get(queries[queryName], requestInput)
        .then((response) => {
          const data = refactorResponse(response);
          if (data?.result?.partnerApprovaltrackList?.length > 0) {
            const sortedData = [...data.result.partnerApprovaltrackList].sort(
              (a: ParentObject, b: ParentObject) => new Date(b.registeredDateNT).getTime() - new Date(a.registeredDateNT).getTime(),
            );
            dispatch(
              commonActions.setTableColumnData({
                tableColumns: data?.result?.tableColumns,
                result: sortedData,
              }),
            );
            dispatch(sliceActions.setShowDynamicNoData(false));
          }
          return { status: true, data };
        })
        .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
        .finally(() => {
          clearTimeout(partnerApprovalTimeoutId);
          dispatch(uiActions.clearLoader());
        });
    }
    if (info?.internalRole === PROPERTIES.ROLES.csm) {
      dispatch(
        commonActions.setTableColumnData({
          tableColumns: [],
          result: [],
        }),
      );
      return api
        .get(queries[queryName], requestInput)
        .then((response) => {
          const data = refactorResponse(response);
          if (data?.result?.partnerApprovaltrackList?.length > 0) {
            const sortedData = [...data.result.partnerApprovaltrackList].sort(
              (a: ParentObject, b: ParentObject) => new Date(b.registeredDateNT).getTime() - new Date(a.registeredDateNT).getTime(),
            );
            dispatch(
              commonActions.setTableColumnData({
                tableColumns: data?.result?.tableColumns,
                result: sortedData,
              }),
            );
          }
          dispatch(formActions.setMultipleDropdownOptionsData({ asiDropDown: data?.result?.DropdownList }));

          dispatch(sliceActions.setDropDownDataList(data));
          if (data?.result?.asiDetails) {
            dispatch(sliceActions.setInitialData(data));
          }
          dispatch(sliceActions.setShowDynamicNoData(false));
          return { status: true, data };
        })
        .catch((error) => {
          dispatch(sliceActions.setShowDynamicNoData(true));
          dispatch(uiActions.showErrorPage(error.message));
          return { status: false };
        })
        .finally(() => {
          clearTimeout(partnerApprovalTimeoutId);
          dispatch(uiActions.clearLoader());
        });
    }
    dispatch(uiActions.clearLoader());

    return { status: false };
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(filterSearchTrackPartnerRequest({ exampleParam: 'exampleValue' }));
 */
export const filterSearchTrackPartnerRequest =
  (params: ParentObject, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    // Normalize search text
    const searchText = params?.searchText || (params?.search?.length > 1 ? params.search : '') || '';
    const requestInput = {
      partnerNameNT: searchText,
      partnerCode: searchText,
      partnerMobileNumber: searchText,
      registeredDateNT: searchText,
      pincode: searchText,
      parentCode: searchText,
      parentName: searchText,
      parentMobileNumber: searchText,
      createdBy: searchText,
      statusNT: searchText,
    };
    // Filter by search input
    let filteredData = filterByParams(tableData, requestInput);
    // Extract status ID
    const statusId = params['']?.id || params?.status?.id;
    if (statusId && statusId !== STRINGS.ALL) {
      filteredData = filteredData.filter((item: ParentObject) => item.statusNT === statusId);
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
        filteredData = filteredData.filter((item: ParentObject) => {
          if (!item.registeredDateNT) return false;
          const itemDate = new Date(item.registeredDateNT).getTime();
          if (Number.isNaN(itemDate)) {
            return false;
          }
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
 * dispatch(partnerApprovalRejectAndApprove({ exampleParam: 'exampleValue' }));
 */
export const partnerApprovalRejectAndApprove =
  (params: ParentObject, queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setModalLoader());
    const { selectedPartner } = getState().partnerApproval;
    const requestInput = {
      input: {
        userId: params?.userId || selectedPartner?.userId,
        status: '',
        remarks: params?.reasons || '',
      },
    };
    if (!params?.reasons) {
      dispatch(sliceActions.setSelectedPartner({ ...params }));
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.PartnerApproval.PartnerApproval_Approve.moduleName, {
        [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Approve.attributes.Status]: true,
        [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Approve.attributes.PartnerStatus]: requestInput?.input?.status,
        [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Approve.attributes.Remarks]: requestInput?.input?.remarks,
        [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Approve.attributes.UserId]: requestInput?.input?.userId,
      });
    } else {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject_SubmitReason.moduleName, {
        [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject_SubmitReason.attributes.Status]: true,
        [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject_SubmitReason.attributes.PartnerStatus]: requestInput?.input?.status,
        [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject_SubmitReason.attributes.Remarks]: requestInput?.input?.remarks,
        [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject_SubmitReason.attributes.UserId]: requestInput?.input?.userId,
      });
    }

    return api
      .get(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(sliceActions.setPartnerApprovalSuccessData(data));
          dispatch(uiActions.hideBottomModal());
          if (!params?.reasons) {
            navigate(ROUTE.WEB.PARTNER_APPROVAL_SUCCESS);
          }
        } else {
          dispatch(uiActions.hideBottomModal());
          dispatch(uiActions.showErrorPage(data?.message));
        }
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * To set the subscriber details
 *
 * @function setInitialData
 * @returns {void}
 */
export const searchForASIDetails =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(callAction({ ...params, getASIDetails: true }, QUERY.PartnerapprovaltracklistDetails));
  };

/**
 * To set the initial data for the dropdown details
 *
 * @function setInitialData
 * @returns {void}
 */
export const setInitialData =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setInitialData({ ...params }));
  };

/**
 * To set the subscriber details
 *
 * @function setSelectedPartner
 * @returns {void}
 */
export const setSelectedPartner =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setSelectedPartner({ data: params }));
  };

/**
 * To set the dropdown details
 *
 * @function setDropDownDataList
 * @returns {void}
 */
export const setDropDownDataList =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setDropDownDataList({ ...params }));
  };
