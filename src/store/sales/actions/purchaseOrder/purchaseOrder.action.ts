/**
 * here the dealeer can track and raise any purches order
 *
 * @module store/sales/actions/purchaseOrder
 *
 */
import { sliceActions } from 'store/sales/reducer/purchaseOrder';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
import { ParentObject } from 'store/sales/types/common';
import commonAction from 'store/sales/actions/common';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import formActions from 'store/sales/actions/form';
import { ALERT, CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, MODAL, PROPERTIES, QUERY, ROUTE, STRINGS } from 'const';
import { callAction } from 'utils/formBuilderHelper';
import commonActions from 'store/sales/actions/common';
import { sliceActions as storeAction } from 'store/sales/reducer/storeDashboard';
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
 * dispatch(purchaseOrderAction({ exampleParam: 'exampleValue' }));
 */

export const openEVDForm = (): AppThunk => (dispatch) => {
  MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackEVDRequest.moduleName, {
    [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackEVDRequest.attributes.Status]: true,
  });
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.TRACK_REQUEST_EVD,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.openEVDForm,
      headerIcon: ICONS.TRACK_REQUEST_OLD,
    }),
  );
};

export const trackRequest =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(sliceActions.setDealerMob(params?.purchaseOrderEVDForm));
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      input: {
        dataEvdId: null,
        dataMobileNumber: info?.mdn,
        distributorMdn: info?.mdn,
        fosOrDealerMdn: params?.purchaseOrderEVDForm,
        mobSource: 'MOBWEB',
        role: info?.internalRole,
      },
    };
    return api
      .post(queries.DistributorTrackRequestWeb, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.PURCHASE_ORDER_DURATION);
        return data;
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
      });
  };

export const distributorTrackRequestDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { dealerMob } = getState().purchaseOrder;
    dispatch(uiActions.hideBottomModal());
    dispatch(uiActions.setLoader());
    dispatch(sliceActions.setDuration(params?.requestedDate));
    dispatch(sliceActions.setStatus(params?.requestedType));
    dispatch(sliceActions.setDuration(params?.requestedDate));
    dispatch(sliceActions.setStatus(params?.requestedType));
    const requestInput = {
      input: {
        distributorMdn: info?.mdn,
        fosOrDealerMdn: dealerMob,
        mobSource: null,
        role: info?.internalRole,
        rowNum: params?.requestedDate?.id,
        statusSelect: params?.requestedType?.id || STRINGS.ALL,
        formName: FORMS.purchaseOrderTrackDetails,
      },
    };
    return api
      .post(queries.DistributorTrackRequestDetails, requestInput)
      .then((response) => {
        dispatch(uiActions.clearLoader());
        const data = refactorResponse(response);
        const updatedData = data?.response?.distributorTrackDetailsForFosAndDealer.map((item: ParentObject) => ({
          ...item,
          PRODUCT: i18next.t('strings.PRODUCT'),
          remarks: item.status === 'Approved' || item.status === 'Pending' ? 'NA' : item.remarks,
          paymentType: item?.paymentType?.replace(/_/g, ' '),
        }));
        dispatch(sliceActions.setDistributorTrackRequestDetails(updatedData));
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: updatedData }));
        navigate(ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS);
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const searchPoTrackDetails =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { distributorTrackRequestDetails } = getState().purchaseOrder;

    const requestFilters = {
      searchText: params?.searchText || '',
    };
    const finalFilteredData = (Array.isArray(distributorTrackRequestDetails) ? distributorTrackRequestDetails : []).filter((item: ParentObject) => {
      const searchMatch =
        !requestFilters.searchText ||
        Object.values({
          mdn: item.mdn,
          parent_mdn: item.parent_mdn,
          transactor_account_id: item.transactor_account_id,
          transactee_account_id: item.transactee_account_id,
          name: item.nameNT,
          distributor_mdn: item.distributor_mdn,
          amount: item.amount,
          status: item.statusNT,
          request_date: item.request_date,
          last_updated_date: item.last_updated_date,
          payment_type: item.paymentTypeNT,
          payment_id: item.paymentIdNT,
          remarks: item.remarksNT,
          source: item.sourceNT,
          transfer_amount: item.transfer_amount,
        }).some((val) => val?.toString().toLowerCase().includes(requestFilters.searchText.toLowerCase()));
      return searchMatch;
    });
    dispatch(commonAction.setTotalListCount(finalFilteredData.length));
    dispatch(commonAction.setTableFilteredData({ result: finalFilteredData }));
  };

