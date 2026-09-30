/**
 * This is the reducer file for LiveNewsTvPage component
 *
 * @module store/sales/actions/liveNewsTvPage
 * 
 */
import { sliceActions } from 'store/sales/reducer/liveNewsTvPage';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { liveNewsTvPageType,metaDataType } from 'store/sales/types/liveNewsTvPage';
import { refactorResponse } from 'utils/responseHelper';
import { LOG } from 'config/logger';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(liveNewsTvPageAction({ exampleParam: 'exampleValue' }));
 */
export const liveNewsTvPageAction =
  (params: liveNewsTvPageType): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.liveNewsTvPageStart());
    return api
      .get(queries.SAMPLE_QUERY, params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.liveNewsTvPageSuccess(data));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)));
  };

export const metaDataAction =
  (queryName: string,params: metaDataType): AppThunk =>
    async (dispatch) =>
      api
        .post(queries[queryName],params)
        .then((response) => {
          const data = refactorResponse(response);
          console.log(data);
          dispatch(sliceActions.SetCurrentMetaData(params));
          dispatch(sliceActions.SetMetaData((data.result.metaDetails)));
          dispatch(sliceActions.SetPlayBackData((data.result.playbackDetails)));
          return { status: true, data };
        })
        .catch((error) => {
          LOG.info(error);
          dispatch(uiActions.showErrorPage(error.message));
          return { status: false, error };
        })
        .finally(() => {
          dispatch(uiActions.clearLoader());
        });
