/**
 * Partner Approval details screen for the mSales application
 *
 * @module components/PartnerApprovalDetails
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextContainer } from 'components/sales';
import { ICONS, PROPERTIES, QUERY, STYLES } from 'const';
import { Sizing } from 'styles';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { gcs } from 'styles/webBreakpoints';
import { itemType } from 'components/sales/TextContainer';
import { callAction } from 'utils/formBuilderHelper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './PartnerApprovalDetails.styles';

/**
 * Represents a PartnerApprovalDetails component.
 *
 * @component
 * @param {object} props - React properties passed from composition.

 * @returns {JSX.Element} The rendered component.
 */
const PartnerApprovalDetails = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPartner } = useSelector((state: RootState) => state.partnerApproval);
  const [partnerList, setPartnerList] = useState({});
  const partnerData = selectedPartner?.data || selectedPartner;

  const approvePartner = () => {
    dispatch(callAction({ ...partnerData }, QUERY.ApprovalConfirmation));
  };

  const rejectPartner = () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject.moduleName, {
      [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject.attributes.Status]: true,
    });
    dispatch(callAction({ ...partnerData }, QUERY.RejectPartnerApproval));
  };

  useEffect(() => {
    setPartnerList({
      partnerName: partnerData?.partnerName,
      mobileNumber: partnerData?.mobileNumber,
      role: partnerData?.role,
      id: partnerData?.userId,
      createdDate: partnerData?.createdDate,
      outlet: partnerData?.outletType,
      pinCode: partnerData?.pincode,
      distributorName: partnerData?.distributorName,
      distributorId: partnerData?.distributorId,
      distributorMobileNumber: partnerData?.distributorMobileNumber,
      distributorRole: partnerData?.distributorRole,
    });
  }, [selectedPartner, selectedPartner?.data]);

  return (
    <View style={styles.container}>
      <View style={[styles.detailsContainer, styles[gcs('detailsContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Text label={t(`strings.partnerDetails`)} style={styles.headingTextStyle} />
        <View style={styles.cardContainer}>
          <TextContainer
            itemContainerStyle={styles.textWrapper}
            primaryStyle={styles.primaryText}
            secondaryStyle={styles.secondaryText}
            data={partnerList}
            dataArray={PROPERTIES.PARTNER_APPROVAL.PARTNER_ALL_DETAILS as itemType[]}
          />
        </View>
        <Text label={t(`strings.distributorDetail`)} style={styles.headingTextStyle} />
        <View style={styles.cardContainer}>
          <TextContainer
            itemContainerStyle={styles.textWrapper}
            primaryStyle={styles.primaryText}
            secondaryStyle={styles.secondaryText}
            data={partnerList}
            dataArray={PROPERTIES.PARTNER_APPROVAL.DISTRIBUTOR_DETAILS as itemType[]}
          />
        </View>
      </View>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
          label={t('strings.reject')}
          type={STYLES.TYPE.SECONDARY}
          onPress={() => rejectPartner()}
          outline
          fontSize={Sizing.layout.x16}
          iconName={ICONS.CLOSE_VIOLET}
          iconPosition={STYLES.POSITION.LEFT}
          iconHeight={Sizing.layout.x1Dot5}
          iconWidth={Sizing.layout.x1Dot5}
          iconStyle={styles.secondaryIconStyle}
        />
        <Button
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
          label={t('strings.approve')}
          type={STYLES.TYPE.PRIMARY}
          onPress={() => approvePartner()}
          fontSize={Sizing.layout.x16}
          iconName={ICONS.CHECKMARK}
          iconPosition={STYLES.POSITION.LEFT}
          iconHeight={Sizing.layout.x1Dot5}
          iconWidth={Sizing.layout.x1Dot5}
          iconStyle={styles.primaryIconStyle}
        />
      </View>
    </View>
  );
};

export default memo(PartnerApprovalDetails);
