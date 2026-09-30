import { sliceActions } from 'store/sales/reducer/form';
import { api } from 'services/apolloClient';
import uiActions from 'store/sales/actions/ui';
import { callAction } from 'utils/formBuilderHelper';
import {
  fetchOptionData,
  resetOptionData,
  setMultipleDropdownOptionsData,
  fetchDependentData,
  getFormData,
  clearFormData,
  submitForm,
  setNavigationData,
  setFormDependentDefault,
  fetchTableData,
  processAlertConfirmation,
  fetchAutocompleteData,
  resetNavigationData,
  setFormActionDefault,
  setFormUpdated,
  setUpdatedFormFields,
  setSlabList,
  setSubIdList,
  setSubIdListDefault,
  setFormValues,
  setDealerDetails,
  setChecklistTileDetails,
  setSearchBarItems,
  setOffersBasisRechargeObject,
  setOffersBasisRechargeValue,
  setOffersBasisRechargeValueType,
  setRadioContainerOptions,
  setEvdMdnNavigationData,
  setPillGroupItemsArr,
  resetForm,
  setFieldsToDisable,
  setFieldsToShow,
  resetFormQuery,
  setListData,
} from './form.action';

jest.mock('store/sales/reducer/form', () => ({
  sliceActions: {
    setMultipleDropdownOptionsData: jest.fn(),
    setDropdownOptionsData: jest.fn(),
    setDependentData: jest.fn(),
    setFormData: jest.fn(),
    clearFormData: jest.fn(),
    setNavigationData: jest.fn(),
    setFormDependentDefault: jest.fn(),
    setTableData: jest.fn(),
    setConfirmAlertStatus: jest.fn(),
    setDropdownData: jest.fn(),
    setFormActionData: jest.fn(),
    setFormUpdatedStatus: jest.fn(),
    setUpdatedFormFields: jest.fn(),
    setSlabList: jest.fn(),
    setSubIdList: jest.fn(),
    defaultSubIdList: jest.fn(),
    setFormValues: jest.fn(),
    setDealerDetails: jest.fn(),
    setChecklistTileDetails: jest.fn(),
    setSearchBarItems: jest.fn(),
    setOffersBasisRechargeObject: jest.fn(),
    setOffersBasisRechargeValue: jest.fn(),
    setOffersBasisRechargeValueType: jest.fn(),
    setRadioContainerOptions: jest.fn(),
    setEvdMdnNavigationData: jest.fn(),
    setPillGroupItemsArr: jest.fn(),
    resetForm: jest.fn(),
    setFieldsToDisable: jest.fn(),
    setFieldsToShow: jest.fn(),
    resetFormQuery: jest.fn(),
    setListData: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  setLoader: jest.fn(),
  clearLoader: jest.fn(),
  showErrorPage: jest.fn(),
}));

jest.mock('services/apolloClient', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
}));

