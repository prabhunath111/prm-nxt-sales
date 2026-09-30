/**
 * details for for/dealer balance
 *
 * @module components/FosDealerBalance
 * @memberof - View Component
 */

import React, { memo, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ActionTileCard, Button, IconTextInput, PartnerInfo } from 'components/sales';
import { ICONS, QUERY, ROUTE, STYLES } from 'const';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import evdBalanceInfoActions from 'store/sales/actions/evdBalanceInfo';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { NUMBER_REGEX } from 'const/regexes';
import { sliceActions as evdBalanceActions } from 'store/sales/reducer/evdBalanceInfo';
import { ParentObject } from 'store/sales/types/common';
import { PARTNER_ROLES } from 'const/strings';
import styles from './FosDealerBalance.styles';

/**
 * Represents a FosDealerBalance component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */

const FosDealerBalance = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const [isValidated, setIsValidated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { info } = useSelector((state: RootState) => state.user);
  const inputValue = useSelector((state: RootState) => state.evdBalanceInfo.dealerBalanceInput);
  const roleId = info?.roleId;

  useEffect(() => {
    dispatch(evdBalanceActions.setDealerBalanceInput(''));
  }, []);

  const handleNavigation = () => {
    const params = {
      dealerId: inputValue,
    };
    dispatch(evdBalanceInfoActions.doBalanceEnquiryEvd(params, QUERY.DoBalanceEnquiryEvd)).then((response: ParentObject) => {
      if (response) {
        setIsValidated(true);
      } else {
        setIsValidated(false);
      }
    });
  };

  const handleValidation = (text: string) => {
    const numericText = text.replace(NUMBER_REGEX, '');
    if (numericText.length <= 10) {
      dispatch(evdBalanceActions.setDealerBalanceInput(numericText));
    }
  };
  let placeHolder;
  const ROLE_BASED_TITLES = () => {
    if (roleId === PARTNER_ROLES.fos) {
      placeHolder = t('strings.dealerEVDCode');
      return t('strings.dealerBalance'); // Dealer Balance
    }
    if (roleId === PARTNER_ROLES.ad) {
      placeHolder = t('strings.fosEVDCode');
      return t('strings.fosBalance'); // FOS Balance
    }
    if (roleId === PARTNER_ROLES.dis) {
      placeHolder = t('strings.fosDealerEVDCode');
      return t('strings.adBalance'); // AD/FOS Balance
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cardWrapper, styles.cardContainer]}>
        <Text>{ROLE_BASED_TITLES()}</Text>
        <View style={styles.textContainer}>
          <View style={styles.inputContainer}>
            <IconTextInput
              maxValue={Sizing.x10}
              placeholder={placeHolder}
              value={inputValue}
              onInputChange={handleValidation}
              isNumericKeyboard
              isNumericValue
              containerStyle={styles.containerInputTextStyle}
            />
          </View>
          <Button onPress={handleNavigation} type={STYLES.TYPE.SECONDARY} size={STYLES.SIZE.SM} outline label={t('strings.validate')} fontSize={Sizing.layout.x14} />
        </View>
      </View>

      {isValidated && (
        <>
          <View style={styles.cardContainer}>
            <PartnerInfo />
          </View>
          <View style={styles.cardContainer}>
            <ActionTileCard
              label={t('strings.rechargeTransaction')}
              iconName={ICONS.RECHARGE_TRANSACTION}
              onPress={() => {
                navigate(ROUTE.WEB.RECHARGE_TRANSACTION_FOS);
              }}
            />
          </View>
          <View style={styles.cardContainer}>
            <ActionTileCard
              label={t('strings.otfCreditDetails')}
              iconName={ICONS.OTF_CREDIT_DETAILS}
              onPress={() => {
                navigate(ROUTE.WEB.OTF_CREDIT_DETAILS_FOS);
              }}
            />
          </View>
          <View style={styles.cardContainer}>
            <ActionTileCard
              label={t('strings.balanceTransferDetails')}
              iconName={ICONS.BALANCE_TRANSFER_DETAILS}
              onPress={() => {
                navigate(ROUTE.WEB.BALANCE_TRANSFER_dETAILS_FOS);
              }}
            />
          </View>
          <View style={styles.cardContainer}>
            <ActionTileCard
              label={t('strings.consolidatedTransactions')}
              iconName={ICONS.CONSOLIDATED_TRANSACTIONS}
              onPress={() => {
                navigate(ROUTE.WEB.CONSOLIDATED_TRANSACTION_FOS);
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default memo(FosDealerBalance);
