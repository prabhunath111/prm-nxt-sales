/**
 * store for home page data
 *
 * @module store/sales/actions/homePage
 *
 */
import { sliceActions } from 'store/sales/reducer/homePage';
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import { homePageType } from 'store/sales/types/homePage';
import { refactorResponse } from 'utils/responseHelper';
import { LOG } from 'config/logger';
import { ParentObject } from 'store/sales/types/common';

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(homePageAction({ exampleParam: 'exampleValue' }));
 */
export const homePageAction =
  (params: homePageType): AppThunk =>
  (dispatch) => {
    dispatch(sliceActions.homePageStart());
    return api
      .get(queries.SAMPLE_QUERY, params)
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.homePageSuccess(data));
        return data;
      })
      .catch((error) => dispatch(uiActions.showErrorPage(error.message)));
  };

/**
 * Represents an asynchronous action to fetch and process data
 *
 * @param {object} params - Parameters for the query
 * @param {string} params.exampleParam - Example parameter to illustrate structure
 * @returns {AppThunk} A thunk that dispatches actions based on API response
 *
 * @example
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const getEvdBalance =
  (queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    const mdn = info?.mdn;

    // If MDN missing → stop here (no API call)
    if (!mdn) {
      LOG.info('MDN not available, skipping EVD balance API');
      return Promise.resolve({ status: false, data: null });
    }

    // Call API only when MDN exists
    return api
      .post(queries[queryName], { input: { mdn: String(mdn) } })
      .then((response) => {
        const data = refactorResponse(response);

        dispatch(sliceActions.setEvdBalance({ evdBalance: data?.partnerBalance }));
        return { status: true, data };
      })
      .catch((error: any) => {
        LOG.info(error);
        return { status: false, data: null };
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
 * dispatch(resetEvdPinAction({ exampleParam: 'exampleValue' }));
 */
export const getFtdData =
  (queryName: string): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    api
      .post(queries[queryName], { input: { userId: String(info?.userId) } })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setFtdData(data));
        return { status: true, data };
      })
      .catch((error: any) => {
        LOG.info(error);
        return { status: false, data: [] };
      });
  };

export const getHomePageData =
  (queryName: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    api
      .post(queries[queryName], { input: { partnerId: String(info?.userId) } })
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setHomePageData(data?.homepageData?.[0]));
        return { status: true, data };
      })
      .catch((error: any) => {
        LOG.info(error);
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, data: [] };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const getTransactionSummary =
  (queryName: string, param: ParentObject): AppThunk =>
  (dispatch, getState) => {
    dispatch(uiActions.setLoader());
    const { info } = getState().user;
    api
      .post(queries[queryName], { input: { ...param, partnerId: String(info?.userId) } })
      .then((response) => {
        const data = refactorResponse(response);

        dispatch(sliceActions.setTransaction(data));
        return { status: true, data };
      })
      .catch((error: any) => {
        LOG.info(error);
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, data: [] };
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

export const getTransactionSummaryWithFilter =
  (queryName: string, param: ParentObject): AppThunk =>
  (dispatch, getState) => {
    const { info } = getState().user;
    api
      .post(queries[queryName], { input: { ...param, partnerId: String(info?.userId) } })
      .then((response) => {
        const data = refactorResponse(response);

        dispatch(sliceActions.setTransactionWithFilter(data));
        return { status: true, data };
      })
      .catch((error: any) => {
        LOG.info(error);
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, data: [] };
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
 * dispatch(getBannerImages({ exampleParam: 'exampleValue' }));
 */

export const getBannerImages =
  (_params: ParentObject): AppThunk =>
  async (dispatch) =>
    api
      .post(queries.getBannerImages, {})
      .then((response) => {
        const data = refactorResponse(response);
        dispatch(sliceActions.setBannerImages(data));
        return { status: true, data };
      })
      .catch((error) => {
        dispatch(uiActions.showErrorPage(error.message));
        return { status: false, error };
      })
      .finally(() => {
        dispatch(uiActions.clearLoader());
      });

export const getRailsData =
  (_params: ParentObject): AppThunk =>
    async (dispatch) =>
      api
        .post(queries.getRailsData, {})
        .then((response) => {
          const data = refactorResponse(response);
          console.log(data);
          dispatch(sliceActions.setRailData((data.result)));
          dispatch(sliceActions.setIsHomeRailVisible(data?.showChannelRail));
          dispatch(sliceActions.setRailFilterLanguages(data.language));
          return { status: true, data };
        })
        .catch((error) => {
          dispatch(uiActions.showErrorPage(error.message));
          return { status: false, error };
        })
        .finally(() => {
          dispatch(uiActions.clearLoader());
        });