export const searchPoTrackDetailsPOSM =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { posmDetails } = getState().purchaseOrder;
    const requestFilters = {
      searchText: params?.searchText || '',
    };

    const finalFilteredData = (posmDetails || []).filter((item: ParentObject) => {
      const searchMatch =
        !requestFilters.searchText ||
        Object.values({
          DealerEVD: item.DealerEVD,
          accountNumber: item.accountNumber,
          dealerName: item.dealerNameNT,
          distributorCode: item.distributorCode,
          distributorName: item.distributorNameNT,
          distributor_mdn: item.distributor_mdn,
          distributorRMN: item.distributorRMN,
          lastUpdDate: item.lastUpdDate,
          orderDate: item.orderDate,
          orderNumber: item.orderNumber,
          orderType: item.orderTypeNT,
          productType: item.productTypeNT,
          rejectReasonCode: item.rejectReasonCode,
          salesType: item.salesTypeNT,
          status: item.statusNT,
          tslOrderSource: item.tslOrderSourceNT,
        }).some((val) => val?.toString().toLowerCase().includes(requestFilters.searchText.toLowerCase()));
      return searchMatch;
    });
    dispatch(commonAction.setTotalListCount(finalFilteredData.length));
    dispatch(commonAction.setTableFilteredData({ result: finalFilteredData }));
  };

export const openMaterialsForm = (): AppThunk => (dispatch) => {
  MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackPOSM.moduleName, {
    [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackPOSM.attributes.Status]: true,
  });
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.METERIAL,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.openMaterialsForm,
      headerIcon: ICONS.TRACK_REQUEST_OLD,
    }),
  );
};
export const trackRequestMeterial =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(sliceActions.setDealerMob(params?.purchaseOrderEVDForm));
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      input: {
        dataEvdId: null,
        dataMobileNumber: info?.mdn,
        parentUserName: info?.mdn,
        parentUserRole: info?.internalRole,
        userName: params?.purchaseOrderEVDForm,
        formName: FORMS.purchaseOrderTrackPOSM,
        formName2: FORMS.productDetailsPO,
      },
    };
    return api
      .post(queries.DoGetPOSMOrderDetailsWeb, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(sliceActions.setDetailsColumn(data?.tableColumns2));
        dispatch(sliceActions.setPosmDetails(data?.response?.orderDetails));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.response?.orderDetails }));
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_POSM);
      })
      .catch((error) => dispatch(commonActions.setErrorMessage(error.message)));
  };

export const setAutoData = (): AppThunk => (dispatch, getState) => {
  const { duration, status } = getState().purchaseOrder;
  const PAYMENT_TYPE = PROPERTIES.PURCHASE_ORDER.getPaymentTypes();
  const DURATION_TYPE = PROPERTIES.PURCHASE_ORDER.getDurationTypes();

  const autoCompleteData = {
    requestType: PAYMENT_TYPE,
    requestDate: DURATION_TYPE,
  };
  const selectedDuration = Object.keys(duration || {}).length === 0 ? DURATION_TYPE[0] : duration;
  const selectedStatus = Object.keys(status || {}).length === 0 ? PAYMENT_TYPE[0] : status;
  dispatch(formAction.setMultipleAutoCompleteData({ data: autoCompleteData }));
  dispatch(formActions.setUpdatedFormFields({ requestedDate: selectedDuration, requestedType: selectedStatus }));
};

export const openEVDFormDealer =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackEVDRequest.moduleName, {
      [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackEVDRequest.attributes.Status]: true,
    });
    navigate(ROUTE.WEB.PURCHASE_ORDER_DEALER_DURATION);
  };

