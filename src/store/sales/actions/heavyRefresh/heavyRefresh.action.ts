/**
 * reducer for heavy refresh action
 *
 * @module store/actions/heavyRefresh
 *
 */
import { AppThunk } from 'store';
import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query/heavyRefresh';
import { refactorResponse } from 'utils/responseHelper';
import { ALERT, MODAL } from 'const';
import { LOG } from 'config/logger';
import { ParentObject } from 'store/sales/types/common';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/*
 * request to do heavy refresh to the server.
 * @param {any} params - The parameters for sending form request data.
 * @param {string} queryName - The name of the query.
 * @returns {AppThunk} A thunk action.
 */
export const doHeavyRefresh =
  (params: ParentObject, queryName: string): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestInput = {
      input: {
        subscriberInfo: params.subscriberInfo,
      },
    };

    return api
      .post(queries[queryName], requestInput)
      .then((response) => {
        const data = refactorResponse(response);
        const subscriberId = data?.subscriberId || params.subscriberInfo;
        if (data?.accountInfo?.subIdList) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.HeavyRefresh.multiSid.moduleName, { Status: true });
          dispatch(formActions.setSubIdList(data.accountInfo.subIdList));
        } else {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.HeavyRefresh.proceed.moduleName, {
            Status: true,
            [MoengageMixpanelModules.HeavyRefresh.proceed.attributes.Subscriber_SID]: subscriberId,
          });
          dispatch(uiActions.showAlert(data.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));
          dispatch(formActions.setSubIdListDefault());
        }
        return data;
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        LOG.info(error);
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };
