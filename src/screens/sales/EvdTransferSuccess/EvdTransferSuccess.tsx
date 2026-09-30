/**
 * Success screen that comes after any evd transfer is done.
 *
 * @module components/EvdTransferSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { BalanceContainer, Button, CommonSuccess, Image, InformationText, Link, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { ICONS, PROPERTIES, ROUTE, STATE_KEY, STYLES, VALUE_TYPE } from 'const';
import { Sizing } from 'styles';
import { formatValue } from 'utils/responseHelper';
import useNavigate from 'hooks/useNavigate';
import formAction from 'store/sales/actions/form';
import { gcs } from 'styles/webBreakpoints';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import styles from './EvdTransferSuccess.styles';

/**
 * Represents a EvdTransferSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const EvdTransferSuccess = () => {
  const { inflection } = useInflection();
  const { evdTransferSuccessData } = useSelector((state: RootState) => state.evdTransfer);
  const { isRedirection, info } = useSelector((state: RootState) => state.user);
  const { formNavigationData } = useSelector((state: RootState) => state.form[STATE_KEY.FORM_STATE]);
  const { t } = useTranslation();
  const { navigate, goHome } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isForwardTransfer = formNavigationData.params.transferType === PROPERTIES.EVD_TRANSFER.forwardTransfer;
  const isAsmTransfer = formNavigationData.params.transferType === PROPERTIES.EVD_TRANSFER.asmTransfer;
  const handleLinkPress = () => {
    navigate(ROUTE.WEB.EVD_TRANSFER);
    dispatch(formAction.setNavigationData({ transferType: PROPERTIES.EVD_TRANSFER.reverseTransfer }, '', '', ''));
  };
  const handleNavigation = () => {
    navigate(ROUTE.WEB.EVD_TRANSFER);
    dispatch(formAction.setNavigationData({ transferType: formNavigationData.params.transferType }, '', '', ''));
  };

  const restrictedRoles = [PROPERTIES.ROLES.fos, PROPERTIES.ROLES.asi, PROPERTIES.ROLES.csm];
  const isRestricted = isForwardTransfer && !restrictedRoles.includes(info?.internalRole);

  // Function that returns JSX conditionally based on dealerId
  const DealerId = ({ dealerId }: { dealerId: string }) =>
    dealerId ? (
      <>
        <InformationText primaryText="id" secondaryText={dealerId} primaryStyle={styles.smallPrimaryText} secondaryStyle={styles.mediumTextStyle} />
        <View style={styles.verticalSeparator} />
      </>
    ) : null; // Return null if dealerId is falsy
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainerStyle}>
        <CommonSuccess primaryText={evdTransferSuccessData.subMessage} hasDefaultHeader />
        {inflection === BreakPoints.SM || inflection === BreakPoints.XS ? (
          <View style={styles[gcs('transectionContainer', inflection, true, ['md', 'lg', 'xl'])]}>
            <Text style={styles.transectionStyle} label={t('strings.transactionID')} />
            <Text style={styles.transectionStyle} label={evdTransferSuccessData.transactionId} />
          </View>
        ) : (
          <InformationText
            containerStyle={styles.transectionContainer}
            primaryText={PROPERTIES.EVD_TRANSFER.transactionID}
            secondaryText={evdTransferSuccessData.transactionId}
            primaryStyle={styles.transectionStyle}
            secondaryStyle={styles.transectionStyle}
          />
        )}
        {!isAsmTransfer ? <BalanceContainer balance={evdTransferSuccessData?.newBalance} /> : null}
        <View style={[styles.balanceContainer, styles.partnerContainer]}>
          <View style={styles.partnerNameContainer}>
            <Text style={styles.smallTextStyle} label={isAsmTransfer ? t('strings.dealerDetails') : t('strings.partnerNameId')} />
            {isAsmTransfer ? (
              <View style={styles.rowContainer}>
                <InformationText
                  primaryText="name"
                  secondaryText={evdTransferSuccessData.partnerName}
                  primaryStyle={styles.smallPrimaryText}
                  secondaryStyle={styles.mediumTextStyle}
                />
                <View style={styles.verticalSeparator} />
                <DealerId dealerId={evdTransferSuccessData?.dealerId} />
                <InformationText
                  primaryText="mdn"
                  secondaryText={evdTransferSuccessData.partnerMdn}
                  primaryStyle={styles.smallPrimaryText}
                  secondaryStyle={styles.mediumTextStyle}
                />
              </View>
            ) : (
              <View style={styles.rowContainer}>
                <Text style={styles.mediumTextStyle} label={evdTransferSuccessData.partnerName} />
                <View style={styles.verticalSeparator} />
                <Text style={styles.regularTextStyle} label={evdTransferSuccessData.partnerMdn} />
              </View>
            )}
          </View>
          <View style={styles.horizontalSeparator} />
          <View style={styles.partnerDetailContainer}>
            <View style={styles.partnerNameContainer}>
              <Text style={styles.smallTextStyle} label={isForwardTransfer ? t('strings.amountTransferred') : t('strings.amountReverseTransferred')} />
              <Text style={styles.mediumTextStyle} label={formatValue(VALUE_TYPE.AMOUNT, evdTransferSuccessData.amountTransfer)} />
            </View>
            {isRestricted ? <Link label={t('strings.reverseTransfer')} labelStyle={styles.linkStyle} onPress={handleLinkPress} /> : null}
          </View>
        </View>
        <Pressable onPress={handleNavigation} style={styles.navigationContainer}>
          {isAsmTransfer ? (
            <Text style={styles.navigationTextStyle} label={t('strings.dealerReverseTransfer')} />
          ) : (
            <Text style={styles.navigationTextStyle} label={isForwardTransfer ? t('strings.partnerForwardTransfer') : t('strings.partnerReverseTransfer')} />
          )}
          <View style={styles.iconContainer}>
            <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronIconStyle} isDimension={false} />
          </View>
        </Pressable>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          iconName={ICONS.HOME}
          iconHeight={Sizing.layout.x15}
          iconWidth={Sizing.layout.x15}
          fontSize={Sizing.layout.x14}
          isDimension={false}
          iconPosition={STYLES.POSITION.LEFT}
          label={t('strings.backToHome')}
          onPress={() => goHome(isRedirection)}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(EvdTransferSuccess);