export const dealerTrackRequestDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        mobsource: 'MOBWEB',
        role: info?.internalRole,
        userId: info?.mdn,
      },
    };
    return api
      .post(queries.GetDealerTrackRequest, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(uiActions.clearLoader());
          dispatch(callAction(params, QUERY.GetDealerTrackDetails, '', navigate));
        }
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const getDealerTrackDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    dispatch(sliceActions.setDuration(params?.requestedDate));
    dispatch(sliceActions.setStatus(params?.requestedType));
    const requestInput = {
      input: {
        rowNum: params?.requestedDate?.id,
        statusSelect: params?.requestedType?.id,
        userId: info?.userId,
        formName: FORMS.purchaseOrderTrackDetailsDealer,
      },
    };
    return api
      .post(queries.FetchDealerIdTrackRequest, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const updatedData = data?.response?.dealerTrackDetails.map((item: ParentObject) => ({
          ...item,
          PRODUCT: i18next.t('strings.PRODUCT'),
          remarks: item.status === 'Approved' || item.status === 'Pending' ? 'NA' : item.remarks,
          paymentType: item?.paymentType?.replace(/_/g, ' '),
        }));
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(sliceActions.setDistributorTrackRequestDetails(updatedData));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: updatedData }));
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.PURCHASE_ORDER_DEALER_TRACK_DETAILS);
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const openMaterialsFormDealer =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        dataEvdId: null,
        dataMobileNumber: info?.mdn,
        parentUserName: info?.mdn,
        parentUserRole: info?.internalRole,
        userName: info?.mdn,
        formName: FORMS.purchaseOrderTrackPOSM,
        formName2: FORMS.productDetailsPO,
      },
    };
    return api
      .post(queries.DoGetPOSMOrderDetailsWeb, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackPOSM.moduleName, {
          [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackPOSM.attributes.Status]: true,
        });
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(sliceActions.setDetailsColumn(data?.tableColumns2));
        dispatch(sliceActions.setPosmDetails(data?.response?.orderDetails));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.response?.orderDetails }));
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_DEALER_POSM);
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };
export const openEVDFormFos =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackEVDRequest.moduleName, {
      [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackEVDRequest.attributes.Status]: true,
    });
    navigate(ROUTE.WEB.PURCHASE_ORDER_FOS_DURAION);
  };

export const fosTrackRequestDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    const requestInput = {
      input: {
        mobSource: 'MOBWEB',
        role: info?.internalRole,
        userId: info?.mdn,
      },
    };
    return api
      .post(queries.FosGetDealerIdForTrackRequest, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          dispatch(uiActions.clearLoader());
          dispatch(callAction(params, QUERY.Getfostrackrequest, '', navigate));
        }
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };
export const getfostrackrequest =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    dispatch(sliceActions.setDuration(params?.requestedDate));
    dispatch(sliceActions.setStatus(params?.requestedType));
    const requestInput = {
      input: {
        rowNum: params?.requestedDate?.id,
        statusSelect: params?.requestedType?.id,
        userId: info?.userId,
        formName: FORMS.purchaseOrderTrackDetailsFos,
      },
    };
    return api
      .post(queries.GetFosTrackRequest, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const updatedData = data?.response?.dealerTrackDetailsForFos.map((item: ParentObject) => ({
          ...item,
          PRODUCT: i18next.t('strings.PRODUCT'),
          remarks: item.status === 'Approved' || item.status === 'Pending' ? 'NA' : item.remarks,
          paymentType: item?.paymentType?.replace(/_/g, ' '),
        }));
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(sliceActions.setDistributorTrackRequestDetails(updatedData));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: updatedData }));
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.PURCHASE_ORDER_FOS_TRACK_DETAILS);
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const openMaterialsFormFos =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, _navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackPOSM.moduleName, {
      [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackPOSM.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.METERIAL,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.openMaterialsFormFos,
        headerIcon: ICONS.TRACK_REQUEST_OLD,
      }),
    );
  };

export const trackRequestMeterialFos =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      input: {
        dataEvdId: null,
        dataMobileNumber: info?.mdn,
        parentUserName: info?.mdn,
        parentUserRole: info?.internalRole,
        userName: params?.purchaseOrderEVDForm,
        formName: FORMS.purchaseOrderTrackPOSM,
        formName2: FORMS.productDetailsPO,
      },
    };
    return api
      .post(queries.DoGetPOSMOrderDetailsWeb, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(sliceActions.setDetailsColumn(data?.tableColumns2));
        dispatch(sliceActions.setPosmDetails(data?.response?.orderDetails));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.response?.orderDetails }));
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_FOS_POSM);
      })
      .catch((error) => {
        dispatch(commonAction.setErrorMessage(error.message));
      });
  };

