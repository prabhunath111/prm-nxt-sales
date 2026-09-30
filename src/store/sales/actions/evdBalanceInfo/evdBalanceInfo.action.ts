/**
 * store the details for evdBalance info
 *
 * @module store/sales/actions/evdBalanceInfo
 *
 */
import { sliceActions } from 'store/sales/reducer/evdBalanceInfo';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import formActions from 'store/sales/actions/form';
import { CHILD_TYPE, FORMS, HEADER_TITLE, QUERY, ROUTE, STATE_KEY, STRINGS } from 'const';
import i18next from 'i18next';
import { sliceActions as transactionHistory } from 'store/sales/reducer/transactionHistory';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import { Sizing } from 'styles';
import commonAction from 'store/sales/actions/common';
import { callAction } from 'utils/formBuilderHelper';
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
 * dispatch(retrieveOTFCreditDetails({ exampleParam: 'exampleValue' }));
 */

export const doBalanceEnquiryEvd =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    dispatch(sliceActions.setDealerBalanceInput(''));
    dispatch(sliceActions.setPageNumber(0));
    dispatch(sliceActions.setConsolidatedParams({}));
    dispatch(sliceActions.setConsolidatedData([]));
    const { info } = getState().user;
    if (params.dealerId) {
      dispatch(sliceActions.setIsFos(true));
    } else {
      dispatch(sliceActions.setIsFos(false));
    }
    const requestInput = {
      input: {
        childMdn: params.dealerId ?? info.mdn,
        mdn: info.mdn,
      },
    };

    return api
      .get(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setEvdInfo(data));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
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
 * dispatch(retrieveOTFCreditDetails({ exampleParam: 'exampleValue' }));
 */

export const retrieveOTFCreditDetails =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.EvdBalanceInfo.otfCreditDetails_page_Visit.moduleName, {
      [MoengageMixpanelModules.EvdBalanceInfo.otfCreditDetails_page_Visit.attributes.Status]: true,
    });
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    const { evdInfo, isFos } = getState().evdBalanceInfo;
    const requestInput = {
      input: {
        mobileNo: isFos ? evdInfo?.recipientRMN : info.mdn,
        formName: FORMS.otfDetailsEVD,
      },
    };
    dispatch(sliceActions.evdBalanceInfo({}));
    return api
      .get(queries[queryName], requestInput)
      .then((response) => {
        dispatch(uiActions.exitErrorPage());
        const data = refactorResponse(response);
        const transactions = data?.transactions?.map((item: ParentObject) => ({
          ...item,
          dateTime: `${item.otfDate} ${item.transactionTime}`,
        }));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: transactions }));
        dispatch(sliceActions.evdBalanceInfo(data));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
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
 * dispatch(retrieveBalancehistoryDetails({ exampleParam: 'exampleValue' }));
 */

export const retrieveBalancehistoryDetails =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.EvdBalanceInfo.balanceTransferDetails_Page_Visit.moduleName, {
      [MoengageMixpanelModules.EvdBalanceInfo.balanceTransferDetails_Page_Visit.attributes.Status]: true,
    });
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    const { evdInfo, isFos } = getState().evdBalanceInfo;
    const requestInput = {
      input: {
        dealerId: isFos ? evdInfo?.userId : info.userId,
        formName: FORMS.balanceTransferTable,
      },
    };
    dispatch(sliceActions.evdBalanceInfo({}));
    return api
      .get(queries[queryName], requestInput)
      .then((response) => {
        dispatch(uiActions.exitErrorPage());
        const data = refactorResponse(response);
        dispatch(sliceActions.evdBalanceInfo(data));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.transactions }));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
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
 * dispatch(retrieveConsolidatedHistoryDetails({ exampleParam: 'exampleValue' }));
 */

export const retrieveConsolidatedHistoryDetails =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.EvdBalanceInfo.ConsolidatedTransferDetails_Page_Visit.moduleName, {
      [MoengageMixpanelModules.EvdBalanceInfo.ConsolidatedTransferDetails_Page_Visit.attributes.Status]: true,
    });
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    const { evdInfo, isFos } = getState().evdBalanceInfo;
    const requestInput = {
      input: {
        dealerId: isFos ? evdInfo?.userId : info.userId,
        formName: FORMS.consolidatedTransaction,
      },
    };
    dispatch(sliceActions.evdBalanceInfo({}));
    return api
      .get(queries[queryName], requestInput)
      .then((response) => {
        dispatch(uiActions.exitErrorPage());
        const data = refactorResponse(response);
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.transactions }));
        dispatch(sliceActions.evdBalanceInfo(data));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
      .finally(() => dispatch(uiActions.clearLoader()));
  };

const getRemainingDays = (txnDate: string): number => {
  if (!txnDate) return 0;
  const today = new Date();
  const txn = new Date(txnDate);

  const diffTime = today.getTime() - txn.getTime();
  const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, 3 - daysPassed);
};

const isWithinLast3Days = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff <= 3 * 24 * 60 * 60 * 1000 && diff >= 0;
};

const buildRemark = (txnDate: string): string => {
  if (!txnDate) return i18next.t('strings.applicableText');

  const daysDiff = getRemainingDays(txnDate);
  const dayLabel = daysDiff === 1 ? i18next.t('strings.day') : i18next.t('strings.days');
  if (isWithinLast3Days(txnDate)) {
    return `${i18next.t('strings.applicable')} ${daysDiff} ${dayLabel}`;
  }

  return i18next.t('strings.applicableText');
};
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(retrieveTransactionsDetailsNew({ exampleParam: 'exampleValue' }));
 */

