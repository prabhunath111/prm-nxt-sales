/**
 * This is a common summary screen for all multi tv modules
 *
 * @module components/EtskMultiTvSummary
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { CustomerDetailsCard, Accordion, TextContainer, InformationText, BoxInfoTab, Button, Text } from 'components/sales';
import Tabs from 'components/sales/Tabs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import useNavigate from 'hooks/useNavigate';
import { sliceActions as etskActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as quotationActions } from 'store/sales/reducer/quotation';
import formActions from 'store/sales/actions/form';
import { Colors, Sizing } from 'styles';
import { FORMS, ICONS, PROPERTIES, QUERY, ROUTE, STRINGS, STYLE_VARIANT, STYLES } from 'const';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { ParentObject } from 'store/sales/types/common';
import { installationDetails, rechargeDetails } from 'store/sales/actions/etskRegSchedular/etskRegSchedular.action';
import { callAction } from 'utils/formBuilderHelper';
import { maskMobileNumber } from 'utils/responseHelper';
import { PARTNER_ROLES } from 'const/strings';
import actions from 'store/sales/actions/form';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './EtskMultiTvSummary.styles';

const EtskMultiTvSummary = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { routeName } = useCurrentRoute();
  const { customerDetails } = useSelector((state: RootState) => state.etskRegistration);
  const { multiTvSubID } = useSelector((state: RootState) => state.quotation);
  const { boxSelectedDetails, boxType } = useSelector((state: RootState) => state.etskMultiTv);
  const { isRedirection, info } = useSelector((state: RootState) => state.user);

  const { goHome, replace, navigate } = useNavigate();

  const customerInformationeETSK = {
    name: customerDetails?.customerName,
    primaryMobileNo: maskMobileNumber(customerDetails?.mobileNo),
    emailAddress: customerDetails?.emailAddress || [],
    language: customerDetails?.language,
    sec_lang: customerDetails?.sec_lang || customerDetails?.secondaryLang,
    pincode: customerDetails?.pincode,
    addressLine1: `${customerDetails?.addressLine1} ${customerDetails?.addressLine2 || ''}`,
    state: customerDetails?.state,
    city: customerDetails?.city,
    district: customerDetails?.district,
  };

  const data = boxSelectedDetails;
  const packSum = (data?.packageNameArray || []).reduce((sum: number, pack: ParentObject) => sum + Number(pack.packPrice ?? 0), 0);
  const finalPrice = Math.ceil(Number(data?.multiTVAddBoxsPrice ?? 0) - Number(data.pricePoint ?? 0) / 100 + packSum);
  const totalPrice = Math.ceil(Number(data?.multiTVAddBoxsPrice ?? 0) + packSum);

  const tsk = Math.ceil(Number(boxSelectedDetails.pricePoint ?? 0) / 100);

  const handleFinalSubmit = () => {
    dispatch(etskActions.etskSetFinalPrice(finalPrice.toString()));
    dispatch(etskActions.etskSetEvdPin(''));
    dispatch(etskActions.etskSetPaidPrice('0'));

    const formToDispatch =
      routeName === ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY || routeName === ROUTE.WEB.WO_MULTI_TV_SUMMARY || routeName === ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY
        ? FORMS.multiTvRechargeDetails
        : FORMS.etskMultiTvRechargeDetails;
    if (routeName === ROUTE.WEB.WO_MULTI_TV_SUMMARY) {
      dispatch(actions.setNavigationData({ routeName: ROUTE.WEB.WO_MULTI_TV_SUMMARY, woBoxType: boxType }, '', '', ''));
    }
    if (routeName === ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY) {
      dispatch(actions.setNavigationData({ routeName: ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY, woBoxType: boxType }, '', '', ''));
    }
    if (boxSelectedDetails?.ocsFlag === STRINGS.YES) {
      dispatch(installationDetails());
    } else {
      dispatch(rechargeDetails(formToDispatch));
    }
    return null;
  };

  const handleProceedRegister = () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.moduleName, {
      [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.Status]: true,
    });
    dispatch(quotationActions.quotationsetMultiTVRegistration(true));
    dispatch(formActions.setUpdatedFormFields({ subscriberID: multiTvSubID }));
    navigate(ROUTE.WEB.MULTI_TV_REGISTRATION);
  };

  const handelChangeBox = () => {
    navigate(ROUTE.WEB.QUOTATION_MULTITV_SELECTION);
  };

  const handleSendQuote = () => {
    dispatch(callAction({}, QUERY.multiTVmobileAndEmail));
  };

  const uniquePacksMap = new Map();
  let ncfText;
  let ncf;

  boxSelectedDetails.packageNameArray?.forEach((pack: ParentObject) => {
    const key = pack.packName;
    if (key?.toLowerCase().includes(t('strings.network'))) {
      ncfText = pack.packName;
      ncf = pack.packPrice;
      return;
    }
    if (!uniquePacksMap.has(key)) {
      uniquePacksMap.set(key, pack);
    }
  });

  const boxPriceValue = { old: null, new: boxSelectedDetails?.multiTVAddBoxsPrice || 0 };

  const uniquePacks = Array.from(uniquePacksMap.values());

  const tabs = [
    {
      key: '0',
      title: t('strings.secondaryBox'),
      subTitle: boxType,
      component: (
        <BoxInfoTab
          boxPrice={boxPriceValue}
          tsk={tsk.toString()}
          ncfText={ncfText}
          ncf={ncf ?? boxSelectedDetails?.pricePointLdp ?? '0'}
          packs={uniquePacks || []}
          setIsPackChanged={() => {}}
          isPrimary={false}
          totalPrice={totalPrice.toString()}
          dhamakaText=""
          routeName={routeName}
          discountPrice={finalPrice.toString()}
        />
      ),
    },
  ];

  return (
    <SafeAreaView style={[styles.container]} testID="EtskMultiTvSummary">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <CustomerDetailsCard secondaryStyle={styles.secondaryBookingNumber} primaryStyle={styles.secondaryBookingNumber} />
          <View style={[styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
            <Text style={styles.mediumLeftText}>{t('strings.SUMMARY')}</Text>
            <Accordion
              title={t('strings.customerTOPay')}
              titleColor={Colors.neutral.white}
              accordionStyle={styles.accordionStyle}
              buttonStyle={styles.accordionBox}
              subDetails={`₹${finalPrice}`}
              subDetailsTextStyle={styles.accordionSubText}
              iconStyle={styles.iconWhite}
              isOpenDefault
            >
              <View style={styles.etskContainer}>
                <View>
                  <Text style={styles.cardStyle}>{t('strings.boxPackInfo')}</Text>
                  <View style={styles.tabContainer}>
                    <Tabs tabs={tabs} styleVariant={STYLE_VARIANT.P3} />
                  </View>
                </View>
              </View>
            </Accordion>
            {routeName !== ROUTE.WEB.WO_MULTI_TV_SUMMARY && routeName !== ROUTE.WEB.BOX_TYPE_MULTI_TV_SUMMARY && (
              <Accordion
                title={t('strings.customerInformation')}
                buttonStyle={styles.customerInformationETSK}
                collapseIcon={ICONS.PINK_CHEVRON_UP}
                expandIcon={ICONS.PINK_CHEVRON_DOWN}
                titleColor={Colors.neutral.black}
                listStyle={styles.listStyle}
                isDimension={false}
                iconHeight={Sizing.layout.x18}
                iconWidth={Sizing.layout.x18}
                isOpenDefault
              >
                <View style={styles.etskContainer}>
                  <TextContainer
                    itemContainerStyle={styles.textWrapperManage}
                    primaryStyle={[styles.primaryTextManage, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                    secondaryStyle={styles.secondaryTextManage}
                    data={customerInformationeETSK}
                    dataArray={PROPERTIES.ETSK_REGISTRATION.CUSTOMER_INFORMATION}
                    hasSepratorBottom
                  />
                </View>
              </Accordion>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonInnerContainer, styles[gcs('buttonInnerContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          {routeName !== ROUTE.WEB.QUOTATION_MULTITV_SUMMARY && (
            <InformationText
              containerStyle={styles.textWrapperETSK}
              primaryStyle={[styles.primaryTextYourPack, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
              secondaryStyle={styles.secondaryTextYourPack}
              primaryText={t('strings.REQUIRED_AMOUNT')}
              secondaryText={`₹${finalPrice}`}
            />
          )}
          {routeName === ROUTE.WEB.QUOTATION_MULTITV_SUMMARY ? null : (
            <View style={styles.rowBtnContainer}>
              <Button style={styles.button} onPress={handleFinalSubmit} label={t('strings.proceed')} fontSize={Sizing.layout.x16} />
              {routeName === ROUTE.WEB.MULTI_TV_REGISTRATION_SUMMARY ? null : (
                <Button
                  style={styles.button}
                  fontSize={Sizing.layout.x16}
                  label={t('strings.cancel')}
                  isDimension={false}
                  onPress={() => goHome(isRedirection)}
                  type={STYLES.TYPE.SECONDARY}
                  outline
                />
              )}
            </View>
          )}
          {routeName === ROUTE.WEB.QUOTATION_MULTITV_SUMMARY ? (
            <View style={styles.quotationButton}>
              <View style={styles.summaryButtonContainer}>
                {info?.roleId !== PARTNER_ROLES.CSM && info?.roleId !== PARTNER_ROLES.ASM && info?.roleId !== PARTNER_ROLES.ASI && (
                  <Button style={styles.buttonQuot} onPress={handleProceedRegister} label={t('strings.proceedRegister')} fontSize={Sizing.layout.x16} />
                )}
                <Button style={styles.buttonQuot} fontSize={Sizing.layout.x16} label={t('strings.sendQuote')} onPress={handleSendQuote} />
                <Button style={styles.buttonQuot} fontSize={Sizing.layout.x16} label={t('strings.changeBoxType')} onPress={handelChangeBox} />
                <Button
                  style={styles.buttonQuot}
                  fontSize={Sizing.layout.x16}
                  label={t('strings.cancel')}
                  isDimension={false}
                  onPress={() => replace(ROUTE.WEB.QUOTATION_MULTITV_SELECTION)}
                  type={STYLES.TYPE.SECONDARY}
                  outline
                />
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(EtskMultiTvSummary);
