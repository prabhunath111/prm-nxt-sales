/**
 * This reducer will have package information and  FAQ
 *
 * @module store/actions/packageInformation
 *
 */
import { sliceActions } from 'store/sales/reducer/packageInformation';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';
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
 * dispatch(getPackageInformation({ exampleParam: 'exampleValue' }));
 */
export const getPackageInformation = (): AppThunk => (dispatch) => {
  dispatch(uiActions.setLoader());
  return api
    .get(queries.PACKAGE_INFORMATION_QUERY, {})
    .then((response) => {
      const data = refactorResponse(response);
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.TrainingModule_PageVisit.moduleName, {
        [MoengageMixpanelModules.BingRetailer.TrainingModule_PageVisit.attributes.Status]: true,
      });
      dispatch(sliceActions.packageInformationSuccess(data));
      return data;
    })
    .catch((error) => dispatch(uiActions.showErrorPage(error.message)))
    .finally(() => dispatch(uiActions.clearLoader()));
};
