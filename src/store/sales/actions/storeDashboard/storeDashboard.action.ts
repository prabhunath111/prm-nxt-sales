import commonAction from 'store/sales/actions/common';
import formActions from 'store/sales/actions/form';
import { sliceActions } from 'store/sales/reducer/storeDashboard';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, QUERY, STATE_KEY, STRINGS, ACTION_TYPE, PROPERTIES } from 'const';
import i18next, { t } from 'i18next';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { UNDER_SCORE, UPPER_CASE_REGEX } from 'const/regexes';
import { downloadCSV } from 'utils/formBuilderHelper';
import { isAndroid } from 'utils/platformHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

export const NoDataFound =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const AlertMsg = params?.eligible ? `${i18next.t('strings.noDataForDate')}` : `${i18next.t('strings.notEligible')}`;
    dispatch(
      uiActions.showAlert(
        AlertMsg,
        ALERT.WARNING,
        {
          primaryText: MODAL.OK,
          secondaryText: MODAL.CANCEL,
        },
        {},
      ),
    );
  };

export const storeDashboardRMNModel = (): AppThunk => (dispatch) => {
  dispatch(sliceActions.setDealerID(''));
  dispatch(sliceActions.setDateForStoreDashboard(''));

  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.STORE_DASHBOARD,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.storeDashboard,
      headerIcon: ICONS.STORE_DASHBOARD,
      buttonInfo: {
        goToHome: true,
      },
    }),
  );
};

export const getDealerID =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.setDealerID(params?.dealerID));
  };

export const getDealerInfoForStoreDashboard =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setModalLoader());
    let formattedDate = params?.DateOfReport || '';
    const [day, monthText, year] = formattedDate.split('-');
    const months = PROPERTIES.EXCLUSIVE_STORE.MONTH;
    const month = months[monthText as keyof typeof months];
    if (month) {
      formattedDate = `${year}-${month}-${day}`;
    }
    dispatch(sliceActions.setDateForStoreDashboard(formattedDate));
    const requestInput = {
      input: {
        id: params?.dealerID,
      },
    };
    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.StoreDashboard.StoreDashboardValidateRMN.moduleName, {
          [MoengageMixpanelModules.StoreDashboard.StoreDashboardValidateRMN.attributes.Status]: true,
          [MoengageMixpanelModules.StoreDashboard.StoreDashboardValidateRMN.attributes.dealerID]: params?.dealerID,
        });
        dispatch(sliceActions.setEVDCode(data?.userId));
        dispatch(commonAction.setDealerDetails({ mdn: data?.mdn, name: data?.name, evdCode: data?.userId }));
        return Promise.resolve({ status: true });
      })
      .catch((error) => {
        dispatch(commonAction.setErrorMessage(error.message));
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });
  };

export const getStoreOpeningData = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  const { info } = getState().user;
  const { evdCode, selectedDate } = getState().storeDashboard;

  const requestInput = {
    input: {
      action: ACTION_TYPE.STORE_OPEN,
      date: selectedDate,
      dealerId: evdCode,
      id: info?.userId,
    },
  };
  return api
    .post(queries.getStoreClosingData, requestInput)
    .then((response) => {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOpen.moduleName, {
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOpen.attributes.Status]: true,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOpen.attributes.storeOpen]: ACTION_TYPE.STORE_OPEN,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOpen.attributes.date]: selectedDate,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOpen.attributes.iD]: info?.userId,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOpen.attributes.dealerId]: evdCode,
      });
      const { questions, isEligible } = refactorResponse(response);
      if (isEligible === t(`strings.eligible`)) {
        if (!Array.isArray(questions) || questions.length === 0) {
          dispatch(NoDataFound({ eligible: true }));
          return { status: false };
        }
        dispatch(formActions.setChecklistTileDetails({ checklistData: questions }));
        return { status: true };
      }
      dispatch(NoDataFound({ eligible: false }));
      return { status: false };
    })
    .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
    .finally(() => {
      dispatch(uiActions.clearLoader());
    });
};

export const getStoreClosingData = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  const { info } = getState().user;
  const { evdCode, selectedDate } = getState().storeDashboard;
  const requestInput = {
    input: {
      action: ACTION_TYPE.STORE_CLOSE,
      date: selectedDate,
      dealerId: evdCode,
      id: info?.userId,
    },
  };
  return api
    .post(queries.getStoreClosingData, requestInput)
    .then((response) => {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreClose.moduleName, {
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreClose.attributes.Status]: true,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreClose.attributes.storeClose]: ACTION_TYPE.STORE_CLOSE,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreClose.attributes.date]: selectedDate,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreClose.attributes.iD]: info?.userId,
        [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreClose.attributes.dealerId]: evdCode,
      });
      const { questions, isEligible } = refactorResponse(response);
      if (isEligible === t(`strings.eligible`)) {
        if (!Array.isArray(questions) || questions.length === 0) {
          dispatch(NoDataFound({ eligible: true }));
          return { status: false };
        }
        dispatch(formActions.setChecklistTileDetails({ checklistData: questions }));
        return { status: true };
      }
      dispatch(NoDataFound({ eligible: false }));
      return { status: false };
    })
    .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
    .finally(() => {
      dispatch(uiActions.clearLoader());
    });
};

