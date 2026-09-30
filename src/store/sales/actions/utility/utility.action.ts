/**
 * to manage menus and form utility for application
 *
 * @module store/actions/utility
 *
 */
import uiActions from 'store/sales/actions/ui';
import { AppThunk } from 'store';
import { api } from 'services/apolloClient';
import queries from 'store/sales/query';
import formActions from 'store/sales/actions/form';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, MODAL, QUERY } from 'const';
import { LOG } from 'config/logger';
import { getCommaSeparatedIds, refactorResponse } from 'utils/responseHelper';
import { sliceActions } from 'store/sales/reducer/utility';

/**
 * Fetches and processes all forms.
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const getAllForms = (): AppThunk => (dispatch) =>
  api
    .get(queries.getAllForms, {})
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(formActions.resetOptionData(QUERY.GET_ALL_FORMS, data));

      return response;
    })
    .catch((error) => {
      LOG.info(error);
      dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
    });

/**
 * Fetches and processes all navigation paths.
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const getAllPath = (): AppThunk => (dispatch) =>
  api
    .get(queries.getAllPath, {})
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(formActions.resetOptionData(QUERY.GET_ALL_PATH, data));

      return response;
    })
    .catch((error) => {
      LOG.info(error);
      dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
    });

/**
 * Fetches and processes all roles.
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */
export const getAllRoles = (): AppThunk => (dispatch) =>
  api
    .get(queries.getAllRoles, {})
    .then((response) => {
      const data = refactorResponse(response);
      dispatch(formActions.resetOptionData(QUERY.GET_ALL_ROLES, data));

      return response;
    })
    .catch((error) => {
      LOG.info(error);
      dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
    });

/**
 * Fetches and processes all forms and roles.
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const getAllFormsAndRoles = (): AppThunk => (dispatch) =>
  api
    .get(queries.getAllFormsAndRoles, {})
    .then((response) => {
      dispatch(formActions.setMultipleDropdownOptionsData({ getAllRoles: response.getAllRoles, getAllForms: response.getAllForms }));
      return response;
    })
    .catch((error) => {
      LOG.info(error);
      dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
    });

/**
 * Fetches and processes all navigation paths and roles.
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const getAllNavigationPathAndRoles = (): AppThunk => (dispatch) =>
  api
    .get(queries.getAllNavigationPathAndRoles, {})
    .then((response) => {
      dispatch(
        formActions.setMultipleDropdownOptionsData({ getAllRoles: response.getAllRoles, getAllNavigationName: response.getAllNavigationName, getAllPath: response.getAllPath }),
      );
      return response;
    })
    .catch((error) => {
      LOG.info(error);
      dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
    });

/**
 * Fetches and processes all  paths and roles.
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const getAllPathAndRoles = (): AppThunk => (dispatch) =>
  api
    .get(queries.getAllPathAndRoles, {})
    .then((response) => {
      dispatch(formActions.setMultipleDropdownOptionsData({ getAllRoles: response.getAllRoles, getAllPath: response.getAllPath }));
      return response;
    })
    .catch((error) => {
      LOG.info(error);
      dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
    });

/**
 * Creates a new navigation entry.
 *
 * @param {ParentObject} params - The input parameters for navigation creation.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const createNavigation =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: params.input,
      responsibilities: getCommaSeparatedIds(params.responsibilities),
    };
    api
      .post(queries.createNavigation, requestObject)
      .then((response) => {
        dispatch(uiActions.showAlert(response.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));

        return response;
      })
      .catch((error) => {
        LOG.info(error);
        dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Creates a new form.
 *
 * @param {ParentObject} params - The input parameters for form creation.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const createForm =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      input: params.input,
      responsibilities: getCommaSeparatedIds(params.responsibilities),
    };
    api
      .post(queries.createForm, requestObject)
      .then((response) => {
        dispatch(uiActions.showAlert(response.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));

        return response;
      })
      .catch((error) => {
        LOG.info(error);
        dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Deletes a form.
 *
 * @param {ParentObject} params - The input parameters for form deletion.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const deleteForm =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());

    const requestObject = {
      formName: params.formName.id,
    };

    api
      .post(queries.deleteForm, requestObject)
      .then((response) => {
        dispatch(uiActions.showAlert(response.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));
        dispatch(getAllForms());
        return response;
      })
      .catch((error) => {
        LOG.info(error);
        dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Deletes a menu entry.
 *
 * @param {ParentObject} params - The input parameters for menu deletion.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const deleteMenu =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      navigationPath: params.navigationPath.id,
    };
    api
      .post(queries.deleteMenu, requestObject)
      .then((response) => {
        dispatch(uiActions.showAlert(response.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));
        dispatch(getAllPath());

        return response;
      })
      .catch((error) => {
        LOG.info(error);
        dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Creates a mapping between forms and roles.
 *
 * @param {ParentObject} params - The input parameters for form-role mapping.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const createFormRoleMapping =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      formName: params.formName.id,
      responsibilities: getCommaSeparatedIds(params.responsibilities),
    };
    api
      .post(queries.createFormRoleMapping, requestObject)
      .then((response) => {
        dispatch(uiActions.showAlert(response.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));

        return response;
      })
      .catch((error) => {
        LOG.info(error);
        dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Removes a mapping between forms and roles.
 *
 * @param {ParentObject} params - The input parameters for removing form-role mapping.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const removeFormRoleMapping =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      formName: params.formName.id,
      responsibilities: getCommaSeparatedIds(params.responsibilities),
    };
    api
      .post(queries.removeFormRoleMapping, requestObject)
      .then((response) => {
        dispatch(uiActions.showAlert(response.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));

        return response;
      })
      .catch((error) => {
        LOG.info(error);
        dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Creates a mapping between navigation paths and roles.
 *
 * @param {ParentObject} params - The input parameters for navigation-role mapping.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */
export const createNavigationRoleMapping =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      navigationName: params.navigationName.id,
      path: params.path.id,
      responsibilities: getCommaSeparatedIds(params.responsibilities),
    };
    api
      .post(queries.createNavigationRoleMapping, requestObject)
      .then((response) => {
        dispatch(uiActions.showAlert(response.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));

        return response;
      })
      .catch((error) => {
        LOG.info(error);
        dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * Removes a mapping between navigation paths and roles.
 *
 * @param {ParentObject} params - The input parameters for removing navigation-role mapping.
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */

export const removeNavigationRoleMapping =
  (params: ParentObject): AppThunk =>
  (dispatch) => {
    dispatch(uiActions.setLoader());
    const requestObject = {
      navigationPath: params.navigationPath.id,
      responsibilities: getCommaSeparatedIds(params.responsibilities),
    };
    api
      .post(queries.removeNavigationRoleMapping, requestObject)
      .then((response) => {
        dispatch(uiActions.showAlert(response.message, ALERT.SUCCESS, { primaryText: MODAL.OK, clearForm: true }, {}));

        return response;
      })
      .catch((error) => {
        LOG.info(error);
        dispatch(uiActions.showAlert(error.message, ALERT.ERROR, { primaryText: MODAL.OK }, {}));
      })
      .finally(() => dispatch(uiActions.clearLoader()));
  };

/**
 * handle english input validation.
 *
 * @returns {AppThunk} A thunk that dispatches actions based on API response.
 */
export const handleEngValidation =
  (payload: boolean): AppThunk =>
  (dispatch) =>
    dispatch(sliceActions.handleEngValidation(payload));
