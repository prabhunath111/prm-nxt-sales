/**
 * In this user can add the payment options here
 *
 * @module components/RegisterPaymentOptions
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import uiActions from 'store/sales/actions/ui';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { gcs } from 'styles/webBreakpoints';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { ParentObject } from 'store/sales/types/common';
import { Button, Text } from 'components/sales';
import useNavigate from 'hooks/useNavigate';
import { Sizing } from 'styles';
import { CHILD_TYPE, HEADER_TITLE, MODAL, QUERY, ROUTE, STRINGS, STYLES } from 'const';
import i18next from 'i18next';
import { sliceActions } from 'store/sales/reducer/purchaseOrder';
import styles from './RegisterPaymentOptions.styles';
/**
 * Represents a RegisterPaymentOptions component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const RegisterPaymentOptions = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { walletDetails, paymentTypeArray } = useSelector((state: RootState) => state.purchaseOrder);

  const handleEdit = (item: ParentObject) => {
    dispatch(sliceActions.setEditData(item));
    dispatch(sliceActions.setIsEditable(true));
    navigate(ROUTE.WEB.REGISTER_NEW_PAYMENT_ID);
  };

  const handleDelete = (item: ParentObject) => {
    const [, Name] = item.displayName.split('-');
    const params = {
      oldPaymentId: '',
      paymentAccName: item?.userNameNT,
      paymentBankName: item?.bankNameNT,
      paymentIFSC: item?.ifscNoNT,
      paymentId: item?.paymentIdNT,
      paymentOperation: 'D',
      paymentType: item?.paymentTypeNT,
    };
    let message = '';
    if (item?.paymentTypeNT === STRINGS.BANK) {
      message = i18next.t('strings.paymentIdDeleteBank', { amount: item?.paymentTypeNT });
    } else {
      message = i18next.t('strings.paymentIdDelete', { amount: Name });
    }

    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.LABEl,
        headerTitle: HEADER_TITLE.CONFIRMATION,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          primaryButtonLabel: MODAL.CONFIRM,
          secondaryButtonLabel: MODAL.BACK,
          childData: message,
          queryName: QUERY.DistributorPaymentIdUpdate,
          queryParams: params,
          hasOutline: true,
        },
      }),
    );
  };

  const handleSubmit = () => {
    dispatch(sliceActions.setIsEditable(false));
    dispatch(sliceActions.setEditData({}));
    const walletTypeIds = walletDetails.map((item: ParentObject) => item.paymentTypeNT);
    const filteredPaymentTypes = paymentTypeArray.filter((item: ParentObject) => !walletTypeIds.includes(item?.nameNT));
    let finalPaymentTypes = [...filteredPaymentTypes];

    const isBankPresent = finalPaymentTypes?.some((item: ParentObject) => item?.nameNT === STRINGS.BANK);

    if (finalPaymentTypes?.length === 0 || (finalPaymentTypes?.length > 0 && !isBankPresent)) {
      finalPaymentTypes = [
        ...finalPaymentTypes,
        {
          id: STRINGS.BANK,
          name: t('strings.bank'),
          nameNT: STRINGS.BANK,
          object: {},
        },
      ];
    }

    dispatch(sliceActions.setPaymentType(finalPaymentTypes));
    navigate(ROUTE.WEB.REGISTER_NEW_PAYMENT_ID);
  };
  const handleBack = () => {
    navigate(ROUTE.WEB.PURCHASE_ORDER_REQUEST);
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
          <Text fontSize={Sizing.layout.x20}>{t('strings.registerPaymentId')}</Text>
          {walletDetails?.map((item: ParentObject) => (
            <View key={item.id} style={styles.walletRow}>
              <View style={styles.walletTextContainer}>
                <Text style={styles.displayName}>{item.displayName}</Text>
              </View>

              {/* RIGHT: ACTION BUTTONS */}
              <View style={styles.walletActionContainer}>
                <Button label={t('strings.edit')} onPress={() => handleEdit(item)} fontSize={Sizing.layout.x16} />
                <Button label={t('strings.delete')} onPress={() => handleDelete(item)} fontSize={Sizing.layout.x16} type={STYLES.TYPE.SECONDARY} outline />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          fontSize={Sizing.layout.x16}
          label={t('strings.registerNewPaymentID')}
          isDimension={false}
          onPress={() => handleSubmit()}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
        <Button
          type="secondary"
          outline
          fontSize={Sizing.layout.x16}
          label={t('modal.cancel')}
          isDimension={false}
          onPress={() => handleBack()}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(RegisterPaymentOptions);