export const walletOptions =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    const requestInput = {
      input: {
        evdId: null,
        rmn: info?.mdn,
        userId: info?.userId,
      },
    };
    return api
      .post(queries.GetPaymentOptionsWeb, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_Walletoptions.moduleName, {
          [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_Walletoptions.attributes.Status]: true,
        });
        const paymentIdsWithDisplayName = data?.response?.paymentId?.map((item: ParentObject) => {
          let displayName = '';
          const newPaymentType = item?.paymentType.replace(/_/g, ' ');
          if (item.paymentTypeNT === STRINGS.BANK) {
            displayName = `${item.paymentId} - ${item.bankName} - ${item.ifscNo} - ${item.userName}`;
          } else {
            displayName = `${item.paymentId} - ${newPaymentType}`;
          }

          return {
            ...item,
            displayName,
          };
        });
        const walletTypeIds = paymentIdsWithDisplayName.map((item: ParentObject) => item.paymentTypeNT);
        const filteredPaymentTypes = data?.response?.paymentType.filter((item: ParentObject) => !walletTypeIds.includes(item?.nameNT));

        dispatch(sliceActions.setFullPaymentType(data?.response?.paymentType));
        const formattedPaymentTypes = filteredPaymentTypes.map((item: ParentObject) => {
          const displayName = item?.name?.replace(/_/g, ' ');
          return {
            ...item,
            name: displayName,
          };
        });
        dispatch(uiActions.clearLoader());
        dispatch(sliceActions.setPaymentType(formattedPaymentTypes));
        dispatch(sliceActions.setWalletDetails(paymentIdsWithDisplayName));
        if (paymentIdsWithDisplayName.length > 0) {
          navigate(ROUTE.WEB.REGISTER_PAYMENT_OPTION);
          return;
        }
        dispatch(sliceActions.setIsEditable(false));
        dispatch(sliceActions.setEditData({}));
        navigate(ROUTE.WEB.REGISTER_NEW_PAYMENT_ID);
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const navigateSettlements =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    const currentDate = now.getDate();
    dispatch(callAction({ year: String(currentYear), month: String(currentMonthIndex), date: String(currentDate), navigate: true }, QUERY.FetchSettlements, '', navigate));
  };

export const transformSettlements = (res: any = {}) => {
  const formatSettlementDate = (timestamp: any) => {
    const date = new Date(timestamp * 1000);
    const parts = date
      .toLocaleString('en-US', {
        timeZone: 'UTC',
        hour: 'numeric',
        hour12: true,
        minute: 'numeric',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .replace(/,/g, '')
      .split(' ');

    return `${parts[1]}-${parts[0]}-${parts[2]} ${parts[3]} ${parts[4]}`;
  };
  const dealers =
    res?.dealerIds?.flat()?.map((d: any) => ({
      name: `${d.user_id} - ${d.MDN} - ${d.NAME}`,
      value: d.user_id,
    })) ?? [];
  dealers.unshift({ name: i18next.t('strings.All'), value: STRINGS.ALL });

  const { rows, totalAmount } = (Object.values(res?.settlements ?? {}) as any[]).reduce(
    (acc: any, settlementGroup: any[]) => {
      const settlementAmount = settlementGroup.reduce((sum: number, item: any) => (item.type === 'refund' ? sum - item.amount : sum + item.amount), 0);

      acc.totalAmount += settlementAmount;

      const settlementRows = settlementGroup.map((item: any) => {
        const notes = item.notes ? JSON.parse(item.notes) : {};
        const isRefund = item.type === 'refund';

        return {
          settlementDate: formatSettlementDate(item.settled_at),
          settlementId: item.settlement_id,
          settlementTotal: settlementAmount / 100,
          dealerCode: notes.transactee ?? 'NA',
          paymentId: isRefund ? item.payment_id : item.entity_id,
          status: isRefund ? 'Refunded' : 'Settled',
          refundId: isRefund ? item.entity_id : 'NA',
          amount: (item.amount / 100) * (isRefund ? -1 : 1),
          evdBalance: notes.amount ? notes.amount / 100 : 0,
        };
      });

      acc.rows.push(...settlementRows);
      return acc;
    },
    { rows: [], totalAmount: 0 },
  );

  return {
    dealers,
    rows,
    totalAmount: totalAmount / 100,
  };
};

export const FetchSettlements =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    dispatch(uiActions.hideBottomModal());
    const { info } = getState().user;
    const Month = Number(params?.month) + 1;
    const requestedDate = {
      input: {
        date: params?.date,
        distId: info?.userId,
        month: String(Month),
        year: params?.year,
        formName: FORMS.purchaseOrderSettelmentsTable,
      },
    };
    return api
      .post(queries.FetchSettlements, requestedDate)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_Settlements.moduleName, {
            [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_Settlements.attributes.Status]: true,
          });
          dispatch(uiActions.clearLoader());
          const transformed = transformSettlements(data?.response);
          dispatch(sliceActions.setTableColumn(data?.tableColumns));
          dispatch(sliceActions.setSettlementsData(transformed));
          dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: transformed?.rows }));
          if (params?.navigate) {
            dispatch(storeAction.setDateForStoreDashboard(''));
            navigate(ROUTE.WEB.PURCHASE_ORDER_SETTLEMENTS);
          }
        }
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const searchSettlements =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { settlementsData } = getState().purchaseOrder;
    const requestFilters = {
      searchText: params?.searchText || '',
    };
    const finalFilteredData = settlementsData?.rows?.filter((item: ParentObject) => {
      const searchMatch =
        !requestFilters.searchText ||
        Object.values({
          settlementDate: item?.settlementDate,
          settlementId: item.settlementId,
          settlementTotal: item?.settlementTotal,
          dealerCode: item?.dealerCode,
          paymentId: item?.paymentId,
          status: item?.status,
          refundId: item?.refundId,
          amount: item?.amount,
          evdBalance: item?.evdBalance,
        }).some((val) => val?.toString().toLowerCase().includes(requestFilters.searchText.toLowerCase()));
      return searchMatch;
    });
    dispatch(commonAction.setTotalListCount(finalFilteredData.length));
    dispatch(commonAction.setTableFilteredData({ result: finalFilteredData }));
  };