jest.mock('utils/formBuilderHelper', () => ({
  callAction: jest.fn(() => () => ({ type: 'CALL_ACTION' })),
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

// eslint-disable-next-line no-promise-executor-return
const flushPromises = () => new Promise((resolve) => resolve(null));

describe('form actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    getState = jest.fn(() => ({ ui: { isLoading: false } }));
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('fetchOptionData success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await fetchOptionData({ query: 'q' }, 'q', 'k')(dispatch, getState, undefined);
    expect(sliceActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('fetchOptionData failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    await fetchOptionData({ query: 'q' }, 'q', 'k')(dispatch, getState, undefined);
    await flushPromises();
    expect(sliceActions.setMultipleDropdownOptionsData).toHaveBeenCalledWith({ data: [], queryName: 'q', stateKey: 'k' });
  });

  test('fetchOptionData no params', async () => {
    await fetchOptionData(null as any, 'q', 'k')(dispatch, getState, undefined);
    expect(api.post).not.toHaveBeenCalled();
  });

  test('resetOptionData', () => {
    resetOptionData('q', [], 'k')(dispatch, getState, undefined);
    expect(sliceActions.setDropdownOptionsData).toHaveBeenCalledWith({ data: [], queryName: 'q', stateKey: 'k' });
  });

  test('setMultipleDropdownOptionsData', () => {
    setMultipleDropdownOptionsData({}, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('fetchDependentData success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    await fetchDependentData({ query: 'q' }, 'q', 'p', 'k')(dispatch, getState, undefined);
    expect(sliceActions.setDependentData).toHaveBeenCalled();
  });

  test('fetchDependentData failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await fetchDependentData({ query: 'q' }, 'q', 'p', 'k')(dispatch, getState, undefined);
    await flushPromises();
    expect(sliceActions.setDependentData).toHaveBeenCalledWith({ data: [], queryName: 'q', dependentField: 'p', stateKey: 'k' });
  });

  test('fetchDependentData no params', async () => {
    await fetchDependentData(null as any, 'q', 'p', 'k')(dispatch, getState, undefined);
    expect(api.get).not.toHaveBeenCalled();
  });

  test('getFormData skip forms', async () => {
    await getFormData({ formName: 'transactionHistory' }, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setFormData).toHaveBeenCalled();
    expect(api.post).not.toHaveBeenCalled();
  });

  test('getFormData api success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ status: true });
    await getFormData({ formName: 'other' }, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setFormData).toHaveBeenCalled();
  });

  test('clearFormData', () => {
    clearFormData(true, 'k')(dispatch, getState, undefined);
    expect(sliceActions.clearFormData).toHaveBeenCalled();
  });

  test('submitForm', () => {
    submitForm({}, 'q', 'k', jest.fn())(dispatch, getState, undefined);
    expect(callAction).toHaveBeenCalled();
  });

  test('setNavigationData', () => {
    setNavigationData({}, 'q', 'f', 'r', 'k')(dispatch, getState, undefined);
    expect(sliceActions.setNavigationData).toHaveBeenCalled();
  });

  test('setFormDependentDefault', () => {
    setFormDependentDefault({}, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setFormDependentDefault).toHaveBeenCalled();
  });

  test('fetchTableData success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    await fetchTableData({}, 'q', 'k')(dispatch, getState, undefined);
    expect(sliceActions.setTableData).toHaveBeenCalled();
  });

  test('fetchTableData failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await fetchTableData({}, 'q', 'k')(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showErrorPage).toHaveBeenCalledWith('fail');
  });

  test('processAlertConfirmation', () => {
    processAlertConfirmation(true, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setConfirmAlertStatus).toHaveBeenCalled();
  });

  test('fetchAutocompleteData success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    await fetchAutocompleteData({ query: 'q' }, 'q', 'k')(dispatch, getState, undefined);
    expect(sliceActions.setDropdownData).toHaveBeenCalled();
  });

  test('resetNavigationData', () => {
    resetNavigationData('k')(dispatch, getState, undefined);
    expect(sliceActions.setNavigationData).toHaveBeenCalled();
  });

  test('setFormActionDefault', () => {
    setFormActionDefault({}, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setFormActionData).toHaveBeenCalled();
  });

  test('setFormUpdated', () => {
    setFormUpdated(true, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setFormUpdatedStatus).toHaveBeenCalledWith({ isFormUpdated: true, stateKey: 'k' });
  });

  test('setUpdatedFormFields', () => {
    setUpdatedFormFields({}, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setUpdatedFormFields).toHaveBeenCalled();
  });

  test('setSlabList', () => {
    setSlabList([], 'k')(dispatch, getState, undefined);
    expect(sliceActions.setSlabList).toHaveBeenCalled();
  });

  test('setSubIdList', () => {
    setSubIdList([], 'k')(dispatch, getState, undefined);
    expect(sliceActions.setSubIdList).toHaveBeenCalled();
  });

  test('setSubIdListDefault', () => {
    setSubIdListDefault('k')(dispatch, getState, undefined);
    expect(sliceActions.defaultSubIdList).toHaveBeenCalled();
  });

  test('setFormValues', () => {
    setFormValues({}, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setFormValues).toHaveBeenCalled();
  });

  test('setDealerDetails', () => {
    setDealerDetails({ mdn: '1' } as any, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setDealerDetails).toHaveBeenCalled();
  });

  test('setChecklistTileDetails', () => {
    setChecklistTileDetails({ checklistData: {} }, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setChecklistTileDetails).toHaveBeenCalled();
  });

  test('setSearchBarItems', () => {
    setSearchBarItems({}, 'q', 'k')(dispatch, getState, undefined);
    expect(sliceActions.setSearchBarItems).toHaveBeenCalled();
  });

  test('setOffersBasisRechargeObject', () => {
    setOffersBasisRechargeObject({})(dispatch, getState, undefined);
    expect(sliceActions.setOffersBasisRechargeObject).toHaveBeenCalled();
  });

  test('setOffersBasisRechargeValue', () => {
    setOffersBasisRechargeValue([])(dispatch, getState, undefined);
    expect(sliceActions.setOffersBasisRechargeValue).toHaveBeenCalled();
  });

  test('setOffersBasisRechargeValueType', () => {
    setOffersBasisRechargeValueType('1')(dispatch, getState, undefined);
    expect(sliceActions.setOffersBasisRechargeValueType).toHaveBeenCalledWith({ offerType: '1' });
  });

  test('setRadioContainerOptions', () => {
    setRadioContainerOptions({}, 'q', 'k')(dispatch, getState, undefined);
    expect(sliceActions.setRadioContainerOptions).toHaveBeenCalled();
  });

  test('setEvdMdnNavigationData', () => {
    setEvdMdnNavigationData({})(dispatch, getState, undefined);
    expect(sliceActions.setEvdMdnNavigationData).toHaveBeenCalled();
  });

  test('setPillGroupItemsArr', () => {
    setPillGroupItemsArr({}, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setPillGroupItemsArr).toHaveBeenCalled();
  });

  test('resetForm', () => {
    resetForm()(dispatch, getState, undefined);
    expect(sliceActions.resetForm).toHaveBeenCalled();
  });

  test('setFieldsToDisable', () => {
    setFieldsToDisable({}, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setFieldsToDisable).toHaveBeenCalled();
  });

  test('setFieldsToShow', () => {
    setFieldsToShow([], 'k')(dispatch, getState, undefined);
    expect(sliceActions.setFieldsToShow).toHaveBeenCalled();
  });

  test('resetFormQuery', () => {
    resetFormQuery('k')(dispatch, getState, undefined);
    expect(sliceActions.resetFormQuery).toHaveBeenCalled();
  });

  test('setListData', () => {
    setListData({}, 'k')(dispatch, getState, undefined);
    expect(sliceActions.setListData).toHaveBeenCalled();
  });
});
