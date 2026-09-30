import uiActions from 'store/sales/actions/ui';
import { store } from 'store';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request, check, RESULTS, openSettings } from 'react-native-permissions';
import { ALERT, MODAL } from 'const';
import { QUERY } from 'const/strings';
import i18next from 'i18next';
import { isiOS, isWeb } from './platformHelper';

export const getGeoLocation = async (): Promise<{ latitude: number; longitude: number } | null | undefined> => {
  if (isWeb || window.webkit?.messageHandlers?.cordova_iab) {
    try {
      return new Promise((resolve) => {
        store.dispatch(uiActions.setLoader());
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            store.dispatch(uiActions.clearLoader());
            resolve({ latitude, longitude });
          },
          () => {
            store.dispatch(uiActions.clearLoader());
            store.dispatch(uiActions.showAlert(`${i18next.t('errors.locationPermissionError')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      });
    } catch (error: any) {
      store.dispatch(uiActions.showAlert(`${i18next.t('errors.locationPermissionError')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
    }
  }
  try {
    const permission = isiOS() ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    let status = await check(permission);

    if (status === RESULTS.DENIED) {
      status = await request(permission);
    }

    if (status === RESULTS.BLOCKED || status === RESULTS.DENIED || status === RESULTS.UNAVAILABLE) {
      store.dispatch(
        uiActions.showAlert(
          `${i18next.t('errors.locationPermissionError')}`,
          ALERT.ERROR,
          {
            primaryText: MODAL.OPEN_SETTINGS,
            secondaryText: MODAL.CANCEL,
            isSecondaryRequire: true,
            queryName: QUERY.OpenSettingsInDevice,
            queryParams: { openSettings },
          },
          { data: {} },
        ),
      );
      return null;
    }
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position: any) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error: any) => {
          store.dispatch(uiActions.showAlert(error, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
          reject(error);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
      );
    });
  } catch (error: any) {
    store.dispatch(
      uiActions.showAlert(
        `${i18next.t('errors.locationPermissionError')}`,
        ALERT.ERROR,
        {
          primaryText: MODAL.OPEN_SETTINGS,
          secondaryText: MODAL.CANCEL,
          isSecondaryRequire: true,
          queryName: QUERY.OpenSettingsInDevice,
          queryParams: { openSettings },
        },
        { data: {} },
      ),
    );
  }
  return null;
};
