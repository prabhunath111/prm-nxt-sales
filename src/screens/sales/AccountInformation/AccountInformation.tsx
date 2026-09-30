/**
 * In this component account information will be shown
 *
 * @module components/AccountInformation
 * @memberof - View Component
 */
import React, { memo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/accountInformation';
import formAction from 'store/sales/actions/form';
import { Button, Card, Image, Text, InformationText, FormHeader } from 'components/sales';
import { Colors, Sizing, Typography } from 'styles';
import { ICONS, ROUTE, STYLES, ACCOUNT_INFO, CONNECTION_TYPE, FORMS, STATE_KEY, SUBSCRIBER_STATUS, PROPERTIES } from 'const';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { ParentObject } from 'store/sales/types/common';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { isValidMobile } from 'utils/formBuilderHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './AccountInformation.styles';

interface BoxDetail {
  connectionType: string;
  connectionTypeNT: string;
  boxType: string;
  vcNumber: string;
  connectionStatus: string;
  secondaryPack: string;
  secondaryPackList: string[];
}

/**
 * Represents a AccountInformation component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const AccountInformation = () => {
  const { formNavigationData } = useSelector((state: RootState) => state.form[STATE_KEY.FORM_STATE]);
  const { accountInformation, lastFiveRecharge, requestParams } = useSelector((state: RootState) => state.accountInformation);
  const { info } = useSelector((state: RootState) => state.user);
  const [showRechargeHistory, setShowRechargeHistory] = useState(false);
  const { inflection } = useInflection();

  const dispatch = useDispatch<AppDispatch>();
  const { navigate, goBack } = useNavigate();
  const { t } = useTranslation();

  const BackHandler = () => {
    if (formNavigationData?.routeName) {
      navigate(formNavigationData?.routeName);
      dispatch(actions.resetAccountInformation());
      dispatch(formAction.resetNavigationData());
    } else {
      goBack();
    }
  };

  const showAllRecharges = () => {
    if (lastFiveRecharge.length === 0 && !showRechargeHistory) {
      dispatch(actions.getLastFiveRecharge({ subscriberId: accountInformation.subId }))?.then((response: ParentObject) => {
        if (response?.status) setShowRechargeHistory(true);
      });
    }
  };
  const goToRechargeScreen = () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerInformation.CustomerInformationRecharge.moduleName, {
      Status: true,
    });
    dispatch(formAction.setFormDependentDefault({ subscriberInfo: accountInformation?.subId }));
    navigate(ROUTE.WEB.CUSTOMER_RECHARGE);
    dispatch(actions.resetAccountInformation());
    dispatch(formAction.resetNavigationData());
  };

  // Mapping object for subscriber statuses to icons
  const subscriberStatusIconMap: Record<string, string> = {
    [SUBSCRIBER_STATUS.ACTIVE]: ICONS.SUBSCRIBER_ACTIVE,
    [SUBSCRIBER_STATUS.INACTIVE]: ICONS.SUBSCRIBER_INACTIVE,
    [SUBSCRIBER_STATUS.CANCEL_PENDING]: ICONS.SUBSCRIBER_CANCEL_PENDING,
    [SUBSCRIBER_STATUS.CANCELLED]: ICONS.SUBSCRIBER_CANCEL,
    [SUBSCRIBER_STATUS.PENDING]: ICONS.SUBSCRIBER_PENDING,
    [SUBSCRIBER_STATUS.DEACTIVATED]: ICONS.SUBSCRIBER_DEACTIVATED,
    [SUBSCRIBER_STATUS.SUSPENDED]: ICONS.SUBSCRIBER_SUSPENDED,
    [SUBSCRIBER_STATUS.TEMP_SUSPENSION]: ICONS.SUBSCRIBER_TEMP_SUSPENSION,
  };

  // Fallback icon in case the status doesn't match any key
  const defaultIcon = ICONS.SUBSCRIBER_ACTIVE;

  const iconToDisplay = subscriberStatusIconMap[accountInformation?.customerStatusNT] || defaultIcon;

  const searchByMobileAndDigiCard = requestParams?.subId === undefined || isValidMobile(requestParams?.subscriberInfo) || requestParams?.subscriberInfo.length === 12;

  return (
    <View testID="AccountInformation" style={styles.container}>
      <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>
        <FormHeader formName={FORMS.customerInformation as FormNameKeys} />
      </View>
      <ScrollView contentContainerStyle={styles.commonContainer}>
        <View style={[styles.commonContainer, styles[gcs('commonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Card cardStyle={[styles.commonCardContainer, styles[gcs('commonCardContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <View style={styles.customerInfoContainer}>
              <View style={styles.imageContainer}>
                <Image iconName={iconToDisplay} height={Sizing.layout.x110} width={Sizing.layout.x110} isDimension={false} />
              </View>
              <View style={styles.rechargeContainer}>
                <View style={styles.borderBottom}>
                  <InformationText
                    primaryText={ACCOUNT_INFO.customerName}
                    secondaryText={accountInformation?.customerName}
                    primaryStyle={styles.primaryText}
                    secondaryStyle={styles.secondaryText}
                    containerStyle={styles.textContainer}
                  />
                </View>
                <View>
                  {searchByMobileAndDigiCard ? (
                    <InformationText
                      primaryText={ACCOUNT_INFO.subscriberID}
                      secondaryText={accountInformation?.subId}
                      primaryStyle={styles.primaryText}
                      secondaryStyle={styles.secondaryText}
                      containerStyle={styles.textContainer}
                    />
                  ) : (
                    <InformationText
                      primaryText={ACCOUNT_INFO.subscriberMobileNumber}
                      secondaryText={accountInformation?.maskedRMN}
                      primaryStyle={styles.primaryText}
                      secondaryStyle={styles.secondaryText}
                      containerStyle={styles.textContainer}
                    />
                  )}
                </View>
              </View>
            </View>
          </Card>
          <Card cardStyle={[styles.commonCardContainer, styles[gcs('commonCardContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <View style={styles.customerInfoContainer}>
              <View style={[styles.rechargeContainer, styles.borderRight, styles[gcs('borderRight', inflection, true, ['md', 'lg', 'xl'])]]}>
                <View style={styles.borderBottom}>
                  <InformationText
                    primaryText={ACCOUNT_INFO.currentBalance}
                    secondaryText={accountInformation?.balance}
                    primaryStyle={styles.primaryText}
                    secondaryStyle={styles.secondaryText}
                    containerStyle={styles.textContainer}
                  />
                </View>
                <View>
                  <InformationText
                    primaryText={ACCOUNT_INFO.rechargeDueDate}
                    secondaryText={accountInformation?.rechargeDueDate}
                    primaryStyle={styles.primaryText}
                    secondaryStyle={styles.secondaryText}
                    containerStyle={styles.textContainer}
                  />
                </View>
              </View>
              <View style={[styles.rechargeContainer]}>
                <View style={styles.borderBottom}>
                  <InformationText
                    primaryText={ACCOUNT_INFO.recommendedMonthlyRecharge}
                    secondaryText={accountInformation?.monthlyRecharge}
                    primaryStyle={styles.primaryText}
                    secondaryStyle={styles.secondaryText}
                    containerStyle={styles.textContainer}
                  />
                </View>
                <View>
                  <InformationText
                    primaryText={ACCOUNT_INFO.basePackEndDate}
                    secondaryText={accountInformation?.endDateBasePack}
                    primaryStyle={styles.primaryText}
                    secondaryStyle={styles.secondaryText}
                    containerStyle={styles.textContainer}
                  />
                </View>
              </View>
            </View>
          </Card>
        </View>
        {/* Dhamaka Locking customer */}
        <Card cardStyle={styles.dhamakaCardContainer}>
          <View style={styles.dhamakaLockingInfoContainer}>
            <InformationText
              primaryText={PROPERTIES.CUSTOMER_INFORMATION.DHAMAKA_LOCK_IN}
              secondaryText={accountInformation.isDhamakaEligible ? t('modal.yes') : t('modal.no')}
              primaryStyle={styles.primaryText}
              secondaryStyle={styles.secondaryText}
              containerStyle={styles.textContainer}
            />
          </View>
        </Card>

        {/* box details info */}
        {accountInformation?.boxDetails
          ?.slice()
          .sort((a: BoxDetail, b: BoxDetail) => a.connectionTypeNT.localeCompare(b.connectionTypeNT))
          .map((boxData: BoxDetail) => (
            <Card cardStyle={styles.cardContainer}>
              <View style={styles.customerInfoContainer}>
                <View style={[styles.rechargeContainer, styles.borderRight]}>
                  <InformationText
                    primaryText={ACCOUNT_INFO.connectionType}
                    secondaryText={boxData?.connectionType}
                    primaryStyle={styles.primaryText}
                    secondaryStyle={styles.secondaryText}
                    containerStyle={styles.textContainer}
                  />
                </View>
                <View style={[styles.rechargeContainer]}>
                  <InformationText
                    primaryText={ACCOUNT_INFO.boxType}
                    secondaryText={boxData?.boxType}
                    primaryStyle={styles.primaryText}
                    secondaryStyle={styles.secondaryText}
                    containerStyle={styles.textContainer}
                  />
                </View>
                <View style={[styles.rechargeContainer, styles.borderLeft]}>
                  <InformationText
                    primaryText={ACCOUNT_INFO.connectionStatus}
                    secondaryText={boxData?.connectionStatus}
                    primaryStyle={styles.primaryText}
                    secondaryStyle={styles.secondaryText}
                    containerStyle={styles.textContainer}
                  />
                </View>
              </View>
              <View style={styles.alignSelfStart}>
                <Text style={styles.primaryText}>{t('strings.packages')}</Text>
                <View style={styles.alignItemStart}>
                  {boxData?.connectionTypeNT === CONNECTION_TYPE.PRIMARY
                    ? accountInformation?.packageInfo?.map((val: string) => (
                        <Text key={val} style={[styles.secondaryText, styles.packageText]}>
                          {val}
                        </Text>
                      ))
                    : boxData?.secondaryPackList?.map((val: string) => (
                        <Text key={val} style={[styles.secondaryText, styles.packageText]}>
                          {val}
                        </Text>
                      ))}
                </View>
              </View>
              {accountInformation?.packageInfoBinge?.length > 0 ? (
                <View style={styles.alignSelfStartMargin}>
                  <Text style={styles.primaryTextLarge}>{t('strings.bingePackages')}</Text>
                  <View style={styles.alignItemStart}>
                    {accountInformation?.packageInfoBinge?.map((val: string) => (
                      <Text key={val} style={[styles.secondaryText, styles.packageText]}>
                        {val}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : null}
            </Card>
          ))}

        <View style={[styles.bottomContainer, styles[gcs('bottomContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Card cardStyle={[styles.commonCardContainer, styles[gcs('commonCardContainer', inflection, true, ['md', 'lg', 'xl'])]]} childrenStyle={styles.lastRechargeContainer}>
            <View>
              <Text style={styles.primaryText}>{t('strings.lastFiveRecharges')}</Text>
              <View style={styles.subIdTextContainer}>
                <Text style={styles.primaryText}>
                  {t('strings.subscriberId')}: <Text style={[styles.primaryText, styles.subIdText]}>{accountInformation?.subId}</Text>
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              {![PROPERTIES.ROLES.asi, PROPERTIES.ROLES.csm, PROPERTIES.ROLES.employee].includes(info?.internalRole) && (
                <Button
                  onPress={() => {
                    goToRechargeScreen();
                  }}
                  label={t('strings.recharge')}
                  style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                  type={STYLES.TYPE.PRIMARY}
                  fontSize={Typography.fontSize.x16.fontSize}
                />
              )}
              <Button
                onPress={() => {
                  showAllRecharges();
                }}
                label={t('strings.view')}
                style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                type={STYLES.TYPE.SECONDARY}
                fontColor={Colors.primary.brand}
                fontSize={Typography.fontSize.x16.fontSize}
                outline
              />
            </View>
          </Card>
        </View>
        {lastFiveRecharge.length > 0 && showRechargeHistory && (
          <Card cardStyle={[styles.cardContainer, styles[gcs('cardContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <View style={styles.customerInfoContainer}>
              <View style={[styles.rechargeContainer, styles.borderRight]}>
                <Text style={styles.primaryText}>{t('strings.rechargeAmount')}</Text>
                {lastFiveRecharge?.map((val: ParentObject) => <Text style={styles.secondaryText}>{val?.amount}</Text>)}
              </View>
              <View style={[styles.rechargeContainer]}>
                <Text style={styles.primaryText}>{t('strings.rechargeDate')}</Text>
                {lastFiveRecharge?.map((val: ParentObject) => <Text style={styles.secondaryText}>{val?.transDate}</Text>)}
              </View>
            </View>
          </Card>
        )}
        <View style={styles.backButton}>
          <Button style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]} onPress={() => BackHandler()} label={t('strings.back')} />
        </View>
      </ScrollView>
    </View>
  );
};

export default memo(AccountInformation);