export const retrieveTransactionsDetailsNew =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.EvdBalanceInfo.Recharge_Trasnaction_page_Visit.moduleName, {
      [MoengageMixpanelModules.EvdBalanceInfo.Recharge_Trasnaction_page_Visit.attributes.Status]: true,
    });
    const { info } = getState().user;
    const { evdInfo, isFos } = getState().evdBalanceInfo;
    const requestInput = {
      input: {
        mobileNo: isFos ? evdInfo?.recipientRMN : info.mdn,
        partnerId: isFos ? evdInfo?.userId : info?.userId,
        formName: FORMS.trasactionDetailsEVD,
      },
    };
    dispatch(sliceActions.evdBalanceInfo({}));

    return api
      .get(queries[queryName], requestInput)
      .then((response) => {
        dispatch(uiActions.exitErrorPage());
        const data = refactorResponse(response);
        dispatch(sliceActions.evdBalanceInfo(data));
        dispatch(transactionHistory.setTransactionHistoryDetails(data));
        const updatedTransactions = data.transactions.map((tx: any) => ({
          ...tx,
          remark: buildRemark(tx.txnDate),
        }));

        const updatedData = {
          ...data,
          transactions: updatedTransactions,
        };
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: updatedData?.transactions }));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
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
 * dispatch(filterDetails({ exampleParam: 'exampleValue' }));
 */

export const filterDetails =
  (_params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    const { radioContainerRed } = getState().evdBalanceInfo;
    timeOut = setTimeout(() => {
      dispatch(formActions.setUpdatedFormFields({ radioContainer: radioContainerRed?.length === 0 ? STRINGS.NEWEST : radioContainerRed }, STATE_KEY.MODAL_STATE));
    }, 300);
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: false,
        type: CHILD_TYPE.DYNAMIC_FORM,
        headerTitle: i18next.t(`strings.${HEADER_TITLE.SORT_BY}`),
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.configureDeatils,
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
 * dispatch(filterSearchEvdBalance({ exampleParam: 'exampleValue' }));
 */

export const fillRadio =
  (_params: ParentObject): AppThunk =>
  async (dispatch, getState) => {
    const { radioContainerRed } = getState().evdBalanceInfo;
    dispatch(formActions.setUpdatedFormFields({ radioContainer: radioContainerRed }, STATE_KEY.MODAL_STATE));
  };

export const filterSearchEvdBalance =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(callAction(params, QUERY.ConsolidatedOnlineReport));
      return params;
    }
    const { searchText = '', search = '', radioContainer: incomingRadio } = params;
    const searchRaw = searchText || search || '';
    const searchValue = searchRaw.toString().trim();
    const applySearch = Boolean(searchValue);

    const { balanceInfo, radioContainerRed: savedRadio, durationIdRed, filteredBalanceInfo } = getState().evdBalanceInfo;
    const durationId = params?.null?.id ?? durationIdRed;
    dispatch(sliceActions.setSelcectedDurationId(durationId));

    const radioContainer = incomingRadio || savedRadio;
    const baseSource = filteredBalanceInfo?.transactions?.length > 0 ? filteredBalanceInfo.transactions : balanceInfo?.transactions ?? [];

    let data = [...baseSource];

    const now = Date.now();
    const msPerDay = 1000 * 60 * 60 * 24;
    const durationMap: Record<string, number | null> = {
      all: null,
      last10Days: Sizing.x10,
      last20Days: Sizing.x20,
      last30Days: Sizing.x30,
      last40Days: Sizing.x40,
    };
    const daysDuration = durationMap[durationId] ?? null;

    // Sorting
    if (radioContainer) {
      dispatch(sliceActions.setSelcectedFilters(radioContainer));

      const getSortDate = (item: ParentObject) => {
        if (item.otfDate) return new Date(item.otfDate);
        if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
        if (item.txnDate) return new Date(item.txnDate);
        return new Date(0);
      };

      data.sort((a, b) => {
        const dateA = getSortDate(a).getTime();
        const dateB = getSortDate(b).getTime();
        return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
      });
      dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: data }));
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    //  Duration filter
    if (daysDuration !== null) {
      data = data.filter((tx: ParentObject) => {
        const dateStr = tx.otfDate || tx.date || tx.txnDate;
        if (!dateStr) return false;

        const txTime = Date.parse(dateStr);
        if (Number.isNaN(txTime)) return false;

        const diffDays = (now - txTime) / msPerDay;
        return diffDays <= daysDuration && diffDays >= 0;
      });
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    // Search filter
    if (applySearch) {
      let searchSource: ParentObject[] = [];
      searchSource = data;
      data = searchSource.filter((item: ParentObject) => {
        const searchableFields = [
          item.subscriberID,
          item.transactionID,
          item.txnId,
          item.subId,
          item.msg5,
          item.donorName,
          item.bingeFlag,
          item.recipientName,
          item.transId,
          item.txnDate,
          item.bingeRechargeFlag,
          item.creditAmount,
        ];
        return searchableFields.some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        );
      });
    }
    const updatedTransactions = data.map((tx: any) => ({
      ...tx,
      remark: buildRemark(tx.txnDate),
      dateTime: `${tx.otfDate || tx.date || tx.txnDate} ${tx.transactionTime || tx.time}`,
    }));
    dispatch(commonAction.setTotalListCount(data.length));
    dispatch(commonAction.setTableFilteredData({ result: updatedTransactions }));
    dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
    dispatch(uiActions.hideBottomModal());
    dispatch(clearDealerTimeout());
    return data;
  };

