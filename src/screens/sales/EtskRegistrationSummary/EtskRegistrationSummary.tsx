/**
 * adding this screen that shows the summary of channels selected by user
 *
 * @module components/EtskRegistrationSummary
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { PROPERTIES, STYLE_VARIANT, STRINGS, ICONS, ROUTE, QUERY, FORMS, STYLES } from 'const';
import { useTranslation } from 'react-i18next';
import { CustomerDetailsCard, Text } from 'components/sales';
import Tabs from 'components/sales/Tabs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import TextContainer from 'components/sales/TextContainer';
import Accordion from 'components/sales/Accordion';
import InformationText from 'components/sales/InformationText';
import Button from 'components/sales/Button';
import { Colors, Sizing } from 'styles';
import BoxInfoTab from 'components/sales/BoxInfoTab';
import { ParentObject } from 'store/sales/types/common';
import { doGetRentlPackETSK } from 'store/sales/actions/etskRegistration/etskRegistration.action';
import { installationDetails, rechargeDetails } from 'store/sales/actions/etskRegSchedular/etskRegSchedular.action';
import { openEmailMobileModal } from 'store/sales/actions/quotation/quotation.action';
import { sliceActions } from 'store/sales/reducer/etskRegistration';
import { sliceActions as primaryActions } from 'store/sales/reducer/primaryTvRegistration';
import { sliceActions as quoteActions } from 'store/sales/reducer/quotation';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { callAction } from 'utils/formBuilderHelper';
import useNavigate from 'hooks/useNavigate';
import { getScreenWidth } from 'styles/dimentionHelper';
import env from 'config/env';
import { getDhamakaRechargeAmount, getDisabledCategoryMatch, hasDisabledCategory, maskMobileNumber } from 'utils/responseHelper';
import { PARTNER_ROLES } from 'const/strings';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './EtskRegistrationSummary.styles';

const EtskRegistrationSummary = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const [isPackChanged, setIsPackChanged] = useState<boolean>(false);
  const { goBack, replace, navigate } = useNavigate();
  const screenWidth = getScreenWidth();
  const isMobileView = screenWidth <= Sizing.layout.x500;

  const { validatePacksSuccessData, customerDetails, accountCreationSuccessData, primaryBoxPrice, selectedPacksToBuy, packSelected } = useSelector(
    (state: RootState) => state.etskRegistration,
  );
  const { accountDetailsPrimaryAndSecondaryRepush } = useSelector((state: RootState) => state.woRecreation);
  const { tskValidateData } = useSelector((state: RootState) => state.primaryTvRegistration);
  const { errorMessage } = useSelector((state: RootState) => state.common);
  const { info } = useSelector((state: RootState) => state.user);

  const { routeName } = useCurrentRoute();

  const showFlexi = !!validatePacksSuccessData.flexiPackPrice && routeName === ROUTE.WEB.ETSK_REGISTRATION_SUMMARY;

  const showAnnual = !!validatePacksSuccessData.flexiDealerIncentiveAnnual;
  const showSemiAnnual = !!validatePacksSuccessData.flexiDealerIncentiveSemiAnnual;

  const [selectedPlan, setSelectedPlan] = useState(STRINGS.monthly);

  let boxPriceValue: ParentObject;

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
  const packPrice = selectedPacksToBuy.reduce((total: number, pack: ParentObject) => {
    const price = parseFloat(pack?.PackPrice ?? pack?.price ?? 0) || 0;
    return total + price;
  }, 0);

  const [dhamakaText, setDhamakaText] = useState('');
  const calculateTotalPrice = () =>
    Math.ceil(
      Number(primaryBoxPrice) +
        Number(packPrice ?? 0) +
        Number(validatePacksSuccessData?.vcLvlPackDtls?.[0]?.packDtls?.[0]?.productPrice ?? 0) +
        Number(validatePacksSuccessData?.tskValue ?? 0) +
        Number(validatePacksSuccessData?.multiTVAddBoxsPrice1 ?? 0) +
        Number(validatePacksSuccessData?.multiTVAddBoxsPrice2 ?? 0) +
        Number(validatePacksSuccessData?.multiTVAddBoxsPrice3 ?? 0) +
        (Number(validatePacksSuccessData?.noOfConnection ?? 1) - 1) *
          (Number(validatePacksSuccessData?.secondNCFPrice ?? validatePacksSuccessData?.secondaryNCF ?? 0) +
            Number(validatePacksSuccessData?.secondPackPrice ?? validatePacksSuccessData?.secondaryPack ?? 0)),
    );

  const calculateDiscountedPrice = () =>
    calculateTotalPrice() -
    (Number(tskValidateData?.pricePointPrimary ?? 0) / 100 +
      Number(tskValidateData?.pricePointSecondary1 ?? 0) / 100 +
      Number(tskValidateData?.pricePointSecondary2 ?? 0) / 100 +
      Number(tskValidateData?.pricePointSecondary3 ?? 0) / 100);

  const [totalPrice, setTotalPrice] = useState(() => calculateTotalPrice());
  const [finalPrice, setFinalPrice] = useState(() => calculateDiscountedPrice());
  const [flexiPrice, setFlexiPrice] = useState(Number(finalPrice));

  useEffect(() => {
    const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
    const hasMatchedPack = getDisabledCategoryMatch(selectedPacksToBuy, disabledPacks);
    const boxValue = getDhamakaRechargeAmount(packSelected, PROPERTIES.ETSK_REGISTRATION.DHAMAKA_LIST);
    const isDhamaka = validatePacksSuccessData?.dhamakaETSK === STRINGS.DHAMAKA;
    if (boxValue || isDhamaka) {
      const dhamakaRechAmount = validatePacksSuccessData?.dhamakaReqRechAmtETSK;
      const dhamakaPrice = Number(boxValue?.rechargeAmount) * validatePacksSuccessData.noOfConnection;
      setTotalPrice(isDhamaka ? dhamakaRechAmount : dhamakaPrice);
      setFinalPrice(isDhamaka ? dhamakaRechAmount : Number(dhamakaPrice));
      setFlexiPrice(isDhamaka ? dhamakaRechAmount : Number(dhamakaPrice));
      setDhamakaText(isDhamaka ? `* (${validatePacksSuccessData?.offerTypeFromBE})` : `* (${boxValue?.text.replace('{count}', String(validatePacksSuccessData.noOfConnection))})`);
    } else if (hasMatchedPack?.rechargeAmount) {
      setTotalPrice(hasMatchedPack.rechargeAmount);
      setFinalPrice(
        Number(hasMatchedPack.rechargeAmount) -
          (Number(tskValidateData?.pricePointPrimary ?? 0) / 100 +
            Number(tskValidateData?.pricePointSecondary1 ?? 0) / 100 +
            Number(tskValidateData?.pricePointSecondary2 ?? 0) / 100 +
            Number(tskValidateData?.pricePointSecondary3 ?? 0) / 100),
      );
      setDhamakaText(`* (${hasMatchedPack?.category})`);
    } else {
      setDhamakaText('');
      const totalPrice = Math.ceil(
        Number(primaryBoxPrice) +
          Number(packPrice ?? 0) +
          Number(validatePacksSuccessData?.vcLvlPackDtls?.[0]?.packDtls?.[0]?.productPrice ?? 0) +
          Number(validatePacksSuccessData?.tskValue ?? 0) +
          Number(validatePacksSuccessData?.multiTVAddBoxsPrice1 ?? 0) +
          Number(validatePacksSuccessData?.multiTVAddBoxsPrice2 ?? 0) +
          Number(validatePacksSuccessData?.multiTVAddBoxsPrice3 ?? 0) +
          (Number(validatePacksSuccessData?.noOfConnection ?? 1) - 1) *
            (Number(validatePacksSuccessData?.secondNCFPrice ?? validatePacksSuccessData?.secondaryNCF ?? 0) +
              Number(validatePacksSuccessData?.secondPackPrice ?? validatePacksSuccessData?.secondaryPack ?? 0)),
      );

      const discountedPrice =
        totalPrice -
        (Number(tskValidateData?.pricePointPrimary ?? 0) / 100 +
          Number(tskValidateData?.pricePointSecondary1 ?? 0) / 100 +
          Number(tskValidateData?.pricePointSecondary2 ?? 0) / 100 +
          Number(tskValidateData?.pricePointSecondary3 ?? 0) / 100);

      setTotalPrice(totalPrice);
      setFinalPrice(discountedPrice);
      setFlexiPrice(discountedPrice);
    }
  }, [selectedPacksToBuy, validatePacksSuccessData]);

  const dispatchFlexiPlanAndPrice = () => {
    const durationMap = {
      [STRINGS.monthly]: 0,
      [STRINGS.annual]: 12,
      [STRINGS.semi]: 6,
    };
    dispatch(sliceActions.etskSetFlexiPlan(durationMap[selectedPlan] ?? 0));
    dispatch(sliceActions.etskSetFinalPrice(showFlexi ? flexiPrice.toString() : finalPrice.toString()));
  };

  const handleFinalSubmit = () => {
    dispatchFlexiPlanAndPrice();
    dispatch(sliceActions.etskSetEvdPin(''));
    dispatch(sliceActions.etskSetPaidPrice('0'));

    switch (routeName) {
      case ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY:
      case ROUTE.WEB.RE_PUSH_ORDER_SUMMARY:
        if (env.ENABLE_REGISTRATION_SCHEDULER && accountCreationSuccessData?.ocsFlag === STRINGS.YES) {
          dispatch(installationDetails());
        } else {
          dispatch(rechargeDetails(FORMS.primaryRechargeDetails));
        }
        break;

      case ROUTE.WEB.WO_RECREATION_SUMMARY:
        if (isPackChanged) {
          dispatch(callAction({}, QUERY.GetWoRentalPack));
        }
        if (accountDetailsPrimaryAndSecondaryRepush?.ocsFlag === STRINGS.YES) {
          dispatch(installationDetails());
        } else {
          dispatch(callAction({}, QUERY.WoRechargeDetails));
        }
        break;

      case ROUTE.WEB.BOX_TYPE_SUMMARY:
        if (isPackChanged) {
          dispatch(callAction({}, QUERY.getRentalPackBoxType));
        }
        if (accountDetailsPrimaryAndSecondaryRepush?.ocsFlag === STRINGS.YES) {
          dispatch(installationDetails());
        } else {
          dispatch(callAction({}, QUERY.boxTypeRechargeDetails));
        }
        break;

      case ROUTE.WEB.ETSK_REPUSH_SUMMARY:
        if (isPackChanged) {
          dispatch(doGetRentlPackETSK({}, STRINGS.DO_GET_RENTAL_PACKS));
        }
        if (accountCreationSuccessData?.ocsFlag === STRINGS.YES) {
          dispatch(installationDetails());
        } else {
          dispatch(rechargeDetails(FORMS.eTSKRepushRechargeDetails));
        }
        break;

      default:
        if (isPackChanged) {
          dispatch(doGetRentlPackETSK({}, STRINGS.DO_GET_RENTAL_PACKS));
        }
        if (accountCreationSuccessData?.ocsFlag === STRINGS.YES) {
          dispatch(installationDetails());
        } else {
          dispatch(rechargeDetails());
        }
        break;
    }
  };

  const openModalforQuote = () => {
    dispatch(quoteActions.setTotalPrice(totalPrice.toString()));
    if (routeName === ROUTE.WEB.QUOTATION_ETSK_SUMMARY) {
      dispatch(openEmailMobileModal());
    } else {
      dispatch(openEmailMobileModal(FORMS.quotationPrimarySendQuote));
    }
  };
  const moveToETSKRegistration = () => {
    dispatch(quoteActions.quotationEtskSetIsQuotationNavigate(true));
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.moduleName, {
      [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.Status]: true,
      [MoengageMixpanelModules.Quotation.QuoteTypeofRegistrationProceed.attributes.formName]: routeName,
    });
    if (routeName === ROUTE.WEB.QUOTATION_ETSK_SUMMARY) {
      navigate(ROUTE.WEB.ETSK_REGISTRATION);
    } else {
      dispatch(primaryActions.setIsBoxMismatchConfirmed(false));
      navigate(ROUTE.WEB.SECONDARY_TSK_REGISTRATION);
    }
  };

  const chnageBoxType = () => {
    if (routeName === ROUTE.WEB.QUOTATION_ETSK_SUMMARY) {
      navigate(ROUTE.WEB.QUOTATION_ETSK_OFFER);
    } else {
      navigate(ROUTE.WEB.QUOTATION_PRIMARY_OFFER);
    }
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);

    if (plan === STRINGS.annual) {
      const price = (validatePacksSuccessData.flexiPackPriceAnn ?? 0) + (Number(finalPrice) - validatePacksSuccessData.flexiPackPrice);
      setFlexiPrice(price);
    } else if (plan === STRINGS.monthly) {
      setFlexiPrice(Number(finalPrice));
    } else {
      const price = (validatePacksSuccessData.flexiPackPriceSemi ?? 0) + (Number(finalPrice) - validatePacksSuccessData.flexiPackPrice);
      setFlexiPrice(price);
    }
  };

  const getBoxTitle = (index: number, isPrimary: boolean): string => {
    if (isPrimary) return t('strings.primaryBox');
    return `${t('strings.secondaryBox')} ${index}`;
  };

  const tabs = validatePacksSuccessData.noOfConnection
    ? Array.from({ length: validatePacksSuccessData.noOfConnection }, (_, index) => {
        const isPrimary = index === 0;
        const isSummaryRoute =
          routeName === ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY ||
          routeName === ROUTE.WEB.RE_PUSH_ORDER_SUMMARY ||
          routeName === ROUTE.WEB.WO_RECREATION_SUMMARY ||
          routeName === ROUTE.WEB.BOX_TYPE_SUMMARY;

        const indexPlus = isSummaryRoute ? index : index + 1;

        const subTitle = isPrimary ? validatePacksSuccessData?.priBoxType : validatePacksSuccessData[`secondBoxType${indexPlus}`];

        const allPacks = validatePacksSuccessData.multiTvPackList || [];

        const uniquePacksMap = new Map();
        let ncfText;

        allPacks.forEach((pack: ParentObject) => {
          const key = pack.packName;
          if (key?.toLowerCase().includes(t('strings.network'))) {
            ncfText = pack.packName;
            return;
          }
          if (!uniquePacksMap.has(key)) {
            uniquePacksMap.set(key, pack);
          }
        });
        let ncf;
        let tsk;

        const disabledPacks = accountCreationSuccessData?.disableLDPPacks || [];
        const hasMatch = hasDisabledCategory(selectedPacksToBuy, disabledPacks, []);
        if (isPrimary) {
          ncf = validatePacksSuccessData?.vcLvlPackDtls?.[0]?.packDtls?.[0]?.productPrice ?? '0';
          tsk = Math.ceil(Number(tskValidateData?.pricePointPrimary ?? 0) / 100);
        } else if (
          routeName === ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY ||
          routeName === ROUTE.WEB.WO_RECREATION_SUMMARY ||
          routeName === ROUTE.WEB.RE_PUSH_ORDER_SUMMARY ||
          routeName === ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY ||
          routeName === ROUTE.WEB.BOX_TYPE_SUMMARY
        ) {
          ncf = validatePacksSuccessData?.secondaryNCF ?? '0';
          tsk = Math.ceil(Number(tskValidateData?.[`pricePointSecondary${index}`] ?? 0) / 100);
        } else {
          ncf = validatePacksSuccessData?.[index === 1 ? 'secondNCFPrice' : `secondNCFPrice${index}`] ?? '0';
          tsk = Math.ceil(Number(tskValidateData?.[`pricePointSecondary${index}`] ?? 0) / 100);
        }

        const tskValue = Number(validatePacksSuccessData?.tskValue) || 0;
        const multiTVPrice = Number(validatePacksSuccessData?.[`multiTVAddBoxsPrice${index}`]) || 0;
        const primaryBox = Number(primaryBoxPrice) || 0;

        const isDhamaka = validatePacksSuccessData?.dhamakaETSK === STRINGS.DHAMAKA;
        if (hasMatch) {
          boxPriceValue = { old: primaryBox + tskValue, new: 0 };
          dispatch(quoteActions.setBoxPriceFinal(boxPriceValue?.new));
        } else if (isPrimary) {
          boxPriceValue = { old: null, new: isDhamaka ? 0 : primaryBox + tskValue };
          dispatch(quoteActions.setBoxPriceFinal(boxPriceValue?.new));
        } else {
          boxPriceValue = { old: null, new: isDhamaka ? 0 : multiTVPrice };
        }

        const uniquePacks = Array.from(uniquePacksMap.values());

        return {
          key: String(index),
          title: getBoxTitle(index, isPrimary),
          subTitle,
          component: (
            <BoxInfoTab
              boxPrice={boxPriceValue}
              tsk={tsk.toString()}
              ncf={ncf}
              ncfText={isPrimary ? t('strings.productName') : ncfText}
              packs={uniquePacks}
              setIsPackChanged={setIsPackChanged}
              isPrimary={isPrimary}
              routeName={routeName}
              totalPrice={totalPrice.toString()}
              discountPrice={finalPrice.toString()}
              dhamakaText={dhamakaText}
            />
          ),
        };
      })
    : [];

  const data = {
    NoOfConnection: validatePacksSuccessData?.noOfConnection,
    totalPacks: selectedPacksToBuy?.length ?? 0,
    totalChannels: validatePacksSuccessData?.vcLvlPackDtls?.[0]?.packDtls?.[0]?.numberOfChannels,
  };
  return (
    <SafeAreaView style={[styles.container]} testID="EtskRegistrationSummary">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          {routeName !== ROUTE.WEB.QUOTATION_ETSK_SUMMARY && routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY && (
            <CustomerDetailsCard
              secondaryStyle={styles.secondaryBookingNumber}
              primaryStyle={styles.secondaryBookingNumber}
              keysToShow={
                (routeName === ROUTE.WEB.ETSK_REGISTRATION_SUMMARY || routeName === ROUTE.WEB.ETSK_REPUSH_SUMMARY) && !isMobileView
                  ? PROPERTIES.ETSK_REGISTRATION.CUSTOMER_DETAILS_ETSK
                  : undefined
              }
            />
          )}
          <View style={[styles.paddingContainer, styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
            {(routeName === ROUTE.WEB.ETSK_REGISTRATION_SUMMARY || routeName === ROUTE.WEB.ETSK_REPUSH_SUMMARY) && isMobileView ? (
              <View style={styles.etskContainerSummary}>
                <TextContainer
                  itemContainerStyle={styles.textWrapperManageSummary}
                  data={{
                    bookingFormNumber: accountCreationSuccessData.bookingFormNumber,
                  }}
                  dataArray={PROPERTIES.ETSK_REGISTRATION.BOOKING_FORM_NUMBER}
                  hasSepratorBottom
                  secondaryStyle={styles.secondaryBookingNumber}
                  primaryStyle={styles.secondaryBookingNumber}
                />
              </View>
            ) : null}

            <Text style={styles.mediumLeftText}>{t('strings.SUMMARY')}</Text>
            <Accordion
              title={t('strings.customerTOPay')}
              titleColor={Colors.neutral.white}
              accordionStyle={styles.accordionStyle}
              buttonStyle={styles.accordionBox}
              subDetails={`₹${showFlexi ? flexiPrice : finalPrice}`}
              subDetailsTextStyle={styles.accordionSubText}
              iconStyle={styles.iconWhite}
              isOpenDefault
            >
              <View style={styles.etskContainer}>
                <View style={styles.etskCard}>
                  <TextContainer
                    itemContainerStyle={styles.textWrapperETSK}
                    primaryStyle={[styles.primaryTextETSK, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                    secondaryStyle={styles.secondaryTextETSK}
                    data={data}
                    dataArray={PROPERTIES.ETSK_REGISTRATION.TOTAL_COUNT}
                  />
                </View>

                <View>
                  <Text style={styles.cardStyle}>{t('strings.boxPackInfo')}</Text>
                  <View style={styles.tabContainer}>
                    <Tabs tabs={tabs} styleVariant={STYLE_VARIANT.P3} />
                  </View>
                </View>
                <View style={styles.addPackBtn}>
                  <Button style={styles.button} onPress={() => goBack()} label={t('strings.addPacks')} fontSize={Sizing.layout.x16} />
                </View>
                {showFlexi && (showAnnual || showSemiAnnual) && (
                  <View style={styles.flexiContainer}>
                    <View style={styles.cardContainer}>
                      <Text style={styles.headingText}>{t('strings.rechargeFlexiPlan')}</Text>

                      {showAnnual && (
                        <Pressable style={styles.radioContainer} onPress={() => handleSelectPlan(STRINGS.annual)}>
                          <View style={styles.radioCircle}> {selectedPlan === STRINGS.annual && <View style={styles.selectedRb} />}</View>
                          <View>
                            <Text style={styles.mainText}>
                              {t('strings.flexiPlanAnnual')}: - Rs.{validatePacksSuccessData.flexiPackPriceAnn}
                            </Text>
                            <Text style={styles.minorText}>
                              {t('strings.dealermargin')} - Rs.{validatePacksSuccessData.flexiDealerIncentiveAnnual}
                            </Text>
                            <Text style={styles.minorText}>
                              {t('strings.customerBonus')} - Rs.{validatePacksSuccessData.flexiPackPrice}
                            </Text>
                          </View>
                        </Pressable>
                      )}

                      {showSemiAnnual && (
                        <Pressable style={styles.radioContainer} onPress={() => handleSelectPlan(STRINGS.semi)}>
                          <View style={styles.radioCircle}> {selectedPlan === STRINGS.semi && <View style={styles.selectedRb} />}</View>
                          <View>
                            <Text style={styles.mainText}>
                              {t('strings.flexiPlanSemiAnnual')}: - Rs.{validatePacksSuccessData.flexiPackPriceSemi}
                            </Text>
                            <Text style={styles.minorText}>
                              {t('strings.dealermargin')} - Rs.{validatePacksSuccessData.flexiDealerIncentiveSemiAnnual}
                            </Text>
                            <Text style={styles.minorText}>
                              {t('strings.customerBonus')} - Rs.{validatePacksSuccessData.flexiPackPriceSemiBonus}
                            </Text>
                          </View>
                        </Pressable>
                      )}
                      {(showSemiAnnual || showAnnual) && (
                        <Pressable style={styles.radioContainer} onPress={() => handleSelectPlan(STRINGS.monthly)}>
                          <View style={styles.radioCircle}>{selectedPlan === STRINGS.monthly && <View style={styles.selectedRb} />}</View>
                          <View>
                            <Text style={styles.mainText}>
                              {t('strings.recommendedRecharge')}: - Rs.{validatePacksSuccessData.flexiPackPrice}
                            </Text>
                            <Text style={styles.minorText}>{t('strings.dealermargin')} - Rs.NA</Text>
                            <Text style={styles.minorText}>{t('strings.customerBonus')} - Rs.0</Text>
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </Accordion>
            {routeName === ROUTE.WEB.WO_RECREATION_SUMMARY ||
            routeName === ROUTE.WEB.BOX_TYPE_SUMMARY ||
            routeName === ROUTE.WEB.QUOTATION_ETSK_SUMMARY ||
            routeName === ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY ? null : (
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
          {routeName !== ROUTE.WEB.QUOTATION_ETSK_SUMMARY && routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY ? (
            <>
              <InformationText
                containerStyle={styles.textWrapperETSK}
                primaryStyle={[styles.primaryTextYourPack, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                secondaryStyle={styles.secondaryTextYourPack}
                primaryText={t('strings.REQUIRED_AMOUNT')}
                secondaryText={`₹${showFlexi ? flexiPrice : finalPrice}`}
              />
              <Button style={styles.button} onPress={handleFinalSubmit} label={t('strings.proceed')} fontSize={Sizing.layout.x16} disabled={Boolean(errorMessage)} />
            </>
          ) : (
            <View style={styles.summaryButtonContainer}>
              {info?.roleId !== PARTNER_ROLES.CSM && info?.roleId !== PARTNER_ROLES.ASM && info?.roleId !== PARTNER_ROLES.ASI && (
                <Button style={styles.buttonQuot} onPress={moveToETSKRegistration} label={t('strings.proceedRegister')} fontSize={Sizing.layout.x16} />
              )}
              <Button style={styles.buttonQuot} onPress={openModalforQuote} label={t('strings.sendQuote')} fontSize={Sizing.layout.x16} />
              <Button style={styles.buttonQuot} onPress={chnageBoxType} label={t('strings.changeBoxType')} fontSize={Sizing.layout.x16} />
              <Button
                style={styles.buttonQuot}
                fontSize={Sizing.layout.x16}
                label={t('strings.cancel')}
                isDimension={false}
                onPress={() => replace(routeName === ROUTE.WEB.QUOTATION_ETSK_SUMMARY ? ROUTE.WEB.QUOTATION_ETSK_OFFER : ROUTE.WEB.QUOTATION_PRIMARY_OFFER)}
                type={STYLES.TYPE.SECONDARY}
                outline
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(EtskRegistrationSummary);
