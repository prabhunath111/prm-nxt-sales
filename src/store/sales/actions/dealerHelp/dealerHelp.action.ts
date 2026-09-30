import { sliceActions } from 'store/sales/reducer/dealerHelp';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { ParentObject } from 'store/sales/types/common';
import { FORMS, ROUTE } from 'const';
import { refactorResponse } from 'utils/responseHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

export const getMainCategoryBR =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    return api
      .post(queries.getMainCategoryBR, {})
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.DealerHelpRaiseRequest_PageVisit.moduleName, {
          [MoengageMixpanelModules.BingRetailer.DealerHelpRaiseRequest_PageVisit.attributes.Status]: true,
        });
        const input = [
          {
            role: data?.result?.role,
            bposId: data?.result?.bposId,
          },
        ];
        dispatch(sliceActions.setNatureOfRequest(data?.result?.mainCategory));
        dispatch(sliceActions.setTypeOfRequest(data?.result?.subCategory));
        dispatch(sliceActions.setDealerSubArea(data?.result?.data[0]?.SUB_AREA_MAPPING));
        dispatch(sliceActions.setdealerRoleandID(input));

        dispatch(uiActions.clearLoader());
        navigate(ROUTE.WEB.DEALER_RAISE_REQUEST);
        return { status: true };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const getAllSRDetailsForLoginUser =
  (_params: ParentObject, _queryName: string, _stateKey: ParentObject, navigate: (route: string) => void): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        formName: FORMS.dealerHelpTrackTable,
      },
    };
    return api
      .get(queries.getAllSRDetailsForLoginUser, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.DealerHelpTrackRequest_PageVisit.moduleName, {
          [MoengageMixpanelModules.BingRetailer.DealerHelpTrackRequest_PageVisit.attributes.Status]: true,
        });
        dispatch(sliceActions.setTableColumn(data?.tableColumns));
        dispatch(sliceActions.setTableRowData(data?.result));
        dispatch(uiActions.clearLoader());
        navigate(ROUTE.WEB.DEALER_TRACK_REQUEST);
        return { status: true };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const createBRSSRWorkOrder =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());

    const requestInput = {
      input: {
        bposId: params.bposId,
        comment: params.comment,
        dataEvdId: null,
        dataMobileNumber: null,
        dealerID: params.dealerID,
        subArea: params.subArea,
        subscriberId: '',
        userName: params.userName,
        user_Role: params.user_Role,
        woSubType: params.woSubType,
        woType: params.woType,
      },
    };

    return api
      .post(queries.createBRSSRWorkOrder, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.DealerHelpRaiseRequest_Submit.moduleName, {
          [MoengageMixpanelModules.BingRetailer.DealerHelpRaiseRequest_Submit.attributes.Status]: true,
        });
        dispatch(sliceActions.setdealerSuccessData(data?.response));
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const getBposDetailsDirectFromFE = (): AppThunk => (dispatch, getState) => {
  dispatch(uiActions.setLoader());
  const { info } = getState().user;
  const requestInput = {
    input: {
      rmn: info?.mdn,
    },
  };
  return api
    .post(queries.getBposDetailsDirectFromFE, requestInput)
    .then((response) => {
      const data = refactorResponse(response);
      return { status: true, data };
    })
    .catch((error: any) => {
      dispatch(uiActions.showErrorPage(error.message));
      return { status: false };
    })
    .finally(() => dispatch(uiActions.clearLoader()));
};
export const getDashboardBingeRetailerLatest =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    dispatch(sliceActions.setBposData(params));
    const requestInput = {
      input: {
        bposID: params?.bposId,
        dealerID: info?.userId,
        userName: info?.mdn,
        user_Role: params?.newRole,
      },
    };
    return api
      .post(queries.getDashboardBingeRetailerLatest, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setBingeLatestSummary(data?.response));
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
export const bingeDshBoardDtlsFromService =
  (params: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    const { bposData } = getState().dealerHelp;
    const requestInput = {
      input: {
        bposId: bposData?.bposId,
        fromDt: params?.fromDt,
        dealerID: info?.userId,
        UserName: info?.mdn,
        user_Role: bposData?.newRole,
        formName: FORMS.bingeDashboardTable,
      },
    };
    return api
      .post(queries.bingeDshBoardDtlsFromService, requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setBingeTableColumn(data?.tableColumns));
        dispatch(sliceActions.setBingeTableData(data?.response));
        return { status: true, data };
      })
      .catch((error: any) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