export const filterSearchBalanceTransfer =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(callAction(params, QUERY.ConsolidateBalanceTransferReport));
      return params;
    }
    const { searchText = '', search = '', radioContainer: incomingRadio } = params;
    const searchRaw = searchText || search || '';
    const searchValue = searchRaw.toString().trim();
    const applySearch = Boolean(searchValue);

    const { balanceInfo, radioContainerRed: savedRadio, durationIdRed, filteredBalanceInfo } = getState().evdBalanceInfo;
    const durationId = params?.null?.id ?? durationIdRed;
    dispatch(sliceActions.setSelcectedDurationId(durationId));

    const radioContainer = incomingRadio || savedRadio;
    const baseSource = filteredBalanceInfo?.transactions?.length > 0 ? filteredBalanceInfo.transactions : balanceInfo?.transactions ?? [];
    let data = [...baseSource];

    const now = Date.now();
    const msPerDay = 1000 * 60 * 60 * 24;
    const durationMap: Record<string, number | null> = {
      all: null,
      last10Days: Sizing.x10,
      last20Days: Sizing.x20,
      last30Days: Sizing.x30,
      last40Days: Sizing.x40,
    };
    const daysDuration = durationMap[durationId] ?? null;

    // Sorting
    if (radioContainer) {
      dispatch(sliceActions.setSelcectedFilters(radioContainer));

      const getSortDate = (item: ParentObject) => {
        if (item.otfDate) return new Date(item.otfDate);
        if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
        if (item.txnDate) return new Date(item.txnDate);
        return new Date(0);
      };

      data.sort((a, b) => {
        const dateA = getSortDate(a).getTime();
        const dateB = getSortDate(b).getTime();
        return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
      });
      dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: data }));
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    //  Duration filter
    if (daysDuration !== null) {
      data = data.filter((tx: ParentObject) => {
        const dateStr = tx.otfDate || tx.date || tx.txnDate;
        if (!dateStr) return false;

        const txTime = Date.parse(dateStr);
        if (Number.isNaN(txTime)) return false;

        const diffDays = (now - txTime) / msPerDay;
        return diffDays <= daysDuration && diffDays >= 0;
      });
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    // Search filter
    if (applySearch) {
      let searchSource: ParentObject[] = [];
      searchSource = data;
      data = searchSource.filter((item: ParentObject) => {
        const searchableFields = [item.subscriberID, item.transactionID, item.txnId, item.subId, item.msg5, item.donorName, item.bingeFlag, item.recipientName, item.transId];
        return searchableFields.some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        );
      });
    }
    const updatedTransactions = data.map((tx: any) => ({
      ...tx,
      remark: buildRemark(tx.txnDate),
      dateTime: `${tx.otfDate} ${tx.transactionTime}`,
    }));
    dispatch(commonAction.setTotalListCount(data.length));
    dispatch(commonAction.setTableFilteredData({ result: updatedTransactions }));
    // dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
    dispatch(uiActions.hideBottomModal());
    dispatch(clearDealerTimeout());
    return data;
  };
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(otfFilter({ exampleParam: 'exampleValue' }));
 */

export const filterTransaction =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(sliceActions.setConsolidatedParams(params));
      dispatch(callAction(params, QUERY.ConsolidateOTFReport));
      return params;
    }

    const baseSource = dispatch(filterSearchEvdBalance({}));

    let data = [...baseSource];
    data = data.filter((t) => {
      const text = t?.msg5?.toLowerCase?.() || '';

      if (params?.searchLocally === 'All') return true; // All

      if (params?.searchLocally === 'Activation Margin') {
        return /activation|otf.*activation|mt channel.*activation|trade.*activation/i.test(text);
      }

      if (params?.searchLocally === 'Binge Pack Addition Margin') {
        return /binge.*bonus|binge add pack/i.test(text);
      }

      if (params?.searchLocally === 'UPP/ My Offer / Winback Pack Addition Margin') {
        return /msalescampaign|upp|winback|my offer.*pack.*addition/i.test(text);
      }

      if (params?.searchLocally === 'Flexi Recharge Margin') {
        return /flexi.*recharge/i.test(text);
      }

      if (params?.searchLocally === 'Others') {
        return !/activation|binge.*bonus|msalescampaign|upp|winback|flexi.*recharge/i.test(text);
      }

      return true;
    });
    const updatedTransactions = data.map((tx: any) => ({
      ...tx,
      remark: buildRemark(tx.txnDate),
      dateTime: `${tx.otfDate} ${tx.transactionTime}`,
    }));
    dispatch(commonAction.setTableFilteredData({ result: updatedTransactions }));
    dispatch(sliceActions.setFilteredBalanceInfo({ transactions: updatedTransactions }));
    dispatch(uiActions.hideBottomModal());
    dispatch(clearDealerTimeout());
    return data;
  };

export const filterSearchText =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(sliceActions.setConsolidatedParams(params));
      dispatch(callAction(params, QUERY.ConsolidateOTFReport));
      return params;
    }
    const baseSource = dispatch(filterTransaction({ searchLocally: params?.transactionType }));
    let data = [...baseSource];
    const { searchText = '', search = '' } = params;
    const searchRaw = searchText || search || '';
    const searchValue = searchRaw.toString().trim();
    const applySearch = Boolean(searchValue);
    if (applySearch) {
      let searchSource: ParentObject[] = [];
      searchSource = data;
      data = searchSource.filter((item: ParentObject) => {
        const searchableFields = [item.subscriberID, item.transactionID, item.txnId, item.subId, item.msg5, item.donorName, item.bingeFlag, item.recipientName, item.transId];
        return searchableFields.some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        );
      });
    }
    dispatch(commonAction.setTableFilteredData({ result: data }));
    dispatch(uiActions.hideBottomModal());
    dispatch(clearDealerTimeout());
    return data;
  };
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(filterTransactionConsolidated({ exampleParam: 'exampleValue' }));
 */

