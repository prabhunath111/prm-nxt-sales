/**
 * This component will be used for showing call button and  subscriber details in the recharge winback
 *
 * @module components/CallSubscriberCard
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Button from 'components/sales/Button';
import { ALIGNMENT, ICONS, PROPERTIES, QUERY, ROUTE } from 'const';
import { Sizing } from 'styles';
import TextContainer from 'components/sales/TextContainer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { callAction, openDialer } from 'utils/formBuilderHelper';
import actions from 'store/sales/actions';
import formActions from 'store/sales/actions/form';
import { ParentObject } from 'store/sales/types/common';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './CallSubscriberCard.styles';

/**
 * Component type definitions
 *
 * @typedef {object} CallSubscriberCardProps
 * @property {string} [label] - The label of  the button.
 */
export type CallSubscriberCardProps = {
  label?: string;
};

/**
 * Represents a CallSubscriberCard component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered CallSubscriberCard component
 *
 * @example
 * <CallSubscriberCard text="Hello World!" />
 */

const CallSubscriberCard = ({ label }: CallSubscriberCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriberDetails } = useSelector((state: RootState) => state.rechargeWinback);
  const { accountInformation } = useSelector((state: RootState) => state.accountInformation);
  const [customerDetails, setCustomerDetails] = useState<ParentObject>({});
  const { inflection } = useInflection();
  const subID = subscriberDetails?.data?.subscriberId;

  const payload = {
    subscriberInfo: subID,
  };

  useEffect(() => {
    if (subID) {
      dispatch(callAction(payload, QUERY.AccountInformation)).then((res: ParentObject) => {
        if (res.status) {
          dispatch(actions.setSubscribeRmn(res?.data?.customerRMN));
        }
      });
    }
  }, []);

  useEffect(() => {
    const details = {
      subscriberId: subscriberDetails?.data?.subscriberId,
      mobileNumber: accountInformation?.maskedRMN,
      subscriberName: accountInformation?.customerName,
      status: accountInformation?.customerStatus,
      curBalance: accountInformation?.balance,
      validity: accountInformation?.rechargeDueDate,
    };

    setCustomerDetails(details);
    dispatch(formActions.setDealerDetails({ subscriberId: subscriberDetails?.data?.subscriberId, customerName: accountInformation?.customerName }));
    dispatch(formActions.setUpdatedFormFields({ monthlyRecharge: accountInformation?.monthlyRecharge }));
  }, [accountInformation]);

  const callSubscriber = () => {
    dispatch(callAction({ subID: subscriberDetails?.data?.subscriberId, mobile: accountInformation?.customerRMN }, QUERY.GetUniqueKwlrtyToken)).then((res: ParentObject) => {
      if (res?.status) {
        const primaryDialingNo = res?.data?.result?.dialingNo;
        openDialer(primaryDialingNo);
        if (ROUTE.WEB.RECHARGE_WIN_BACK_OFFERS) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.rechargeWinback.Winback_SelectSubid.moduleName, {
            [MoengageMixpanelModules.rechargeWinback.Winback_CallSubscriber.attributes.Status]: true,
            [MoengageMixpanelModules.rechargeWinback.Winback_CallSubscriber.attributes.mobileNumber]: accountInformation?.maskedRMN,
            [MoengageMixpanelModules.rechargeWinback.Winback_CallSubscriber.attributes.subscriberId]: subscriberDetails?.data?.subscriberId,
          });
        }
      }
    });
  };

  return (
    <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
      <TextContainer
        itemContainerStyle={styles.textWrapper}
        primaryStyle={[styles.primaryText, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
        secondaryStyle={styles.secondaryText}
        data={customerDetails}
        dataArray={PROPERTIES.RECHARGE_WINBACK.CALL_SUBSCRIBER_DETAILS}
        hasSepratorBottom
        bottomSepratorGap={Sizing.layout.x1}
      />
      <Button
        onPress={() => callSubscriber()}
        iconPosition={ALIGNMENT.LEFT}
        style={styles.buttonStyle}
        iconName={ICONS.TELEPHONE}
        iconHeight={Sizing.layout.x2}
        iconWidth={Sizing.layout.x2}
        label={label}
        labelStyle={styles.buttonLabelStyle}
      />
    </View>
  );
};

export default CallSubscriberCard;
