import uiActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { api } from 'services/apolloClient';
import { sliceActions } from 'store/sales/reducer/utility';
import {
  getAllForms,
  getAllPath,
  getAllRoles,
  getAllFormsAndRoles,
  getAllNavigationPathAndRoles,
  getAllPathAndRoles,
  createNavigation,
  createForm,
  deleteForm,
  deleteMenu,
  createFormRoleMapping,
  removeFormRoleMapping,
  createNavigationRoleMapping,
  removeNavigationRoleMapping,
  handleEngValidation,
} from './utility.action';

jest.mock('store/sales/reducer/utility', () => ({
  sliceActions: {
    handleEngValidation: jest.fn(),
  },
}));

jest.mock('store/sales/actions/ui', () => ({
  __esModule: true,
  default: {
    showAlert: jest.fn(),
    setLoader: jest.fn(),
    clearLoader: jest.fn(),
  },
}));

jest.mock('store/sales/actions/form', () => ({
  __esModule: true,
  default: {
    resetOptionData: jest.fn(),
    setMultipleDropdownOptionsData: jest.fn(),
  },
}));

jest.mock('config/logger', () => ({
  LOG: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('services/apolloClient', () => ({
  api: {
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
  },
}));

jest.mock('utils/responseHelper', () => ({
  refactorResponse: jest.fn((response) => response),
  getCommaSeparatedIds: jest.fn(() => '1,2'),
}));

jest.mock('const', () => ({
  STRINGS: { SOMETHING_WENT_WRONG: 'WRONG', ERROR_OCCURED_WHILE_FETCHING_DATA: 'ERROR' },
  ALERT: { ERROR: 'ERROR', SUCCESS: 'SUCCESS' },
  MODAL: { OK: 'OK' },
  STATE_KEY: { FORM_STATE: 'form', MODAL_STATE: 'modal' },
  CHILD_TYPE: { DYNAMIC_FORM: 'DYNAMIC_FORM' },
  HEADER_TITLE: { CONFIGURE: 'CONFIGURE' },
  FORMS: { filterTsraInventory: 'filterTsraInventory', woRecreation: 'woRecreation' },
  ICONS: { WORK_ORDER: 'WORK_ORDER' },
  QUERY: {
    GET_ALL_FORMS: 'GET_ALL_FORMS',
    GET_ALL_PATH: 'GET_ALL_PATH',
    GET_ALL_ROLES: 'GET_ALL_ROLES',
  },
}));

jest.mock('store/sales/query', () => ({
  __esModule: true,
  default: new Proxy({}, { get: (_target, prop) => prop }),
}));

const flushPromises = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 10);
  });

describe('utility actions', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockImplementation(() => Promise.resolve({}));
    (api.get as jest.Mock).mockImplementation(() => Promise.resolve({}));
    getState = jest.fn();
    dispatch = jest.fn((action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, undefined);
      }
      return action;
    });
  });

  test('getAllForms success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    await getAllForms()(dispatch, getState, undefined);
    expect(formActions.resetOptionData).toHaveBeenCalled();
  });

  test('getAllForms failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getAllForms()(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getAllPath success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    await getAllPath()(dispatch, getState, undefined);
    expect(formActions.resetOptionData).toHaveBeenCalled();
  });

  test('getAllPath failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getAllPath()(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getAllRoles success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ status: true });
    await getAllRoles()(dispatch, getState, undefined);
    expect(formActions.resetOptionData).toHaveBeenCalled();
  });

  test('getAllRoles failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getAllRoles()(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getAllFormsAndRoles success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ getAllRoles: [], getAllForms: [] });
    await getAllFormsAndRoles()(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('getAllFormsAndRoles failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getAllFormsAndRoles()(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getAllNavigationPathAndRoles success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ getAllRoles: [], getAllNavigationName: [], getAllPath: [] });
    await getAllNavigationPathAndRoles()(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('getAllNavigationPathAndRoles failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getAllNavigationPathAndRoles()(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('getAllPathAndRoles success', async () => {
    (api.get as jest.Mock).mockResolvedValue({ getAllRoles: [], getAllPath: [] });
    await getAllPathAndRoles()(dispatch, getState, undefined);
    expect(formActions.setMultipleDropdownOptionsData).toHaveBeenCalled();
  });

  test('getAllPathAndRoles failure', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('fail'));
    await getAllPathAndRoles()(dispatch, getState, undefined);
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('createNavigation success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    createNavigation({ input: {}, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('createNavigation failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    createNavigation({ input: {}, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('createForm success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    createForm({ input: {}, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('createForm failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    createForm({ input: {}, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('deleteForm success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    deleteForm({ formName: { id: '1' } } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('deleteForm failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    deleteForm({ formName: { id: '1' } } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('deleteMenu success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    deleteMenu({ navigationPath: { id: '1' } } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('deleteMenu failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    deleteMenu({ navigationPath: { id: '1' } } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('createFormRoleMapping success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    createFormRoleMapping({ formName: { id: '1' }, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('createFormRoleMapping failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    createFormRoleMapping({ formName: { id: '1' }, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('removeFormRoleMapping success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    removeFormRoleMapping({ formName: { id: '1' }, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('removeFormRoleMapping failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    removeFormRoleMapping({ formName: { id: '1' }, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('createNavigationRoleMapping success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    createNavigationRoleMapping({ navigationName: { id: '1' }, path: { id: '1' }, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('createNavigationRoleMapping failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    createNavigationRoleMapping({ navigationName: { id: '1' }, path: { id: '1' }, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('removeNavigationRoleMapping success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ message: 'done' });
    removeNavigationRoleMapping({ navigationPath: { id: '1' }, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('removeNavigationRoleMapping failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('fail'));
    removeNavigationRoleMapping({ navigationPath: { id: '1' }, responsibilities: [] } as any)(dispatch, getState, undefined);
    await flushPromises();
    expect(uiActions.showAlert).toHaveBeenCalled();
  });

  test('handleEngValidation', () => {
    handleEngValidation(true)(dispatch, getState, undefined);
    expect(sliceActions.handleEngValidation).toHaveBeenCalledWith(true);
  });
});
