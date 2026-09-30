/**
 * Evd raise request screen for purchase order
 *
 * @module components/EvdRaiseRequest
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { BalanceContainer, Button, Checkbox, Dropdown, IconTextInput, InformationText, PillsGroup, Tabs, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { Colors, Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { ALERT, ICONS, MODAL, PROPERTIES, QUERY, ROUTE, STRINGS, STYLE_VARIANT } from 'const';
import { LOG } from 'config/logger';
import RazorpayCheckout from 'react-native-razorpay';
import uiActions from 'store/sales/actions/ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import { sliceActions } from 'store/sales/reducer/purchaseOrder';
import styles from './EvdRaiseRequest.styles';

/**
 * EVD Online Component
 */
const EvdOnline = memo(
  ({
    amount,
    commissionAmount,
    purchaseAmount,
    finalAmount,
    balance,
    error,
    onInputChange,
    onPillPress,
    t,
  }: {
    amount: string;
    commissionAmount: string;
    purchaseAmount: string;
    finalAmount: string;
    balance: string;
    error: string;
    onInputChange: (text: string) => void;
    onPillPress: (text: string) => void;
    t: any;
  }) => (
    <View style={styles.componentContainer}>
      <BalanceContainer balance={balance} />
      <Text label={t('strings.enterEvdAndEarnCommision')} style={[styles.labelTextStyle]} />
      <Text label={t('strings.evdPurchaseAmount')} style={styles.itemTextStyle} required />
      <IconTextInput
        value={String(amount)}
        placeholder={t('strings.enterAmount')}
        onInputChange={onInputChange}
        error={error}
        isNumericKeyboard
        isNumericValue
        maxValue={Sizing.x5}
        maxLength={Sizing.x5}
        leftIconName={ICONS.RUPEE_SYMBOL}
        leftIconStyle={styles.leftIconStyle}
        containerStyle={styles.containerInputTextStyle}
      />
      <PillsGroup itemsArr={PROPERTIES.PURCHASE_ORDER.PILLS_GROUP_ARRAY} onPillPress={onPillPress} selectedPillText={amount} />
      <View style={styles.amountContainer}>
        <InformationText
          primaryText={t('strings.purchaseAmount')}
          secondaryText={`₹ ${purchaseAmount || '0'}.0`}
          containerStyle={styles.textContainerStyle}
          primaryStyle={styles.primaryText}
          secondaryStyle={styles.primaryText}
        />
        <InformationText
          primaryText={t('strings.commissionEarned')}
          secondaryText={`₹ ${commissionAmount || '0'}.0`}
          containerStyle={styles.textContainerStyle}
          primaryStyle={styles.primaryText}
          secondaryStyle={styles.primaryText}
        />
        <View style={styles.horizontalSeprator} />
        <InformationText
          primaryText={t('strings.totalEVDAmountWithCommission')}
          secondaryText={`₹ ${finalAmount || '0'}.0`}
          containerStyle={styles.textContainerStyle}
          primaryStyle={styles.secondaryText}
          secondaryStyle={styles.secondaryText}
        />
      </View>
    </View>
  ),
);

/**
 * EVD Request Component
 */