export const filterTransactionConsolidated =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const baseSource = dispatch(filterSearchEvdBalance({ search: params?.search }));
    let data = [...baseSource];
    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(callAction(params, QUERY.ConsolidatedOnlineReport));
      return params;
    }
    if (params?.selectedVal === STRINGS.ALL) return data;
    data = data.filter((t) => {
      const text = t?.operation; // assuming each item has a text or description field
      const lower = text.toLowerCase();

      switch (params?.selectedVal) {
        case STRINGS.RECHARGES:
          return /recharge(?! reversal)/i.test(text);

        case STRINGS.BALANCE_TRANSFER: {
          const balanceTransferIndex = lower.indexOf(STRINGS.BALANCE_TRANSFER_LOWER);
          const reversalIndex = lower.indexOf(STRINGS.REVERSAL_LOWER);
          const reverseIndex = lower.indexOf(STRINGS.REVERSE_LOWER);
          let firstRevIndex;
          if (reverseIndex === -1) {
            firstRevIndex = reversalIndex;
          } else if (reversalIndex === -1) {
            firstRevIndex = reverseIndex;
          } else {
            firstRevIndex = Math.min(reverseIndex, reversalIndex);
          }
          return /balance transfer/i.test(text) && (firstRevIndex === -1 || balanceTransferIndex < firstRevIndex);
        }

        case STRINGS.REVERSALS: {
          const hasBalanceTransfer = /balance transfer/i.test(text);
          const hasReversal = /reversal|reverse/i.test(text);
          if (hasReversal) {
            if (hasBalanceTransfer) {
              const btIndex = lower.indexOf(STRINGS.BALANCE_TRANSFER_LOWER);
              const revIndex = lower.indexOf(STRINGS.REVERSAL_LOWER);
              const reverseIndex = lower.indexOf(STRINGS.REVERSE_LOWER);
              let firstRevIndex;
              if (reverseIndex === -1) {
                firstRevIndex = revIndex;
              } else if (revIndex === -1) {
                firstRevIndex = reverseIndex;
              } else {
                firstRevIndex = Math.min(reverseIndex, revIndex);
              }
              return firstRevIndex !== -1 && firstRevIndex < btIndex;
            }
            return true;
          }
          return false;
        }

        case STRINGS.BINGE_EVD_TRANSACTION:
          return /evd wallet/i.test(text);

        case STRINGS.OTF_CREDITS:
          return /otf|margin|activation|incentive|payout|offer|bonus|bonuscredit|msales|binge|subscription|deactive|refund|price|scheme|easy form|upp|bpos|regional/i.test(text);

        case STRINGS.OTHERS:
          // everything that doesn't match above categories
          return !(
            /recharge/i.test(text) ||
            /balance transfer/i.test(text) ||
            /reversal|reverse/i.test(text) ||
            /evd wallet/i.test(text) ||
            /otf|margin|activation|incentive|payout|offer|bonus|bonuscredit|msales|binge|subscription|deactive|refund|price|scheme|easy form|upp|bpos|regional/i.test(text)
          );

        default:
          return true;
      }
    });
    dispatch(commonAction.setTableFilteredData({ result: data }));
    dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
    return data;
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(filterTransactionBalance({ exampleParam: 'exampleValue' }));
 */

export const filterTransactionBalance =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const baseSource = dispatch(filterSearchEvdBalance({}));
    let data = [...baseSource];

    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(callAction(params, QUERY.ConsolidateBalanceTransferReport));
      return params;
    }

    if (params?.searchLocally === STRINGS.ALL) {
      dispatch(commonAction.setTableFilteredData({ result: data }));
      dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
      return data;
    }
    data = data.filter((trans) => {
      const amount = Number(trans?.amount);

      if (params?.searchLocally === STRINGS.CREDIT) {
        return amount > 0;
      }

      if (params?.searchLocally === STRINGS.DEBIT) {
        return amount < 0;
      }

      return true;
    });
    dispatch(commonAction.setTotalListCount(data.length));
    dispatch(commonAction.setTableFilteredData({ result: data }));
    dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
    return data;
  };

export const filterSearchTextBalance =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    const baseSource = dispatch(filterTransactionBalance({ selectedVal: params?.transactionType }));
    let data = [...baseSource];
    const { searchText = '', search = '' } = params;
    const searchRaw = searchText || search || '';
    const searchValue = searchRaw.toString().trim();
    const applySearch = Boolean(searchValue);
    if (applySearch) {
      let searchSource: ParentObject[] = [];
      searchSource = data;
      data = searchSource.filter((item: ParentObject) => {
        const searchableFields = [item.subscriberID, item.transactionID, item.txnId, item.subId, item.msg5, item.donorName, item.bingeFlag, item.recipientName, item.transId];
        return searchableFields.some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        );
      });
    }
    dispatch(commonAction.setTableFilteredData({ result: data }));
    dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
    dispatch(uiActions.hideBottomModal());
    dispatch(clearDealerTimeout());
    return data;
  };
/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(otfFilter({ exampleParam: 'exampleValue' }));
 */

