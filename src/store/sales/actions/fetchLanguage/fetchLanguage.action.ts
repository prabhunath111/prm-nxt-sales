/**
 * fetch list of langauges
 *
 * @module store/sales/actions/fetchLanguage
 *
 */
import { sliceActions } from 'store/sales/reducer/fetchLanguage';
import userActions from 'store/sales/actions/user';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { refactorResponse } from 'utils/responseHelper';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(fetchLanguageAction({ exampleParam: 'exampleValue' }));
 */
export const fetchLanguageAction = (): AppThunk => (dispatch) => {
  api
    .get(queries.fetchLanguage, {})
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(sliceActions.setLanguageData(data.result));
      return data;
    })
    .catch((error) => {
      dispatch(uiActions.showErrorPage(error.message));
    });
};

export const setLanguagePreference =
  (params: string): AppThunk =>
  (dispatch) => {
    const payload = {
      languagePreference: params,
    };
    api
      .get(queries.setLanguagePreference, payload)
      .then((response) => {
        const data = refactorResponse(response);
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
      });
  };

export const getMenus = (): AppThunk => (dispatch) => {
  api
    .get(queries.GetMenus, {})
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(
        userActions.addNavigation({
          menus: data?.menus ?? [],
          routes: data?.routes ?? [],
          dashboard: data?.dashboard ?? [],
        }),
      );
      return { status: true, data };
    })
    .catch((error) => {
      dispatch(uiActions.showErrorPage(error.message));
    });
};