const EvdRequest = memo(
  ({
    amount,
    balance,
    error,
    checkBox,
    setCheckBox,
    onInputChange,
    onPillPress,
    t,
    paymentData,
    selectedPartner,
    setSelectedPartner,
  }: {
    amount: string;
    balance: string;
    error: string;
    checkBox: boolean;
    setCheckBox: (text: boolean) => void;
    onInputChange: (text: string) => void;
    onPillPress: (text: string) => void;
    t: any;
    paymentData: ParentObject[];
    selectedPartner: any;
    setSelectedPartner: any;
  }) => (
    <View style={styles.componentContainer}>
      <BalanceContainer balance={balance} />
      <Text label={t('strings.evdPurchaseAmountRequest')} style={styles.itemTextStyle} required />
      <IconTextInput
        value={amount}
        placeholder={t('strings.enterAmount')}
        onInputChange={onInputChange}
        error={error}
        isNumericKeyboard
        isNumericValue
        maxValue={Sizing.x5}
        maxLength={Sizing.x6}
        leftIconName={ICONS.RUPEE_SYMBOL}
        leftIconStyle={styles.leftIconStyle}
        containerStyle={styles.containerInputTextStyle}
      />
      <PillsGroup itemsArr={PROPERTIES.PURCHASE_ORDER.PILLS_GROUP_ARRAY} onPillPress={onPillPress} selectedPillText={amount} />
      <View style={styles.labelDropDownContainer}>
        <Text style={styles.dropdownTextStyle}>{t('strings.preferredWalletOption')}</Text>
        <Dropdown
          placeholder={t(`strings.selectPaymentOption`)}
          placeholderTextColor={Colors.violet.v200}
          innerContainerStyle={styles.innerDropDown}
          data={paymentData}
          selectedValue={selectedPartner}
          onSelect={(val: { name: string; value: string }) => setSelectedPartner(val)}
          iconStyle={styles.dropdowniconStyle}
        />
        {selectedPartner &&
          (selectedPartner?.paymentTypeNT === STRINGS.BANK ? (
            <>
              <Text style={styles.dropdownTextStyle}>{`${t('strings.bankAccountNo')}: ${selectedPartner?.paymentIdNT}`}</Text>
              <Text style={styles.dropdownTextStyle}>{`${t('strings.enterIfscCode')}: ${selectedPartner?.ifscNoNT}`}</Text>
              <Text style={styles.dropdownTextStyle}>{`${t('strings.accountHolderName')}: ${selectedPartner?.userName}`}</Text>
            </>
          ) : (
            <Text style={styles.dropdownTextStyle}>{`${t('strings.PaymentIDPO')} ${selectedPartner?.paymentIdNT}`}</Text>
          ))}
        <View>
          <Checkbox label={t('strings.pODisclaimer')} required value={checkBox} onValueChange={setCheckBox} />
        </View>
      </View>
    </View>
  ),
);