export const otfFilter =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setUpdatedFormFields({ duration: { id: 'last20', name: 'last 20 Transactions' } }));
    dispatch(sliceActions.setPageNumber(0));
    api
      .post(queries[queryName], {})
      .then((response) => {
        const data = refactorResponse(response);
        const names = data?.otfFilter ?? [];

        dispatch(formAction.setDropdownData({ data: names, queryName }));
        return { status: true, data: names };
      })
      .catch((error) => ({ status: false, data: error }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(conslidateHistoryFilters({ exampleParam: 'exampleValue' }));
 */

export const conslidateHistoryFilters =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setUpdatedFormFields({ duration: { id: 'last20', name: 'last 20 Transactions' } }));
    dispatch(sliceActions.setPageNumber(0));
    api
      .post(queries[queryName], {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formAction.setDropdownData({ data, queryName }));
        return { status: true, data };
      })
      .catch((error) => ({ status: false, data: error }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(conslidateHistoryFilters({ exampleParam: 'exampleValue' }));
 */

export const balanceTransferFilters =
  (_params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setUpdatedFormFields({ duration: { id: 'last20', name: 'last 20 Transactions' } }));
    dispatch(sliceActions.setPageNumber(0));
    api
      .post(queries[queryName], {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(formAction.setDropdownData({ data, queryName }));
        return { status: true, data };
      })
      .catch((error) => ({ status: false, data: error }));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(conslidateHistoryFilters({ exampleParam: 'exampleValue' }));
 */

export const consolidatedOnlineReport =
  (params: ParentObject, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    if (!params || Object.keys(params).length === 0) {
      return;
    }
    dispatch(uiActions.setLoader());
    const { pageNumber, consolidatedParams, radioContainerRed: savedRadio } = getState().evdBalanceInfo;
    const { consolidatedData } = getState().evdBalanceInfo;
    const radioContainer = savedRadio;
    if (Object.keys(consolidatedParams).length === 0 && Object.keys(params).length === 0) {
      return;
    }
    const finalParams = {
      ...consolidatedParams,
      ...params,
    };
    dispatch(sliceActions.setConsolidatedParams(finalParams));
    const requestInput = {
      input: {
        limit: '30',
        numberOfDays: finalParams?.duration?.id || '20',
        page: String(pageNumber) ?? '1',
        partnerMdn: null,
        partnerRole: null,
        searchKeyword: finalParams?.searchText || finalParams?.search || null,
        transactionType: finalParams?.selectedVal || null,
      },
    };
    api
      .post(queries.consolidatedOnlineReport, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const dataList = data?.transactions;
        dispatch(uiActions.clearLoader());
        if (radioContainer) {
          dispatch(sliceActions.setSelcectedFilters(radioContainer));

          const getSortDate = (item: ParentObject) => {
            if (item.otfDate) return new Date(item.otfDate);
            if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
            if (item.txnDate) return new Date(item.txnDate);
            return new Date(0);
          };

          dataList.sort((a: any, b: any) => {
            const dateA = getSortDate(a).getTime();
            const dateB = getSortDate(b).getTime();
            return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
          });
          dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: dataList }));
          dispatch(sliceActions.setFilteredConf({ transactions: dataList }));
        }
        const updatedData = dataList.map((item: ParentObject) => ({
          ...item,
          txnDate: item?.otfDate,
        }));
        const isFirstPage = pageNumber === 1;

        const mergedData = isFirstPage ? updatedData : [...(consolidatedData || []), ...updatedData];
        dispatch(sliceActions.setFilteredBalanceInfo({ transactions: mergedData }));
        dispatch(sliceActions.setConsolidatedData(mergedData));
        dispatch(sliceActions.setPaginationData(data?.pagination));
        dispatch(commonAction.setTableFilteredData({ result: mergedData }));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const consolidateBalanceTransferReport =
  (params: ParentObject, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    if (!params || Object.keys(params).length === 0) {
      return;
    }
    dispatch(uiActions.setLoader());
    const { pageNumber, consolidatedParams, radioContainerRed: savedRadio } = getState().evdBalanceInfo;
    const { consolidatedData } = getState().evdBalanceInfo;
    const radioContainer = savedRadio;
    if (Object.keys(consolidatedParams).length === 0 && Object.keys(params).length === 0) {
      return;
    }
    const finalParams = {
      ...consolidatedParams,
      ...params,
    };
    dispatch(sliceActions.setConsolidatedParams(finalParams));
    const requestInput = {
      input: {
        limit: '30',
        numberOfDays: finalParams?.duration?.id || '20',
        page: String(pageNumber) ?? '1',
        partnerMdn: null,
        partnerRole: null,
        searchKeyword: finalParams?.searchText || finalParams?.search || null,
        transactionType: finalParams?.selectedVal || null,
      },
    };
    api
      .post(queries.balanceTransferReport, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const dataList = data?.transactions;
        dispatch(uiActions.clearLoader());
        if (radioContainer) {
          dispatch(sliceActions.setSelcectedFilters(radioContainer));

          const getSortDate = (item: ParentObject) => {
            if (item.otfDate) return new Date(item.otfDate);
            if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
            if (item.txnDate) return new Date(item.txnDate);
            return new Date(0);
          };

          dataList.sort((a: any, b: any) => {
            const dateA = getSortDate(a).getTime();
            const dateB = getSortDate(b).getTime();
            return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
          });
          dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: dataList }));
          dispatch(sliceActions.setFilteredConf({ transactions: dataList }));
        }

        const updatedData = dataList.map((item: ParentObject) => ({
          ...item,
          txnDate: item?.txnDate,
        }));
        const isFirstPage = pageNumber === 1;
        const mergedData = isFirstPage ? updatedData : [...(consolidatedData || []), ...updatedData];
        dispatch(sliceActions.setFilteredBalanceInfo({ transactions: mergedData }));
        dispatch(sliceActions.setConsolidatedData(mergedData));
        dispatch(sliceActions.setPaginationData(data?.pagination));
        dispatch(commonAction.setTableFilteredData({ result: mergedData }));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const reverseTransaction =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    const chargeableAmount = params?.row?.creditAmount?.replace(/[^\d]/g, '') ?? '';
    const applicable = isWithinLast3Days(params?.row?.txnDate);
    if (!applicable) {
      dispatch(uiActions.showErrorPage(i18next.t('strings.applicableText')));
      return;
    }
    dispatch(
      transactionHistory.setTransactionHistoryDetails({
        data: {
          inTransId: params?.row?.transactionID,
          subscriberId: params?.row?.subscriberID,
          chargeableAmount: String(chargeableAmount),
          requestDate: params?.row?.txnDate,
        },
      }),
    );
    navigate(ROUTE.WEB.CONFIRM_REVERSAL_INFO);
  };

