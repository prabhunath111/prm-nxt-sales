/**
 * This page contains the logic for the URL Redirection
 *
 * @module components/Redirection
 * @memberof - View Component
 */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'store/sales/actions/redirection';
import formActions from 'store/sales/actions/form';
import accountInformationActions from 'store/sales/actions/accountInformation';
import { CHILD_TYPE, HEADER_TITLE, MODAL, REDIRECTION, STRINGS } from 'const';
import { AppLoader } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { clearUserSessionSelective, setToken } from 'utils/sessionHelper';
import useNavigate from 'hooks/useNavigate';
import uiActions from 'store/sales/actions/ui';
import { sliceActions as userSliceActions } from 'store/sales/reducer/user';
import { changeLanguage } from 'config/i18n';
import { getValidLanguageCode } from 'utils/languageHelper';
import { storageService } from 'services/storageService';
import styles from './Redirection.styles';

export interface ParamState {
  [key: string]: string | number | null;
}

/**
 * Represents a Redirection component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Redirection
 */
const Redirection = () => {
  const [paramState, setParamState] = useState<ParamState | null>(null);

  const [currentRoute, setCurrentRoute] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const { t } = useTranslation();

  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { moduleName, moduleWiseParams, language } = useSelector((state: RootState) => state.redirection);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { navigate } = useNavigate();
  let modalTimeoutId: any = null;
  let navigationTimeoutId: any = null;


  // handle local language change
  useEffect(() => {
    const lng = getValidLanguageCode(language || STRINGS.EN);
    changeLanguage(lng);
    storageService.setItem(STRINGS.APP_LANGUAGE, lng);
  }, [language]);

  useEffect(() => {
    (async () => {
      // Set loader immediately to avoid blank screen during heavy cleanup/validation
      dispatch(uiActions.setLoader(t('alertMessages.loaderDefaultMsg')));
      
      // Always hide any existing modal on load
      dispatch(uiActions.hideBottomModal());
      
      // Real Bottleneck Fix: Replaced heavy doLogout (full storage purge) with surgical session cleanup.
      // Full purge causes synchronous Disk I/O blocks on older Android WebViews, freezing the UI.
      await clearUserSessionSelective(); 
      dispatch(userSliceActions.logout()); 

      // reset account info and form data
      dispatch(formActions.setFormDependentDefault({}));
      dispatch(accountInformationActions.resetAccountInformation());
      dispatch(formActions.resetNavigationData());
      dispatch(formActions.setFormActionDefault({}));
      dispatch(formActions.setSubIdListDefault());

      const params = new URLSearchParams(location.search);
      const token = params.get(STRINGS.TOKEN) || params.get(STRINGS.REDIRECTION_ID) || '';

      if (token) {
        // Now setToken returns a Promise, so we can properly await it
        await setToken({ redirectionToken: token }); 
        const res: any = await dispatch(actions.verifyToken({ token }));
        if (res?.user?.navigation?.dashboard) {
           setCurrentRoute(res.user.navigation.dashboard);
        }
      }
    })();

    return () => {
      clearTimeout(modalTimeoutId);
      clearTimeout(navigationTimeoutId);
    };
  }, []);

  useEffect(() => {
    if (!currentRoute?.length || !moduleName) return; 

    const matchedRoute: any = currentRoute.find((route: any) => route.path === moduleName);

    if (matchedRoute?.isDisable) {
      setShouldRedirect(false);
      dispatch(uiActions.hideBottomModal());
      modalTimeoutId = setTimeout(() => {
        dispatch(
          uiActions.showBottomModal({
            isModalVisible: true,
            type: CHILD_TYPE.LABEl,
            headerTitle: HEADER_TITLE.CONFIRMATION,
            showCloseIcon: true,
            showHeader: false,
            buttonInfo: {
              primaryButtonLabel: MODAL.OK,
              childData: HEADER_TITLE.THIS_MODULE_IS_NOT_APPLICABLE,
              centerLabel: true,
              isRedirection: true,
              closeView: true,
            },
          }),
        );
      }, 500);
    } else {
      setShouldRedirect(true);
    }
  }, [currentRoute, moduleName]);

  useEffect(() => {
    if (moduleName) {
      const paramStateObj: ParamState = {};
      const params: Array<string> = REDIRECTION.PARAMS[moduleName];
      const modPar = moduleWiseParams ? JSON.parse(moduleWiseParams) : {};
      params?.forEach((param) => {
        paramStateObj[param] = modPar[param];
      });
      setParamState(paramStateObj);
    }
  }, [moduleWiseParams, moduleName, currentRoute]);

  useEffect(() => {
    if (!currentRoute?.length) return; 
    if (shouldRedirect && isAuthenticated && paramState && currentRoute?.length) {
      // Removed 200ms delay for snappier redirection
      navigate(`${moduleName}`, paramState);
    }
  }, [shouldRedirect, isAuthenticated, paramState, moduleName, navigate, currentRoute]);

  return (
    <View testID="appLoaderText" style={styles.container}>
      {isAuthenticated && paramState ? null : <AppLoader visible={!isAuthenticated || !paramState} message={t('alertMessages.loaderDefaultMsg')} />}
    </View>
  );
};

export default Redirection;
