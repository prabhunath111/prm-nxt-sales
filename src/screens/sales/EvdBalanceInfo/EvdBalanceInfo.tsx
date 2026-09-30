/**
 * evd balance information
 *
 * @module components/EvdBalanceInfo
 * @memberof - View Component
 */
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { PROPERTIES, QUERY, STYLE_VARIANT, STYLES } from 'const';
import { useTranslation } from 'react-i18next';
import { Button, Tabs } from 'components/sales';
import { useDispatch, useSelector } from 'react-redux';
import { callAction } from 'utils/formBuilderHelper';
import { AppDispatch, RootState } from 'store';
import { Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { sliceActions as evdBalanceActions } from 'store/sales/reducer/evdBalanceInfo';
import { PARTNER_ROLES, STRINGS } from 'const/strings';
import { usePlatformFocusEffect } from 'hooks/usePlatformFocusEffect';
import styles from './EvdBalanceInfo.styles';
import MyEvdBalance from '../MyEvdBalance';
import FosDealerBalance from '../FosDealerBalance';
/**
 * Represents a EvdBalanceInfo component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const EvdBalanceInfo = () => {
  const { t } = useTranslation();
  const { goHome } = useNavigate();
  const { isRedirection, info } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const roleId = info?.roleId;

  const fetchBalance = useCallback(() => {
    dispatch(callAction({}, QUERY.DoBalanceEnquiryEvd));
    dispatch(evdBalanceActions.setSelcectedDurationId(STRINGS.All));
    dispatch(evdBalanceActions.setSelcectedFilters(STRINGS.NEWEST));
  }, [dispatch]);

  usePlatformFocusEffect(() => {
    fetchBalance();
  }, []);

  const ROLE_BASED_TITLES = () => {
    if (roleId === PARTNER_ROLES.dis) {
      return t('strings.adBalance');
    }
    if (roleId === PARTNER_ROLES.fos) {
      return t('strings.dealerBalance');
    }
    if (roleId === PARTNER_ROLES.ad) {
      return t('strings.fosBalance');
    }
    return '';
  };

  const tabs =
    roleId === PARTNER_ROLES.dealer
      ? [{ key: PROPERTIES.EVD_BALANCE_INFO.myEvdBalance, title: t('strings.myEvdBalance'), component: <MyEvdBalance /> }]
      : [
          { key: PROPERTIES.EVD_BALANCE_INFO.myEvdBalance, title: t('strings.myEvdBalance'), component: <MyEvdBalance /> },
          {
            key: PROPERTIES.EVD_BALANCE_INFO.fosDealerBalance,
            title: ROLE_BASED_TITLES(),
            component: <FosDealerBalance />,
          },
        ];

  return (
    <View style={styles.container}>
      <Tabs tabs={tabs} styleVariant={STYLE_VARIANT.P4} isScroll />
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          fontSize={Sizing.layout.x16}
          label={t('strings.cancel')}
          isDimension={false}
          onPress={() => goHome(isRedirection)}
          type={STYLES.TYPE.SECONDARY}
          outline
        />
      </View>
    </View>
  );
};

export default memo(EvdBalanceInfo);