export const rechargeReport =
  (params: ParentObject, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    if (!params || Object.keys(params).length === 0) {
      return;
    }
    dispatch(uiActions.setLoader());
    const { pageNumber, consolidatedParams, radioContainerRed: savedRadio } = getState().evdBalanceInfo;
    const radioContainer = savedRadio;
    const { consolidatedData } = getState().evdBalanceInfo;
    if (Object.keys(consolidatedParams).length === 0 && Object.keys(params).length === 0) {
      return;
    }
    const finalParams = {
      ...consolidatedParams,
      ...params,
    };
    dispatch(sliceActions.setConsolidatedParams(finalParams));
    const requestInput = {
      input: {
        limit: '30',
        numberOfDays: finalParams?.duration?.id || '20',
        page: String(pageNumber) ?? '1',
        partnerMdn: null,
        partnerRole: null,
        searchKeyword: finalParams?.searchText || finalParams?.search || null,
        transactionType: null,
      },
    };
    api
      .post(queries.rechargeReport, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.clearLoader());
        dispatch(transactionHistory.setTransactionHistoryDetails(data));
        const dataList = data?.transactions;

        if (radioContainer) {
          dispatch(sliceActions.setSelcectedFilters(radioContainer));

          const getSortDate = (item: ParentObject) => {
            if (item.otfDate) return new Date(item.otfDate);
            if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
            if (item.txnDate) return new Date(item.txnDate);
            return new Date(0);
          };

          dataList.sort((a: any, b: any) => {
            const dateA = getSortDate(a).getTime();
            const dateB = getSortDate(b).getTime();
            return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
          });
          dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: dataList }));
          dispatch(sliceActions.setFilteredConf({ transactions: dataList }));
        }

        const updatedTransactions = dataList.map((tx: any) => ({
          ...tx,
          remark: buildRemark(tx.txnDate),
          dateTime: `${tx.txnDate} ${tx.time}`,
        }));

        const updatedData = {
          ...data,
          transactions: updatedTransactions,
        };
        const isFirstPage = pageNumber === 1;

        const mergedTransactions = isFirstPage ? updatedTransactions : [...(consolidatedData?.transactions || []), ...updatedTransactions];

        const mergedData = {
          ...updatedData,
          transactions: mergedTransactions,
        };
        dispatch(sliceActions.setConsolidatedData(mergedData));
        dispatch(sliceActions.setFilteredBalanceInfo({ transactions: mergedData?.transactions }));
        dispatch(sliceActions.setPaginationData(data?.pagination));
        dispatch(commonAction.setTableFilteredData({ result: mergedData?.transactions }));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const filterSearchEvdRecharge =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(sliceActions.setConsolidatedParams(params));
    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(sliceActions.setConsolidatedParams(params));
      dispatch(callAction(params, QUERY.RechargeReport));
      return params;
    }
    const { searchText = '', search = '', radioContainer: incomingRadio } = params;
    const searchRaw = searchText || search || '';
    const searchValue = searchRaw.toString().trim();
    const applySearch = Boolean(searchValue);

    const { balanceInfo, filteredBalanceInfo, radioContainerRed: savedRadio, durationIdRed } = getState().evdBalanceInfo;
    const durationId = params?.null?.id ?? durationIdRed;
    dispatch(sliceActions.setSelcectedDurationId(durationId));

    const radioContainer = incomingRadio || savedRadio;

    const baseSource = filteredBalanceInfo?.transactions?.length > 0 ? filteredBalanceInfo.transactions : balanceInfo?.transactions ?? [];
    let data = [...baseSource];

    const now = Date.now();
    const msPerDay = 1000 * 60 * 60 * 24;
    const durationMap: Record<string, number | null> = {
      all: null,
      last10Days: Sizing.x10,
      last20Days: Sizing.x20,
      last30Days: Sizing.x30,
      last40Days: Sizing.x40,
    };
    const daysDuration = durationMap[durationId] ?? null;

    // Sorting
    if (radioContainer) {
      dispatch(sliceActions.setSelcectedFilters(radioContainer));

      const getSortDate = (item: ParentObject) => {
        if (item.otfDate) return new Date(item.otfDate);
        if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
        if (item.txnDate) return new Date(item.txnDate);
        return new Date(0);
      };

      data.sort((a, b) => {
        const dateA = getSortDate(a).getTime();
        const dateB = getSortDate(b).getTime();
        return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
      });
      dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: data }));
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    //  Duration filter
    if (daysDuration !== null) {
      data = data.filter((tx: ParentObject) => {
        const dateStr = tx.otfDate || tx.date || tx.txnDate;
        if (!dateStr) return false;

        const txTime = Date.parse(dateStr);
        if (Number.isNaN(txTime)) return false;

        const diffDays = (now - txTime) / msPerDay;
        return diffDays <= daysDuration && diffDays >= 0;
      });
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    // Search filter
    if (applySearch) {
      let searchSource: ParentObject[] = [];
      searchSource = data;
      data = searchSource.filter((item: ParentObject) => {
        const searchableFields = [item.subscriberID, item.transactionID, item.txnDate, item.bingeRechargeFlag, item.creditAmount];
        return searchableFields.some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        );
      });
    }
    const updatedTransactions = data.map((tx: any) => ({
      ...tx,
      remark: buildRemark(tx.txnDate),
      dateTime: `${tx.txnDate} ${tx.time}`,
    }));
    dispatch(commonAction.setTotalListCount(data.length));
    dispatch(commonAction.setTableFilteredData({ result: updatedTransactions }));
    // dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
    dispatch(uiActions.hideBottomModal());
    dispatch(clearDealerTimeout());
    return data;
  };