export const distributorPaymentIdUpdate =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    dispatch(uiActions.hideBottomModal());
    const { info } = getState().user;
    const requestedDate = {
      input: {
        oldPaymentId: params?.oldPaymentId || '',
        paymentAccName: params?.paymentAccName || '',
        paymentBankName: params?.paymentBankName || '',
        paymentIFSC: params?.paymentIFSC || '',
        paymentId: params?.paymentId || '',
        paymentOperation: params?.paymentOperation || '',
        paymentType: params?.paymentType || '',
        userId: info?.userId || '',
      },
    };
    return api
      .post(queries.DistributorPaymentIdUpdate, requestedDate)
      .then((response) => {
        const data = refactorResponse(response);
        if (data?.status) {
          if (params?.paymentOperation === 'I') {
            MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_Addwallet.moduleName, {
              [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_Addwallet.attributes.Status]: true,
            });
          }
          if (params?.paymentOperation === 'D') {
            MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_Deletewallet.moduleName, {
              [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_Deletewallet.attributes.Status]: true,
            });
          }
          dispatch(uiActions.clearLoader());
          dispatch(
            uiActions.showAlert(
              data?.response?.errorMessage,
              ALERT.SUCCESS,
              {
                primaryText: MODAL.OK,
                secondaryText: MODAL.CANCEL,
              },
              {},
            ),
          );
          const paymentIdsWithDisplayName = data?.response?.paymentId?.map((item: ParentObject) => {
            let displayName = '';
            const newPaymentType = item?.paymentType.replace(/_/g, ' ');
            if (item.paymentTypeNT === STRINGS.BANK) {
              displayName = `${item.paymentId} - ${item.bankName} - ${item.ifscNo} - ${item.userName}`;
            } else {
              displayName = `${item.paymentId} - ${newPaymentType}`;
            }

            return {
              ...item,
              displayName,
            };
          });
          dispatch(uiActions.clearLoader());
          dispatch(sliceActions.setWalletDetails(paymentIdsWithDisplayName));
          if (paymentIdsWithDisplayName?.length > 0) {
            navigate(ROUTE.WEB.REGISTER_PAYMENT_OPTION);
            return;
          }
          dispatch(sliceActions.setIsEditable(false));
          dispatch(sliceActions.setEditData({}));
          navigate(ROUTE.WEB.REGISTER_NEW_PAYMENT_ID);
        }
      })
      .catch((error) => {
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.showErrorPage(error.message));
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
 * dispatch(distributorPaymentIdUpdate({ exampleParam: 'exampleValue' }));
 */
export const getPosmDealerId1 =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    dispatch(uiActions.hideBottomModal());
    const { info } = getState().user;
    const requestObject = {
      input: {
        mobSource: 'MOBWEB',
        role: info.internalRole,
        userId: info.userId,
      },
    };
    return api
      .post(queries.getPosmDealerId1, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(uiActions.clearLoader());
          const dealerId = data?.response?.dealerId;
          const requestParams = {
            input: {
              userId: dealerId,
            },
          };
          dispatch(callAction(requestParams, QUERY.FosGetRaiseRequestDetails, '', navigate));
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(getPosmDealerId1({ exampleParam: 'exampleValue' }));
 */
export const fosGetRaiseRequestDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries.fosGetRaiseRequestDetails, params)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(sliceActions.setActionRequestTableData(data?.response?.fosRaiseDetails));
          navigate(ROUTE.WEB.ACTION_REQUEST_PO);

          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(sliceActions.setActionRequestTableData([]));
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
 * dispatch(fosApproveRequest({ exampleParam: 'exampleValue' }));
 */
export const fosApproveRequest =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries.fosApproveRequest, params)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(
            uiActions.showAlert(
              data?.response?.errorMessage,
              ALERT.CONFIRM,
              {
                primaryText: MODAL.OK,
                routeName: ROUTE.WEB.PURCHASE_ORDER_REQUEST,
              },
              {},
            ),
          );
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(getFosRejectionReasonFromProperty({ exampleParam: 'exampleValue' }));
 */
