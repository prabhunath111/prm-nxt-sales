/**
 * in this component user can add new payment id
 *
 * @module components/RegisterNewPaymentId
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { Button, Checkbox, Dropdown, IconTextInput, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { ALERT, MODAL, PROPERTIES, QUERY, ROUTE, STRINGS, STYLES } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { Sizing } from 'styles';
import i18next from 'i18next';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import uiActions from 'store/sales/actions/ui';
import { callAction } from 'utils/formBuilderHelper';
import useNavigate from 'hooks/useNavigate';
import styles from './RegisterNewPaymentId.styles';
/**
 * Component prop types.
 *
 * @typedef {object} RegisterNewPaymentIdProps
 * @property {string} [text] - The text to display inside the component.
 */

type DemoFormData = {
  acNumber: string;
  bankName: string;
  ifscCode: string;
  acHolderName: string;
  upiID: string;
};

/**
 * Represents a RegisterNewPaymentId component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const RegisterNewPaymentId = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isBank, setIsBank] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [ischecked, setIschecked] = useState(false);
  const [selectValue, setSelectValue] = useState({});
  const [dropDownData, setDropDownData] = useState();
  const [formData, setFormData] = useState<DemoFormData>({
    acNumber: '',
    bankName: '',
    ifscCode: '',
    acHolderName: '',
    upiID: '',
  });
  const { paymentTypeArray, isEdit, editableData, walletDetails, fullPaymentType } = useSelector((state: RootState) => state.purchaseOrder);

  useEffect(() => {
    if (!isEdit || !editableData) {
      setDropDownData(paymentTypeArray);
      return;
    }
    const selectedType = fullPaymentType?.find((item: ParentObject) => item?.nameNT === editableData?.paymentTypeNT);

    setSelectValue(selectedType);
    setDropDownData(selectedType);
    if (selectedType) {
      setPaymentType(selectedType?.nameNT);
      setIsBank(selectedType?.nameNT === STRINGS?.BANK);
    }

    setFormData({
      acNumber: selectedType?.nameNT === STRINGS.BANK ? editableData.paymentIdNT : '',
      bankName: editableData.bankNameNT || '',
      ifscCode: editableData.ifscNoNT || '',
      acHolderName: editableData.userNameNT || '',
      upiID: selectedType?.nameNT === STRINGS.BANK ? '' : editableData.paymentIdNT,
    });
  }, [isEdit, editableData, paymentTypeArray]);

  const handelDropDownChange = (value: ParentObject) => {
    setPaymentType(value?.nameNT);
    if (value?.nameNT === STRINGS.BANK) {
      setIsBank(true);
      return;
    }
    setFormData((prev) => ({ ...prev, upiID: '' }));
    setIsBank(false);
  };

  const handleInputChange = (name: keyof DemoFormData, value: string) => {
    const validator = PROPERTIES.PURCHASE_ORDER.VALIDATIONS_PO[name];

    if (validator && !validator(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handelCheck = (value: boolean) => {
    setIschecked(value);
  };

  const handleCancel = () => {
    if (walletDetails.length === 0) {
      navigate(ROUTE.WEB.PURCHASE_ORDER_REQUEST);
      return;
    }
    navigate(ROUTE.WEB.REGISTER_PAYMENT_OPTION);
  };

  const handelSubmit = () => {
    if (paymentType === '') {
      const alertMessage = `${i18next.t('strings.selectWallet')}`;
      dispatch(
        uiActions.showAlert(
          alertMessage,
          ALERT.WARNING,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
          },
          {},
        ),
      );
      return;
    }
    if (!isBank && formData.upiID === '') {
      const alertMessage = `${i18next.t('strings.PaymentID')}`;
      dispatch(
        uiActions.showAlert(
          alertMessage,
          ALERT.WARNING,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
          },
          {},
        ),
      );
      return;
    }
    if (isBank && (formData.acNumber === '' || formData.acHolderName === '' || formData.bankName === '' || formData.ifscCode === '')) {
      const alertMessage = `${i18next.t('strings.bankDetailsAlert')}`;
      dispatch(
        uiActions.showAlert(
          alertMessage,
          ALERT.WARNING,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
          },
          {},
        ),
      );
      return;
    }
    if (!ischecked) {
      const alertMessage = `${i18next.t('strings.acceptTerm')}`;
      dispatch(
        uiActions.showAlert(
          alertMessage,
          ALERT.WARNING,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
          },
          {},
        ),
      );
      return;
    }
    const newPaymentId = isBank ? formData.acNumber : formData.upiID;
    if (editableData.paymentIdNT === newPaymentId) {
      if (editableData.paymentTypeNT === STRINGS.BANK) {
        if (editableData.bankNameNT === formData.bankName && editableData.ifscNoNT === formData.ifscCode && editableData.userNameNT === formData.acHolderName) {
          const alertMessage = i18next.t('strings.modifyErrorBank');
          dispatch(
            uiActions.showAlert(
              alertMessage,
              ALERT.WARNING,
              {
                primaryText: MODAL.OK,
                secondaryText: MODAL.CANCEL,
              },
              {},
            ),
          );
          return;
        }
      } else {
        const alertMessage = i18next.t('strings.medifyError');
        dispatch(
          uiActions.showAlert(
            alertMessage,
            ALERT.WARNING,
            {
              primaryText: MODAL.OK,
              secondaryText: MODAL.CANCEL,
            },
            {},
          ),
        );
        return;
      }
    }
    dispatch(
      callAction(
        {
          oldPaymentId: isEdit ? editableData.paymentIdNT : '',
          paymentAccName: formData?.acHolderName,
          paymentBankName: formData?.bankName,
          paymentIFSC: formData?.ifscCode,
          paymentId: isBank ? formData?.acNumber : formData?.upiID,
          paymentOperation: isEdit ? 'M' : 'I',
          paymentType,
        },
        QUERY.DistributorPaymentIdUpdate,
        '',
        navigate,
      ),
    );
  };
  return (
    <SafeAreaView style={[styles.container]} testID="SelectBox">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <View style={styles.box}>
            <Text fontSize={Sizing.layout.x20}>{isEdit ? t('strings.modifyPaymentID') : t('strings.registerNewPaymentID')}</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.autocompleteContainer}>
                <Text label={t('strings.selectWalletType')} required />
                <Dropdown data={dropDownData} queryParams="searchLocally" onSelect={handelDropDownChange} placeholder={t('strings.selectWalletType')} selectedValue={selectValue} />
              </View>
              {!isBank && (
                <View style={styles.inputGroup}>
                  <Text label={t('strings.enterPaymentID')} required />
                  <IconTextInput value={formData.upiID} maxLength={Sizing.layout.x20} onInputChange={(text) => handleInputChange('upiID', text)} />
                </View>
              )}
              {isBank && (
                <View style={styles.inputGroup}>
                  <Text label={t('strings.enterBankAcNo')} required />
                  <IconTextInput value={formData.acNumber} maxLength={Sizing.layout.x20} onInputChange={(text) => handleInputChange('acNumber', text)} />
                </View>
              )}
              {isBank && (
                <View style={styles.inputGroup}>
                  <Text label={t('strings.enterBankName')} required />
                  <IconTextInput value={formData.bankName} maxLength={Sizing.layout.x50} onInputChange={(text) => handleInputChange('bankName', text)} />
                </View>
              )}
              {isBank && (
                <View style={styles.inputGroup}>
                  <Text label={t('strings.enterIfscCode')} required />
                  <IconTextInput value={formData.ifscCode} maxLength={Sizing.layout.x15} onInputChange={(text) => handleInputChange('ifscCode', text)} />
                </View>
              )}
              {isBank && (
                <View style={styles.inputGroup}>
                  <Text label={t('strings.accountHolderName')} required />
                  <IconTextInput value={formData.acHolderName} maxLength={Sizing.layout.x50} onInputChange={(text) => handleInputChange('acHolderName', text)} />
                </View>
              )}
            </View>
            <View style={styles.termAndCondition}>
              <Checkbox label={t('termAndCondition.AddPaymentId')} onValueChange={(checked) => handelCheck(checked)} />
            </View>
            <View style={styles.buttonContainer}>
              <Button style={styles.button} onPress={handelSubmit} label={isEdit ? t('modal.proceed') : t('strings.add')} fontSize={Sizing.layout.x16} />
              <Button style={styles.button} type={STYLES.TYPE.SECONDARY} outline onPress={handleCancel} label={t('strings.cancel')} fontSize={Sizing.layout.x16} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(RegisterNewPaymentId);
