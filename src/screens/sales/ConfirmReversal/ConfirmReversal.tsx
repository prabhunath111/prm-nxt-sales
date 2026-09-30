/**
 * screen to confirm recharge reversal
 *
 * @module components/ConfirmReversal
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import actions from 'store/sales/actions/transactionHistory';
import uiActions from 'store/sales/actions/ui';
import { Button, Card, TextInput, Text, Dropdown, TextContainer, FormHeader, KeyboardDismissContainer, IconTextInput } from 'components/sales';
import { Colors, Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { useTranslation } from 'react-i18next';
import { STYLES, VALUE_TYPE, PROPERTIES, FIELD_TYPE, ROUTE, FORMS, MODAL, ALERT, ICONS } from 'const';
import { formatValue } from 'utils/responseHelper';
import { fieldValidation } from 'utils/ValidationHelper';
import { DataItem } from 'components/sales/Dropdown';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { calculateDaysDifference } from 'utils/dateHelper';
import { checkFixLength } from 'utils/formBuilderHelper';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { ParentObject } from 'store/sales/types/common';
import styles from './ConfirmReversal.styles';
import useParams from 'hooks/useParams';

/**
 * Represents a ConfirmReversal component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const ConfirmReversal = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const { transactionDetails, transactionHistory, isTransactionDetails, balance, reversalReasons } = useSelector((state: RootState) => state.transactionHistory);
  const { subscriberId, inTransId, chargeableAmount, requestDate } = transactionDetails || {};
  const { navigate, goHome } = useNavigate();
  const { mdn, userId } = useSelector((state: RootState) => state.user.info);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const [reversalReason, setReversalReason] = useState<ParentObject>({ name: t('strings.select'), nameNT: undefined });
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { routeName } = useCurrentRoute();
  const [pinError, setPinError] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [errorMessage] = useState({ pleaseEnter: t('strings.pleaseEnter'), pleaseEnterNumericValue: t('strings.pleaseEnterNumericValue') });

  const { fromScreen } = useParams ();

  const dispatch = useDispatch<AppDispatch>();
  const confirmBalance = () => {
    if (subscriberId) {
      dispatch(actions.fetchReversalInformation({ subscriberId }));
    }
  };

  const confirm = () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.RechargeReversal.RechargeReversalProceed.moduleName, {
      Status: true,
    });
    const [hasError, errorMsg] = fieldValidation(FIELD_TYPE.PIN, pin, errorMessage, true);
    if (reversalReason?.name === t('strings.select')) {
      setReasonError(t('strings.rechargeReversalReason'));
      return;
    }
    if (hasError) {
      setPinError(errorMsg);
      return;
    }
    if (!checkFixLength(pin, 4)) {
      setPinError(t('validations.pinFixLength'));
      return;
    }
    if (routeName === ROUTE.WEB.CONFIRM_REVERSAL_INFO || routeName === ROUTE.WEB.CONFIRM_REVERSAL_INFO_FOS) {
      dispatch(
        actions.doReverseRecharge({
          subscriberId,
          transactionId: inTransId,
          transactionAmount: chargeableAmount,
          reversalReason: reversalReason?.nameNT,
          evdPin: pin,
        }),
      );
      setPin('');
      return;
    }
    const diffDate = calculateDaysDifference(transactionDetails.requestDateNT);
    if (diffDate > transactionDetails.reversalEligibleDaysCount) {
      const alertMessage = t('strings.reversaldayFailureFirst') + transactionDetails.reversalEligibleDaysCount + t('strings.reversaldayFailureSecond');
      dispatch(uiActions.showAlert(alertMessage, ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
    } else if (diffDate <= transactionDetails.reversalEligibleDaysCount) {
      if (parseInt(chargeableAmount, 10) > parseInt(balance, 10)) {
        dispatch(uiActions.showAlert(t(`strings.rechargeReversalAmountGreater`), ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
      } else if (pin && reversalReason?.name) {
        MoengageMixpanel.trackEvent(MoengageMixpanelModules.RechargeReversal.RechargeReversalProceed.moduleName, {
          Status: true,
          [MoengageMixpanelModules.RechargeReversal.RechargeReversalProceed.attributes.Status]: true,
        });
        dispatch(
          actions.doReverseRecharge({
            subscriberId,
            transactionId: inTransId,
            transactionAmount: chargeableAmount,
            reversalReason: reversalReason?.nameNT,
            evdPin: pin,
          }),
        );
        setPin('');
      }
    }
  };

  const handleInputChange = (value: string) => {
    setPin(value);
    setPinError(checkFixLength(value, 4) ? '' : t('validations.pinFixLength'));
  };

  const cancelHandler = () => {
    if (routeName === ROUTE.WEB.CONFIRM_REVERSAL_INFO) {
      navigate(ROUTE.WEB.RECHARGE_TRANSACTION);
    } else if (routeName === ROUTE.WEB.CONFIRM_REVERSAL_INFO_FOS) {
      navigate(ROUTE.WEB.RECHARGE_TRANSACTION_FOS);
    } else if (fromScreen === 'ActivationStatus') {
      goHome (isRedirection);
    } else if (isTransactionDetails || transactionHistory.length === 0) {
      navigate(ROUTE.WEB.RECHARGE_REVERSAL);
      dispatch(actions.resetIsTransactionDetails());
    } else {
      navigate(ROUTE.WEB.TRANSACTION_HISTORY);
    }
  };

  useEffect(
    () => () => {
      dispatch(actions.resetReversalInformation());
    },
    [],
  );

  return (
    <>
      <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>
        <FormHeader formName={FORMS.rechargeReversal as FormNameKeys} />
      </View>
      <KeyboardDismissContainer style={[styles.childContainer, styles[gcs('childContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Card cardStyle={[styles.cardContainer, styles[gcs('cardContainer', inflection, true, ['md', 'lg', 'xl'])]]} childrenStyle={styles.cardContent}>
          <ScrollView style={[styles.container, { overflow: 'scroll' }]} showsVerticalScrollIndicator contentContainerStyle={styles.contentStyles}>
            <TextContainer
              textContainerStyle={[styles.infoContainer, styles[gcs('infoContainer', inflection, true, ['md', 'lg', 'xl'])]]}
              itemContainerStyle={styles.textWrapper}
              primaryStyle={styles.primaryText}
              secondaryStyle={styles.secondaryText}
              data={{ transactionID: inTransId, subscriberID: subscriberId, amount: chargeableAmount, evdId: userId, evdMobileNumber: mdn, dateOfRecharge: requestDate }}
              dataArray={PROPERTIES.RECHARGE_REVERSAL.CONFIRM_REVERSAL}
            />
            <View style={[styles.balanceContainer, styles[gcs('balanceContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              <Text label={t('strings.checkSubBal')} color={Colors.neutral.black} style={[styles.primaryText, styles.textBold]} />
              <TextInput value={subscriberId} disabled inputFieldStyle={styles.inputStyle} />
              <Button onPress={confirmBalance} label={t('strings.confirmBalance')} style={[styles.button, styles[gcs('button', inflection, true, ['md', 'lg', 'xl'])]]} />
              {balance && <Text color={Colors.neutral.black} style={styles.inputLabel} label={formatValue(VALUE_TYPE.AMOUNT, balance)} />}
              {reversalReasons.length > 0 && (
                <View style={styles.dropdownContainer}>
                  <Text label={t('strings.selectReason')} color={Colors.neutral.black} style={[styles.primaryText, styles.textBold]} />
                  <Dropdown
                    data={reversalReasons}
                    selectedValue={reversalReason}
                    onSelect={(item: DataItem) => {
                      setReversalReason({ name: item.name, nameNT: item.nameNT });
                      setReasonError('');
                      MoengageMixpanel.trackEvent(MoengageMixpanelModules.RechargeReversal.RechargeReversalDetails.moduleName, {
                        Status: true,
                        [MoengageMixpanelModules.RechargeReversal.RechargeReversalDetails.attributes.ReversalReason]: item.name,
                        [MoengageMixpanelModules.RechargeReversal.RechargeReversalDetails.attributes.TransactionID]: inTransId,
                        [MoengageMixpanelModules.RechargeReversal.RechargeReversalDetails.attributes.SubscriberID]: subscriberId,
                      });
                    }}
                    innerContainerStyle={styles.dropdownContainerStyle}
                    inputFieldStyle={styles.inputFieldStyle}
                    iconStyle={styles.chevronIconStyle}
                    error={reasonError}
                  />
                </View>
              )}
              <Text label={t('strings.enterPin')} color={Colors.neutral.black} style={styles.inputLabel} />
              <View style={styles.input}>
                <IconTextInput
                  value={String(!showPassword ? '*'.repeat(pin?.length || 0) : pin || '')}
                  placeholder={t('strings.enterHere')}
                  onInputChange={(text: string) => {
                    const isValid = text === '' || /^[0-9*]*$/.test(text?.[text.length - 1]);
                    if (!isValid) {
                      return;
                    }
                    const numericText = text.replace(/[^0-9*]/g, '');
                    if (showPassword) {
                      handleInputChange(numericText);
                    } else if (numericText.length < pin.length) {
                      const temp = pin;
                      const newVal = temp.slice(0, numericText.length);
                      handleInputChange(newVal);
                    } else if (numericText.length - pin.length > 1) {
                      const newVal = pin + numericText.slice(pin.length);
                      handleInputChange(newVal);
                    } else {
                      const added = numericText[numericText.length - 1];
                      const newVal = pin + added;
                      handleInputChange(newVal);
                    }
                  }}
                  isNumericKeyboard
                  maxValue={Sizing.layout.x4}
                  inputFieldStyle={[styles.textInputFieldStyle]}
                  placeholderTextColor={Colors.neutral.g300}
                  error={pinError}
                  rightIconName={showPassword ? ICONS.VISIBLE : ICONS.NON_VISIBLE}
                  onIconPress={() => setShowPassword((prev) => !prev)}
                  containerStyle={styles.containerInputTextStyle}
                />
              </View>
              <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
                {balance && <Button onPress={confirm} label={t('strings.confirm')} style={[styles.button, styles[gcs('button', inflection, true, ['md', 'lg', 'xl'])]]} />}
                <Button
                  onPress={cancelHandler}
                  label={t('strings.cancel')}
                  style={[styles.button, styles[gcs('button', inflection, true, ['md', 'lg', 'xl'])]]}
                  type={STYLES.TYPE.SECONDARY}
                  outline
                />
              </View>
            </View>
          </ScrollView>
        </Card>
      </KeyboardDismissContainer>
    </>
  );
};

export default memo(ConfirmReversal);