export const getStoreOperationalReport =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    const monthsToShow = Math.min(3, currentMonthIndex + 1);
    const recentMonths = Array.from({ length: monthsToShow }, (_, i) => {
      const index = currentMonthIndex - i;
      return {
        id: String(i),
        name: PROPERTIES.TOTAL_MONTHS[index],
      };
    });
    dispatch(formAction.setDropdownOptionsData({ data: [{ id: STRINGS.COUNT_ZERO, name: year }], queryName: QUERY.GET_YEAR }));
    dispatch(formAction.setDropdownOptionsData({ data: recentMonths, queryName: QUERY.GET_MONTH }));

    const { info } = getState().user;
    const { evdCode } = getState().storeDashboard;
    const selectedYear = params?.selectedYear?.name || params?.YearSelection?.name;
    const selectedYearStr = String(selectedYear);
    const selectedMonthArray = Object.values(params?.selectedMonth || params?.monthSelection || {})
      .map((monthObj: ParentObject) => monthObj?.name)
      .filter((name: string | undefined): name is string => Boolean(name));
    const requestInput = {
      input: {
        year: selectedYearStr,
        months: selectedMonthArray,
        dealerId: evdCode,
        id: info?.userId,
        formName: FORMS.storeOperationalDetails,
      },
    };
    dispatch(commonAction.setTableColumnData({ tableColumns: [], result: [] }));
    if (selectedYear && selectedMonthArray.length > 0) {
      dispatch(uiActions.setLoader());
      return api
        .post(queries[queryName], requestInput)
        .then((response) => {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOperationalChecklist.moduleName, {
            [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOperationalChecklist.attributes.Status]: true,
            [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOperationalChecklist.attributes.dealerId]: evdCode,
            [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOperationalChecklist.attributes.year]: selectedYearStr,
            [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOperationalChecklist.attributes.month]: selectedMonthArray,
            [MoengageMixpanelModules.StoreDashboard.StoreDashboardStoreOperationalChecklist.attributes.id]: info?.userId,
          });
          const { dashBoardWalkInData, tableColumns, isEligible } = refactorResponse(response);
          if (isEligible === t(`strings.eligible`)) {
            if (dashBoardWalkInData.length <= 0) {
              return dispatch(NoDataFound({ eligible: true }));
            }
            dispatch(commonAction.setTableColumnData({ tableColumns, result: dashBoardWalkInData }));
            return { status: true };
          }
          dispatch(NoDataFound({ eligible: false }));
          return { status: false };
        })
        .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
        .finally(() => {
          dispatch(uiActions.clearLoader());
        });
    }
    return Promise.resolve({ status: true });
  };

export const DownloadCSVDataOfStoreDashboard = (): AppThunk => async (dispatch, getState) => {
  const { tableData, tableColumns } = getState().common;
  if (tableData.length <= 0) {
    return dispatch(uiActions.showErrorPage(t(`strings.noDataForDownload`)));
  }
  const headerMap: Record<string, string> = tableColumns.reduce((acc: Record<string, string>, item: ParentObject) => {
    const originalKey = item.accessorKey as string;
    const snakeKey = originalKey.replace(UPPER_CASE_REGEX, '$1_$2').replace(UNDER_SCORE, '_').toUpperCase();
    acc[originalKey] = snakeKey;
    return acc;
  }, {});

  const headers: string[] = Object.values(headerMap);

  const transformedData = (tableData as Record<string, ParentObject>[]).map((row) => {
    const newRow: Record<string, ParentObject> = {};
    Object.entries(headerMap).forEach(([originalKey, snakeKey]) => {
      newRow[snakeKey] = row[originalKey];
    });
    return newRow;
  });

  const timestamp = Date.now();
  const result = await downloadCSV(transformedData, headers, `${STRINGS.STORE_REPORT}${timestamp}.csv`);

  if (isAndroid()) {
    if (result?.status) {
      dispatch(uiActions.showAlert(STRINGS.FILE_DOWNLOADED_SUCCESSFULLY, ALERT.SUCCESS, { primaryText: MODAL.OK }, {}));
    } else {
      dispatch(uiActions.showAlert(STRINGS.STORAGE_PERMISSION_DENIED, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
    }
  }
  return { status: true };
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(getDealerDetails({ exampleParam: 'exampleValue' }));
 */
export const getDealerDetails = (): AppThunk => (dispatch, getState) => {
  const { dealerID } = getState().storeDashboard;
  dispatch(formActions.setUpdatedFormFields({ dealerID }, STATE_KEY.MODAL_STATE));
};

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(searchStoreOperational({ exampleParam: 'exampleValue' }));
 */
export const searchStoreOperational =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { tableData } = getState().common;
    const requestFilters = {
      searchText: params?.searchText || params?.viewStoreOperationalSearch || '',
    };

    const finalFilteredData = tableData.filter((item: ParentObject) => {
      const searchMatch =
        !requestFilters.searchText ||
        Object.values({
          createdDate: item.createdDate,
          noOfWalkIns: item.noOfWalkIns,
          phoneLeads: item.phoneLeads,
          teleCallingLead: item.teleCallingLead,
          outboundActivation: item.outboundActivation,
          recharge: item.recharge,
          vasSales: item.vasSales,
          newConnection: item.newConnection,
          serviceComplaint: item.serviceComplaint,
          enquiryNewConnection: item.enquiryNewConnection,
          enquiryPack: item.enquiryPack,
          boxUpgrade: item.boxUpgrade,
        }).some((val) => val?.toString().toLowerCase().includes(requestFilters.searchText.toLowerCase()));

      return searchMatch;
    });
    dispatch(commonAction.setTotalListCount(finalFilteredData.length));
    dispatch(commonAction.setTableFilteredData({ result: finalFilteredData }));
  };