export const getFosRejectionReasonFromProperty =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: {
        FosRejectionReason: STRINGS.FOS_REJECTION_REASON,
      },
    };
    return api
      .post(queries.getFosRejectionReasonFromProperty, requestObject)
      .then((response) => {
        if (response?.status) {
          dispatch(sliceActions.setRejectedUserData(params));
          const data = refactorResponse(response);
          const formattedDetails = data?.response?.FosRejectionReason?.map((item: ParentObject) => ({
            text: item?.name,
            value: item?.nameNT,
          }));
          dispatch(formActions.setRadioContainerOptions(formattedDetails, QUERY.RejectReasonsPO));
          dispatch(
            uiActions.showBottomModal({
              isCenterModal: true,
              isModalVisible: true,
              type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
              headerTitle: HEADER_TITLE.REJECT_REASON,
              headerIcon: ICONS.ACTION_REQUEST_PO,
              showCloseIcon: true,
              showHeader: true,
              formName: FORMS.purchaseOrderRejectReasons,
            }),
          );
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(fosRejectAndReasonRequest({ exampleParam: 'exampleValue' }));
 */
export const fosRejectAndReasonRequest =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { rejectedUserData } = getState().purchaseOrder;

    dispatch(uiActions.hideBottomModal());
    dispatch(uiActions.setLoader());
    const remarks = params?.rejectReasons === STRINGS.OTHERS ? `${STRINGS.OTHERS}-${params?.remarks}` : params?.rejectReasons;
    const requestObject = {
      input: {
        amount: rejectedUserData?.amount,
        id: rejectedUserData?.id,
        mobSource: 'MOBWEB',
        remarks,
        status: rejectedUserData?.statusNT,
        transacteeAccountId: rejectedUserData?.transactee_account_id,
        transactorAccountId: rejectedUserData?.transactor_account_id,
      },
    };
    return api
      .post(queries.fosRejectAndReasonRequest, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(
            uiActions.showAlert(
              data?.response?.errorMessage,
              ALERT.CONFIRM,
              {
                primaryText: MODAL.OK,
                routeName: ROUTE.WEB.PURCHASE_ORDER_REQUEST,
              },
              {},
            ),
          );
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(getOrderId({ exampleParam: 'exampleValue' }));
 */
export const getOrderId =
  (params: ParentObject, queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries[queryName], { input: params })
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(sliceActions.setOrderIdDetails(data?.response));
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, message: error.message };
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
 * dispatch(fosRejectAndReasonRequest({ exampleParam: 'exampleValue' }));
 */
export const doPosmBalanceEnquiryWeb =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;

    dispatch(uiActions.setLoader());
    const requestObject = {
      input: {
        dataEvdId: null,
        dataMobileNumber: null,
        donarRMN: info.mdn,
        mobSource: 'MOBWEB',
        pin: '',
        recipientRMN: info.mdn,
        type: null,
      },
    };
    return api
      .post(queries.doPosmBalanceEnquiryWeb, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(sliceActions.setBalanceEnquiryData(data?.response));
          dispatch(callAction({}, QUERY.GetPaymentOptionsforDealerWeb, '', navigate));
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(getPaymentOptionsforDealerWeb({ exampleParam: 'exampleValue' }));
 */
export const getPaymentOptionsforDealerWeb =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: {
        dataEvdId: null,
        dataMobileNumber: info.mdn,
        dealerId: info.userId,
      },
    };
    return api
      .post(queries.getPaymentOptionsforDealerWeb, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          const paymentId = data?.response?.paymentId;
          const updatedPaymentIds = paymentId.map((item: ParentObject) => {
            const isBank = item.paymentTypeNT === STRINGS.BANK;

            const displayName = isBank ? item.bankName : item.paymentType?.replace('_', ' ');

            return {
              ...item,
              id: item?.paymentIdNT,
              name: displayName,
              nameNT: displayName,
              value: displayName,
            };
          });

          dispatch(sliceActions.setPaymentTypesData({ ...data?.response, paymentId: updatedPaymentIds }));
          dispatch(sliceActions.setSelectedMaterial([]));
          dispatch(sliceActions.setSelectedMaterialPill(i18next.t('strings.TSK&RCV')));
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(getPOSMData({ exampleParam: 'exampleValue' }));
 */
export const getPOSMData =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: {
        productType: null,
        userName: null,
      },
    };
    return api
      .post(queries.getPOSMData, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(sliceActions.setAllMaterialDetailsData(data?.response));
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(doRaiseReqRCVTSKPOSMWeb({ exampleParam: 'exampleValue' }));
 */
export const doRaiseReqRCVTSKPOSMWeb =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: {
        dataEvdId: null,
        dataMobileNumber: info?.mdn,
        productType: params?.selectedMaterial?.[0]?.materialType === 'TSK' ? 'TSKRCV' : 'POSMATERIALS',
        userName: info?.userId,
        productArray: params?.selectedMaterial.map((item: ParentObject) => ({
          productCode: item.productCode,
          productFriendlyName: item.productFriendlyName,
          productName: item.productName,
          productQuantity: item.totalCount.toString(),
          productType: item.materialType,
        })),
      },
    };
    return api
      .post(queries.doRaiseReqRCVTSKPOSMWeb, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(sliceActions.setOrderSucessMessage(i18next.t('strings.productSuccess')));
          dispatch(
            uiActions.showAlert(
              data?.response?.message,
              ALERT.SUCCESS,
              {
                primaryText: MODAL.OK,
                routeName: ROUTE.WEB.EVD_RAISE_REQUEST_SUCCESS,
              },
              {},
            ),
          );
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message.includes('SBL-') ? i18next.t('errors.errorOccured') : error.message));
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
 * dispatch(dealerBalanceRequest({ exampleParam: 'exampleValue' }));
 */
export const dealerBalanceRequest =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: {
        dealerid: info.userId,
        paymentId: params?.selectedPartner?.paymentIdNT,
        recommendedamount: params?.amount,
        walletName: params?.selectedPartner?.paymentTypeNT,
      },
    };
    return api
      .post(queries.dealerBalanceRequest, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(doGetPOSMAssetDetails({ exampleParam: 'exampleValue' }));
 */
export const doGetPOSMAssetDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: {
        posmSlectedProductName: params?.productName,
        posmOrderNo: params?.orderNumber,
      },
    };
    return api
      .post(queries.doGetPOSMAssetDetails, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(
            uiActions.showAlert(
              data?.response?.message,
              ALERT.SUCCESS,
              {
                primaryText: MODAL.OK,
              },
              {},
            ),
          );
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(doGetPOSMAssetDetails({ exampleParam: 'exampleValue' }));
 */
export const storeStatus =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { orderIdDetails } = getState().purchaseOrder;
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: {
        res: {
          amount: orderIdDetails?.amount,
          apiKey: orderIdDetails?.apiKey,
          comAmount: orderIdDetails?.comAmount,
          dealerId: orderIdDetails?.dealerId,
          distId: orderIdDetails?.distId,
          evdTransId: orderIdDetails?.evdTransId,
          orderId: orderIdDetails?.orderId,
          transId: orderIdDetails?.transId,
          transferId: orderIdDetails?.transferId,
        },
        response: {
          razorpay_order_id: params?.response?.razorpay_order_id,
          razorpay_payment_id: params?.response?.razorpay_payment_id,
          razorpay_signature: params?.response?.razorpay_signature,
          description: params?.response?.description,
          reason: params?.response?.reason,
        },
        status: params?.status,
      },
    };
    return api
      .post(queries.storeStatus, requestObject)
      .then((response) => {
        if (response?.status) {
          const data = refactorResponse(response);
          dispatch(
            uiActions.showAlert(
              data?.response?.message,
              ALERT.SUCCESS,
              {
                primaryText: MODAL.OK,
                routeName: params?.status === STRINGS.SUCCESS ? ROUTE.WEB.EVD_RAISE_REQUEST_SUCCESS : null,
              },
              {},
            ),
          );
          return { status: true, data };
        }
        dispatch(uiActions.showErrorPage(response.message));
        return { status: false, message: response.message };
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
 * dispatch(openEVDFormASM({ exampleParam: 'exampleValue' }));
 */
export const openEVDFormASM = (): AppThunk => (dispatch) => {
  MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackEVDRequest.moduleName, {
    [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackEVDRequest.attributes.Status]: true,
  });
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.TRACK_REQUEST_EVD,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.openEVDFormASM,
      headerIcon: ICONS.TRACK_REQUEST_OLD,
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
 * dispatch(openMaterialsFormASM({ exampleParam: 'exampleValue' }));
 */
export const openMaterialsFormASM = (): AppThunk => (dispatch) => {
  MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackPOSM.moduleName, {
    [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_TrackPOSM.attributes.Status]: true,
  });
  dispatch(
    uiActions.showBottomModal({
      isModalVisible: true,
      isCenterModal: true,
      type: CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM,
      headerTitle: HEADER_TITLE.METERIAL,
      showCloseIcon: true,
      showHeader: true,
      formName: FORMS.openMaterialsFormASM,
      headerIcon: ICONS.TRACK_REQUEST_OLD,
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
 * dispatch(asmAsiTrackRequest({ exampleParam: 'exampleValue' }));
 */
export const asmAsiTrackRequest =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(sliceActions.setDealerMob(params?.purchaseOrderEVDFormASM));
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      input: {
        asmasiusername: info?.userId,
        fosOrDealerMdn: params?.purchaseOrderEVDFormASM,
        mobSource: 'MOBWEB',
        role: info.internalRole,
      },
    };
    return api
      .post(queries.asmAsiTrackRequest, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        dispatch(sliceActions.setASMTrackRequestData(data?.response));
        navigate(ROUTE.WEB.PURCHASE_ORDER_ASM_DURAION);
        return data;
      })
      .catch((error) => {
        dispatch(commonActions.setErrorMessage(error.message));
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
 * dispatch(doGetPOSMAssetDetails({ exampleParam: 'exampleValue' }));
 */
export const trackRequestMeterialASM =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(sliceActions.setDealerMob(params?.purchaseOrderEVDForm));
    dispatch(uiActions.setModalLoader());
    const requestInput = {
      input: {
        dataEvdId: null,
        dataMobileNumber: info?.mdn,
        parentUserName: info?.userId,
        parentUserRole: info?.internalRole,
        userName: params?.purchaseOrderMaterialFormASM,
        formName: FORMS.purchaseOrderTrackPOSM,
        formName2: FORMS.productDetailsPO,
      },
    };
    return api
      .post(queries.DoGetPOSMOrderDetailsWeb, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(sliceActions.setDetailsColumn(data?.tableColumns2));
        dispatch(sliceActions.setPosmDetails(data?.response?.orderDetails));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: data?.response?.orderDetails }));
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        navigate(ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_ASM_POSM);
      })
      .catch((error) => dispatch(commonActions.setErrorMessage(error.message)));
  };

export const asmTrackRequestDetails =
  (params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const { dealerMob, asmTrackRequestData } = getState().purchaseOrder;
    dispatch(uiActions.hideBottomModal());
    dispatch(uiActions.setLoader());
    dispatch(sliceActions.setDuration(params?.requestedDate));
    dispatch(sliceActions.setStatus(params?.requestedType));
    dispatch(sliceActions.setDuration(params?.requestedDate));
    dispatch(sliceActions.setStatus(params?.requestedType));
    const requestInput = {
      input: {
        distributorMdn: asmTrackRequestData?.[0]?.distributor_ph_num,
        fosOrDealerMdn: dealerMob,
        mobSource: null,
        role: info?.internalRole,
        rowNum: params?.requestedDate?.id,
        statusSelect: params?.requestedType?.id || STRINGS.ALL,
        formName: FORMS.purchaseOrderTrackDetailsASM,
      },
    };
    return api
      .post(queries.DistributorTrackRequestDetails, requestInput)
      .then((response) => {
        dispatch(uiActions.clearLoader());
        const data = refactorResponse(response);
        const updatedData = data?.response?.distributorTrackDetailsForFosAndDealer.map((item: ParentObject) => ({
          ...item,
          PRODUCT: data?.response?.distributorTrackDetailsProduct,
          remarks: item.status === 'Approved' || item.status === 'Pending' ? 'NA' : item.remarks,
          paymentType: item?.paymentType?.replace(/_/g, ' '),
        }));
        dispatch(sliceActions.setDistributorTrackRequestDetails(updatedData));
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(commonAction.setTableColumnData({ tableColumns: data?.tableColumns, result: updatedData }));
        navigate(ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_ASM);
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.clearLoader());
        dispatch(uiActions.hideBottomModal());
        dispatch(uiActions.showErrorPage(error.message));
      });
  };