export const filterSearchOTF =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(sliceActions.setConsolidatedParams(params));
    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(sliceActions.setConsolidatedParams(params));
      dispatch(callAction(params, QUERY.ConsolidateOTFReport));
      return params;
    }
    const { searchText = '', search = '', radioContainer: incomingRadio } = params;
    const searchRaw = searchText || search || '';
    const searchValue = searchRaw.toString().trim();
    const applySearch = Boolean(searchValue);

    const { balanceInfo, filteredBalanceInfo, radioContainerRed: savedRadio, durationIdRed } = getState().evdBalanceInfo;
    const durationId = params?.null?.id ?? durationIdRed;
    dispatch(sliceActions.setSelcectedDurationId(durationId));

    const radioContainer = incomingRadio || savedRadio;

    const baseSource = filteredBalanceInfo?.transactions?.length > 0 ? filteredBalanceInfo.transactions : balanceInfo?.transactions ?? [];
    let data = [...baseSource];

    const now = Date.now();
    const msPerDay = 1000 * 60 * 60 * 24;
    const durationMap: Record<string, number | null> = {
      all: null,
      last10Days: Sizing.x10,
      last20Days: Sizing.x20,
      last30Days: Sizing.x30,
      last40Days: Sizing.x40,
    };
    const daysDuration = durationMap[durationId] ?? null;

    // Sorting
    if (radioContainer) {
      dispatch(sliceActions.setSelcectedFilters(radioContainer));

      const getSortDate = (item: ParentObject) => {
        if (item.otfDate) return new Date(item.otfDate);
        if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
        if (item.txnDate) return new Date(item.txnDate);
        return new Date(0);
      };

      data.sort((a, b) => {
        const dateA = getSortDate(a).getTime();
        const dateB = getSortDate(b).getTime();
        return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
      });
      dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: data }));
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    //  Duration filter
    if (daysDuration !== null) {
      data = data.filter((tx: ParentObject) => {
        const dateStr = tx.otfDate || tx.date || tx.txnDate;
        if (!dateStr) return false;

        const txTime = Date.parse(dateStr);
        if (Number.isNaN(txTime)) return false;

        const diffDays = (now - txTime) / msPerDay;
        return diffDays <= daysDuration && diffDays >= 0;
      });
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    // Search filter
    if (applySearch) {
      let searchSource: ParentObject[] = [];
      searchSource = data;
      data = searchSource.filter((item: ParentObject) => {
        const searchableFields = [item.subscriberID, item.transactionID, item.txnDate, item.bingeRechargeFlag, item.creditAmount];
        return searchableFields.some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        );
      });
    }
    const updatedTransactions = data.map((tx: any) => ({
      ...tx,
      remark: buildRemark(tx.txnDate),
      dateTime: `${tx.txnDate} ${tx.time}`,
    }));
    dispatch(commonAction.setTotalListCount(data.length));
    dispatch(commonAction.setTableFilteredData({ result: updatedTransactions }));
    dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
    dispatch(uiActions.hideBottomModal());
    dispatch(clearDealerTimeout());
    return data;
  };