/**
 * Represents a EvdRaiseRequest component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const EvdRaiseRequest = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const { goBack, navigate } = useNavigate();
  const [amount, setAmount] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [finalAmount, setFinalAmount] = useState('');
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState();
  const [commissionAmount, setCommissionAmount] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { info } = useSelector((state: RootState) => state.user);
  const [selectedPartner, setSelectedPartner] = useState<{ name: string; value: string }>();

  const { balanceEnquiryData, paymentTypesData } = useSelector((state: RootState) => state.purchaseOrder);

  LOG.info(selectedTab);

  useEffect(() => {
    setAmount('');
    setError('');
    setCommissionAmount('');
    setFinalAmount('');
    setSelectedPartner(undefined);
  }, [selectedTab]);

  const sendRequestForEvd = () => {
    if (!error && amount && selectedTab === 0) {
      const payload = { userName: info?.mdn, orderAmount: purchaseAmount, dealerId: info?.userId, comAmount: finalAmount };
      dispatch(callAction({ ...payload }, QUERY.GetOrderId))
        ?.then((response: ParentObject) => {
          if (response?.status) {
            const orderDetails = response?.data?.response;
            const options = {
              key: orderDetails?.apiKey,
              amount: Number(finalAmount) * 100,
              currency: 'INR',
              name: 'Tata Play Ltd.',
              description: `Transaction ID: ${orderDetails?.evdTransId}`,
              image: 'https://cdn.razorpay.com/logos/J5IpO31JRgr5Ei_medium.png',
              order_id: orderDetails?.orderId,
              handler(res: ParentObject) {
                dispatch(sliceActions.setOrderSucessMessage(t('strings.evdSuccess')));
                dispatch(callAction({ response: res, status: STRINGS.SUCCESS }, QUERY.StoreStatus));
              },
              notes: {
                transactor: orderDetails?.distId,
                transactee: orderDetails?.dealerId,
                TxnId: orderDetails?.evdTransId,
                orderId: orderDetails?.orderId,
                transferId: orderDetails?.transferId,
                amount: orderDetails?.comAmount,
              },
              readonly: {
                contact: true,
                email: true,
                name: true,
              },
              retry: {
                enabled: false,
                max_count: 0,
              },
              checkout: {
                hidden: {
                  email: true,
                  contact: true,
                },
              },
            };
            RazorpayCheckout.open(
              options,
              (data) => {
                dispatch(sliceActions.setOrderSucessMessage(t('strings.evdSuccess')));
                dispatch(callAction({ response: data, status: STRINGS.SUCCESS }, QUERY.StoreStatus));
              },
              (err: ParentObject) => {
                dispatch(callAction({ response: { description: err?.error?.description, reason: err?.error?.reason }, status: STRINGS.FAILURE }, QUERY.StoreStatus));
              },
            );
          }
        })
        .catch((res: ParentObject) => {
          dispatch(uiActions.showErrorPage(res.message));
        });
    } else if (selectedTab === 0 && !amount) {
      dispatch(uiActions.showAlert(`${t('strings.pleaseEnterPurchaseAmount')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
      setError(`${t('strings.pleaseEnterPurchaseAmount')}`);
      LOG.info(selectedTab);
    } else if (!error && selectedTab === 1) {
      if (!selectedPartner) {
        dispatch(uiActions.showAlert(`${t('errors.selectPaymentOption')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
        return;
      }
      if (!checkBox) {
        dispatch(uiActions.showAlert(`${t('errors.selectTermsCondition')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
        return;
      }
      if (!amount) {
        dispatch(uiActions.showAlert(`${t('errors.validTransferAmount')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
        return;
      }
      dispatch(callAction({ selectedPartner, amount }, QUERY.DealerBalanceRequest)).then((response: ParentObject) => {
        if (response) {
          dispatch(sliceActions.setOrderSucessMessage(t('strings.evdSuccess')));
          navigate(ROUTE.WEB.EVD_RAISE_REQUEST_SUCCESS);
        }
      });
    }
  };

  const handleInputChangeOnline = (text: string) => {
    const val = text.trim();
    if (!/^\d*$/.test(val)) return;
    setError('');
    setAmount(text);
    if (!val) {
      setError('');
      setFinalAmount('');
      setPurchaseAmount('');
      setCommissionAmount('');
      return;
    }
    const num = parseInt(val, 10);
    const threshold = balanceEnquiryData?.instantThreshold;
    if (num % 100 !== 0) {
      setError(t('errors.multiplesOf100'));
      return;
    }

    if (num < threshold[0]) {
      setError(t('errors.minAmount', { min: threshold[0] }));
      return;
    }

    if (num > threshold[1]) {
      setError(t('errors.maxAmount', { max: threshold[1] }));
      return;
    }

    setError('');
    setPurchaseAmount(`${num}`);
    const commission = Math.round(num * (threshold[2] / 10)) / 10;
    setCommissionAmount(`${commission}`);
    setFinalAmount(`${num + commission}`);
  };

  const handleInputChange = (text: string) => {
    const val = text.trim();
    if (!/^\d*$/.test(val)) return;
    setError('');
    setAmount(text);
    if (!val) {
      setError('');
    }
    const num = parseInt(val, 10);
    const threshold = balanceEnquiryData?.instantThreshold;
    if (num < threshold[0]) {
      setError(t('errors.minAmount', { min: threshold[0] }));
      return;
    }
  };

  const handlePillsPressOnline = (text: string) => {
    setError('');
    setAmount(text);
    setPurchaseAmount(text);
    const num = parseInt(text, 10);
    const threshold = balanceEnquiryData?.instantThreshold;
    const commission = Math.round(num * (threshold[2] / 10)) / 10;
    setCommissionAmount(`${commission}`);
    setFinalAmount(`${Number(text) + commission}`);
  };

  const handlePillsPress = (text: string) => {
    setError('');
    setFinalAmount(text);
    setAmount(text);
  };

  const tabs = [
    {
      key: '0',
      title: t('strings.evdOnline'),
      component: (
        <EvdOnline
          amount={amount}
          purchaseAmount={purchaseAmount}
          commissionAmount={commissionAmount}
          finalAmount={finalAmount}
          error={error}
          balance={balanceEnquiryData?.currentBalance}
          onInputChange={handleInputChangeOnline}
          onPillPress={handlePillsPressOnline}
          t={t}
        />
      ),
    },
    {
      key: '1',
      title: t('strings.evdRequest'),
      component: (
        <EvdRequest
          amount={amount}
          balance={balanceEnquiryData?.currentBalance}
          error={error}
          checkBox={checkBox}
          setCheckBox={setCheckBox}
          onInputChange={handleInputChange}
          onPillPress={handlePillsPress}
          t={t}
          paymentData={paymentTypesData?.paymentId}
          selectedPartner={selectedPartner}
          setSelectedPartner={setSelectedPartner}
        />
      ),
    },
  ];

  return (
    <View style={styles.flex}>
      <View style={[styles.partnerScreen, styles[gcs('partnerScreen', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Tabs tabs={tabs} styleVariant={STYLE_VARIANT.P4} setSelectedTab={setSelectedTab} isScroll />
      </View>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          type="primary"
          fontSize={Sizing.layout.x16}
          label={t('strings.sendRequest')}
          isDimension={false}
          onPress={sendRequestForEvd}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
        <Button
          type="secondary"
          outline
          fontSize={Sizing.layout.x16}
          label={t('strings.back')}
          isDimension={false}
          onPress={goBack}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(EvdRaiseRequest);
