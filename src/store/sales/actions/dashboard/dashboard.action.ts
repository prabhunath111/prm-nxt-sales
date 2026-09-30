/**
 * Reducer for dashboard data
 *
 * @module store/actions/dashboard
 *
 */
import { sliceActions } from 'store/sales/reducer/dashboard';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { dashboardType } from 'store/sales/types/dashboard';
import { refactorResponse } from 'utils/responseHelper';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(dashboardAction({ exampleParam: 'exampleValue' }));
 */
export const dashboardAction =
  (params: dashboardType): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.dashboardStart());
    return api
      .get(queries.SAMPLE_QUERY, params)
      .then((response) => {
        const data = refactorResponse(response);
        sliceActions.dashboardSuccess(data);
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)));
  };
