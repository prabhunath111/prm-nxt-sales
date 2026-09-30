/**
 * This page will dispaly to the user when there is any errors.
 *
 * @module components/ErrorPage
 * @memberof - View Component
 */
import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'components/sales';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { closeWebView } from 'utils/navigationHelper';
import actions from 'store/sales/actions/user';
import uiActions from 'store/sales/actions/ui';
import styles from './ErrorPage.styles';

/**
 * Represents a ErrorPage component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns ErrorPage
 */
const ErrorPage = () => {
  const { t } = useTranslation();
  const { goHome } = useNavigate();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleButtonClick = () => {
    if (isRedirection) {
      closeWebView();
    } else {
      dispatch(actions.doLogout());
      goHome();
    }
  };

  useEffect(() => {
    dispatch(uiActions.exitErrorPage());
    dispatch(uiActions.hideBottomModal());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.errorHeader}>{t('errors.errorHeader')}</Text>
      <Text style={styles.errorText}>{t('errors.queryFetchError')}</Text>
      <Button onPress={handleButtonClick} label={t('strings.goToHome')} style={styles.buttonStyle} />
    </View>
  );
};
export default memo(ErrorPage);