export const consolidateOTFReport =
  (params: ParentObject, _queryName: string): AppThunk =>
  (dispatch, getState) => {
    if (!params || Object.keys(params).length === 0) {
      return;
    }
    dispatch(uiActions.setLoader());
    const { pageNumber, consolidatedParams, radioContainerRed: savedRadio } = getState().evdBalanceInfo;
    const { consolidatedData } = getState().evdBalanceInfo;
    const radioContainer = savedRadio;
    if (Object.keys(consolidatedParams).length === 0 && Object.keys(params).length === 0) {
      return;
    }
    const finalParams = {
      ...consolidatedParams,
      ...params,
    };
    dispatch(sliceActions.setConsolidatedParams(finalParams));
    const requestInput = {
      input: {
        limit: '30',
        numberOfDays: finalParams?.duration?.id || '20',
        page: String(pageNumber) ?? '1',
        partnerMdn: null,
        partnerRole: null,
        searchKeyword: finalParams?.searchText || finalParams?.search || null,
        transactionType: finalParams?.selectedVal || null,
      },
    };
    api
      .post(queries.otfReport, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.clearLoader());
        const dataList = data?.transactions;
        if (radioContainer) {
          dispatch(sliceActions.setSelcectedFilters(radioContainer));

          const getSortDate = (item: ParentObject) => {
            if (item.otfDate) return new Date(item.otfDate);
            if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
            if (item.txnDate) return new Date(item.txnDate);
            return new Date(0);
          };

          dataList.sort((a: any, b: any) => {
            const dateA = getSortDate(a).getTime();
            const dateB = getSortDate(b).getTime();
            return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
          });
          dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: dataList }));
          dispatch(sliceActions.setFilteredConf({ transactions: dataList }));
        }
        const updatedData = dataList.map((item: ParentObject) => ({
          ...item,
          txnDate: item?.txnDate,
          dateTime: `${item.otfDate} ${item.transactionTime}`,
        }));
        const isFirstPage = pageNumber === 1;
        const mergedData = isFirstPage ? updatedData : [...(consolidatedData || []), ...updatedData];
        dispatch(sliceActions.setFilteredBalanceInfo({ transactions: mergedData }));
        dispatch(sliceActions.setConsolidatedData(mergedData));
        dispatch(sliceActions.setPaginationData(data?.pagination));
        dispatch(commonAction.setTableFilteredData({ result: mergedData }));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const consolidatedReport =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    if (params?.duration?.id === '30' || params?.duration?.id === '40' || params?.duration?.id === '10' || params?.duration?.id === '20') {
      const nextPage = 1;
      dispatch(sliceActions.setPageNumber(nextPage));
      dispatch(callAction(params, QUERY.ConsolidatedOnlineReport));
      return params;
    }
    const { searchText = '', search = '', radioContainer: incomingRadio, searchLocally, transactionType } = params;
    const searchRaw = searchText || search || '';
    const searchValue = searchRaw.toString().trim();
    const applySearch = Boolean(searchValue);
    const dropDownFilter = searchLocally || transactionType;

    const { balanceInfo, radioContainerRed: savedRadio, durationIdRed } = getState().evdBalanceInfo;
    const durationId = params?.null?.id ?? durationIdRed;
    dispatch(sliceActions.setSelcectedDurationId(durationId));

    const radioContainer = incomingRadio || savedRadio;
    const baseSource = balanceInfo?.transactions ?? [];

    let data = [...baseSource];
    if (dropDownFilter && dropDownFilter !== STRINGS.ALL) {
      data = data.filter((t) => {
        const text = t?.operation || '';
        const lower = text.toLowerCase();

        switch (dropDownFilter) {
          case STRINGS.RECHARGES:
            return /recharge(?! reversal)/i.test(text);

          case STRINGS.BALANCE_TRANSFER: {
            const balanceTransferIndex = lower.indexOf(STRINGS.BALANCE_TRANSFER_LOWER);
            const reversalIndex = lower.indexOf(STRINGS.REVERSAL_LOWER);
            const reverseIndex = lower.indexOf(STRINGS.REVERSE_LOWER);

            let firstRevIndex;

            if (reverseIndex === -1) {
              firstRevIndex = reversalIndex;
            } else if (reversalIndex === -1) {
              firstRevIndex = reverseIndex;
            } else {
              firstRevIndex = Math.min(reverseIndex, reversalIndex);
            }
            return /balance transfer/i.test(text) && (firstRevIndex === -1 || balanceTransferIndex < firstRevIndex);
          }

          case STRINGS.REVERSALS:
            return /reversal|reverse/i.test(text);

          case STRINGS.BINGE_EVD_TRANSACTION:
            return /evd wallet/i.test(text);

          case STRINGS.OTF_CREDITS:
            return /otf|margin|activation|incentive|payout|offer|bonus|bonuscredit|msales|binge|subscription|deactive|refund|price|scheme|easy form|upp|bpos|regional/i.test(text);

          case STRINGS.OTHERS:
            return !(/recharge/i.test(text) || /balance transfer/i.test(text) || /reversal|reverse/i.test(text) || /evd wallet/i.test(text));

          default:
            return true;
        }
      });
    }
    const now = Date.now();
    const msPerDay = 1000 * 60 * 60 * 24;
    const durationMap: Record<string, number | null> = {
      all: null,
      last10Days: Sizing.x10,
      last20Days: Sizing.x20,
      last30Days: Sizing.x30,
      last40Days: Sizing.x40,
    };
    const daysDuration = durationMap[durationId] ?? null;

    // Sorting
    if (radioContainer) {
      dispatch(sliceActions.setSelcectedFilters(radioContainer));

      const getSortDate = (item: ParentObject) => {
        if (item.otfDate) return new Date(item.otfDate);
        if (item.txnDate && item.time) return new Date(`${item.txnDate} ${item.time}`);
        if (item.txnDate) return new Date(item.txnDate);
        return new Date(0);
      };

      data.sort((a, b) => {
        const dateA = getSortDate(a).getTime();
        const dateB = getSortDate(b).getTime();
        return radioContainer === STRINGS.NEWEST ? dateB - dateA : dateA - dateB;
      });
      dispatch(sliceActions.setFilteredBalanceInfoConf({ transactions: data }));
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    //  Duration filter
    if (daysDuration !== null) {
      data = data.filter((tx: ParentObject) => {
        const dateStr = tx.otfDate || tx.date || tx.txnDate;
        if (!dateStr) return false;

        const txTime = Date.parse(dateStr);
        if (Number.isNaN(txTime)) return false;

        const diffDays = (now - txTime) / msPerDay;
        return diffDays <= daysDuration && diffDays >= 0;
      });
      dispatch(sliceActions.setFilteredConf({ transactions: data }));
    }

    // Search filter
    if (applySearch) {
      let searchSource: ParentObject[] = [];
      searchSource = data;
      data = searchSource.filter((item: ParentObject) => {
        const searchableFields = [item.subscriberID, item.transactionID, item.txnId, item.subId, item.msg5, item.donorName, item.bingeFlag, item.recipientName, item.transId];
        return searchableFields.some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        );
      });
    }
    const updatedTransactions = data.map((tx: any) => ({
      ...tx,
      remark: buildRemark(tx.txnDate),
      dateTime: `${tx.otfDate} ${tx.transactionTime}`,
    }));
    dispatch(commonAction.setTotalListCount(data.length));
    dispatch(commonAction.setTableFilteredData({ result: updatedTransactions }));
    dispatch(sliceActions.setFilteredBalanceInfo({ transactions: data }));
    dispatch(uiActions.hideBottomModal());
    dispatch(clearDealerTimeout());
    return data;
  };
export const rechargeTrasactions =
  (_params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(formActions.setUpdatedFormFields({ duration: { id: 'last20', name: 'last 20 Transactions' } }));
    dispatch(sliceActions.setPageNumber(0));
  };
