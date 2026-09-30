/**
 * A wrapper for accordion component to generate different components
 *
 * @module components/AccordionWrapper
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { useTranslation } from 'react-i18next';
import {
  ACCORDION_TYPE,
  ALERT,
  CHILD_TYPE,
  ICONS,
  MODAL,
  PROPERTIES,
  QUERY,
  RADIO_GROUP,
  STATE_KEY,
  VALUE_TYPE,
  OFFER_TYPE,
  ROUTE,
  STRINGS,
  CAMPAIGN_TYPE,
  PACK_CATEGORY,
  HEADER_TITLE,
} from 'const';
import Text from 'components/sales/Text';
import Accordion from 'components/sales/Accordion';
import TextContainer, { itemType } from 'components/sales/TextContainer';
import RadioGroup from 'components/sales/RadioGroup';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import PackageOffersWrapper from 'components/sales/PackageOffersWrapper';
import { Colors, Sizing } from 'styles';
import Button from 'components/sales/Button';
import List from 'components/sales/List';
import uiActions from 'store/sales/actions/ui';
import { setOffersBasisRechargeValue } from 'store/sales/actions/form/form.action';
import { sliceActions as customerActions } from 'store/sales/reducer/customerRecharge';
import { formatValue } from 'utils/responseHelper';
import { callAction, isValidMobile } from 'utils/formBuilderHelper';
import Search from 'components/sales/Search';
import formActions from 'store/sales/actions/form';
import Image from 'components/sales/Image';
import useNavigate from 'hooks/useNavigate';
import InformationText from 'components/sales/InformationText';
import { getScreenWidth } from 'styles/dimentionHelper';
import { PARTNER_ROLES } from 'const/strings';
import Autocomplete from 'components/sales/Autocomplete';
import { fetchBingePlusPack } from 'store/sales/actions/customerRecharge/customerRecharge.action';
import styles from './AccordionWrapper.styles';

/**
 * Component type definitions
 *
 * @typedef {object} AccordionWrapperProps
 * @property {string} [text] - The content for the component
 */
type PackDetail = {
  packName: string; // Name of the pack
  packPrice: string; // Price of the pack, represented as a string
  endDate: string; // End date of the pack, empty if not applicable
};

type BoxDetail = {
  connectionType: string; // Type of connection ("Primary" or "Secondary")
  packDetails: PackDetail[]; // Array of pack details
  connectionTypeNT: string;
};

interface ParentObject {
  [key: string]: any;
}

type SelectedValue = string | object;

export type AccordionWrapperProps = {
  name: string;
  onSelect?: (selectedValue: SelectedValue) => void;
  onRemove?: () => void;
  onItemSelect?: () => void;
  unSelectedValue?: string;
  stateKey?: string;
  formData?: ParentObject;
  queryName?: string;
  isOpenDefault?: boolean;
};

/**
 * Represents a AccordionWrapper component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered AccordionWrapper component
 *
 * @example
 * <AccordionWrapper text="Hello World!" />
 */

const AccordionWrapper = ({
  name,
  formData = {},
  unSelectedValue,
  onSelect = () => {},
  onItemSelect = () => {},
  onRemove = () => {},
  queryName,
  stateKey = STATE_KEY.FORM_STATE,
  isOpenDefault = false,
}: AccordionWrapperProps) => {
  const formState = useSelector((state: RootState) => state.form?.[stateKey] ?? {});
  const { formActionData = {}, searchBarItems = [], offersBasisRechargeObject = {}, offersBasisRechargeValue = null, offersBasisRechargeValueType } = formState;
  const { info } = useSelector((state: RootState) => state.user);
  const { selectedId } = useSelector((state: RootState) => state.customerRecharge);
  const { accountInfo = {}, regionOffers = {}, winBackOffers = [], bingePlusPack = [] } = formActionData;

  const dynamicOffersList = formActionData?.regionOffers?.dynamicOffersList ?? [];
  const wbldpPackOffersList = formActionData?.regionOffers?.wbldpPackOffersList ?? [];

  const { winBackPacks } = useSelector((state: RootState) => state.rechargeWinback);
  const { vcNumber, toBeUpgradeType, boxType } = useSelector((state: RootState) => state.boxUpgrade);
  const { manageHierarchyDisDetails } = useSelector((state: RootState) => state.manageHierarchy);
  const { demoAccountDealerDetails } = useSelector((state: RootState) => state.demoAccount);
  const { cancelTskValidateData } = useSelector((state: RootState) => state.tskCancellation);
  const { bingeCategory, bingeDuration, bingeOfferSelected, bingeDurationSelected, bingeCategorySelected, isRadioSelected, isBingeSelected, androidUpgradeSelected } = useSelector(
    (state: RootState) => state.customerRecharge,
  );
  const { evdCode } = useSelector((state: RootState) => state.demoAccount);

  const [packsCount, setPacksCount] = useState(0);
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const boxDetails = winBackPacks?.accountInfo?.boxDetails?.[0];
  const [filteredCategory, setFilteredCategory] = useState(bingeCategory);
  useEffect(() => {
    if (name === ACCORDION_TYPE.DISTRIBUTOR_DETAILS) {
      dispatch(callAction({}, QUERY.GetCircleUserNameEmail));
    }
  }, []);
  useEffect(() => {
    if (boxDetails?.boxType === STRINGS.STANDARD) {
      let filteredData = [];
      filteredData = winBackPacks?.winbackOffers?.packs?.filter((pack: ParentObject) => pack.boxType !== STRINGS.HD);
      setPacksCount(filteredData?.length);
    } else {
      setPacksCount(winBackPacks?.winbackOffers?.packs?.length);
    }
  }, [winBackPacks]);

  useEffect(() => {
    if (offersBasisRechargeObject && Array.isArray(offersBasisRechargeObject.offerList) && offersBasisRechargeObject.offerList.length > 0) {
      const filtered = offersBasisRechargeObject.offerList.filter((offer: any) => Number(offer.packPrice || offer.stdPriUnit) === offersBasisRechargeObject.offerValue);
      // Optional: avoid dispatching if filtered data hasn't changed
      dispatch(setOffersBasisRechargeValue([...filtered]));
    } else {
      dispatch(setOffersBasisRechargeValue([]));
    }
  }, [offersBasisRechargeObject?.offerList]);

  const showPackDetails = (item: ParentObject) => {
    dispatch(callAction({ offerName: item.packNameNT ?? item.nameNT, packPrice: item.packPrice ?? String(item.stdPriUnit) }, QUERY.GetOfferPackDetails))?.then(
      (response: ParentObject) => {
        if (response?.status) {
          navigate(ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS);
        }
      },
    );
  };

  const handleAddOffer = (item: ParentObject, offerType: string) => {
    let alertMessage = '';
    const params = {
      subscriberId: formData.subId ?? formData.subscriberInfo,
      campaignType: item.campaignTypeNT,
      endDateFDR: regionOffers.endDateFDRNT ?? regionOffers.endDateFDR,
      amount: item.packPrice ?? String(item.stdPriUnit),
      packCategory: item.categoryNT,
      pack: item.packNameNT ?? item.nameNT,
    };

    switch (offerType) {
      case OFFER_TYPE.dynamicOffers:
        {
          const rechargeActStatus = regionOffers.actStatusNT;
          const rechargeActBal = regionOffers.balance;
          const { endDateFDRNT } = regionOffers;

          let { packPrice } = item;
          let finalPackPrice = packPrice;
          if (parseFloat(rechargeActBal) < 0) {
            finalPackPrice = Math.round((Math.abs(packPrice) + Math.abs(rechargeActBal)) * 100) / 100;
            params.amount = String(finalPackPrice);
          }

          if (item.isRechargeReqNT === STRINGS.YES || accountInfo?.isDhamakaEligible) {
            if (rechargeActStatus === STRINGS.DEACTIVATED && parseFloat(rechargeActBal) < 0) {
              packPrice = Math.ceil(parseFloat(packPrice) - parseFloat(rechargeActBal));
              packPrice = packPrice.toString();
              params.amount = packPrice;
            }
            let formattedDate = 'an unknown date';
            const dateObj = new Date(Number(endDateFDRNT));
            formattedDate = dateObj.toDateString();
            alertMessage = `${t('alertMessages.confirmStart')} ${formatValue(VALUE_TYPE.CURRENCY, finalPackPrice)} ${t('alertMessages.confirmEnd')} ${parseFloat(rechargeActBal) < 0 && rechargeActStatus === STRINGS.DEACTIVATED ? t('alertMessages.negativeBalance') : ''} ${
              endDateFDRNT !== '' && endDateFDRNT !== STRINGS.NA ? `${t('alertMessages.selectedOfferMsg')} ${formattedDate}. ${t('alertMessages.proceedWithOk')} ` : ''
            }`;
            // show confirm recharge modal
            dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                  isSecondaryRequire: true,
                  queryName: QUERY.AddUppOffer,
                  queryParams: params,
                  clearForm: false,
                },
                {},
              ),
            );
          } else if (item.isOtpReqNT === STRINGS.YES) {
            // send otp and show otp modal
            dispatch(
              uiActions.showAlert(
                t('alertMessages.otpConfirmMsg'),
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                  isSecondaryRequire: true,
                  queryName: QUERY.GetOtpToAddOffer,
                  queryParams: { input: params, mdn: accountInfo.customerRMN },
                  clearForm: false,
                },
                {},
              ),
            );
          } else {
            alertMessage = `${t('alertMessages.confirmStart')} ${formatValue(VALUE_TYPE.CURRENCY, item.packPrice)} ${t('alertMessages.confirmEnd')}`;
            dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                  isSecondaryRequire: true,
                  queryName: QUERY.AddUppOffer,
                  queryParams: params,
                  clearForm: false,
                },
                {},
              ),
            );
          }
        }
        break;

      case OFFER_TYPE.winbackOffers:
        {
          const custBalanceRecharge = winBackOffers.balance;
          params.packCategory = PACK_CATEGORY.GENERIC;
          params.campaignType = CAMPAIGN_TYPE.WINBACK_D30;
          params.endDateFDR = '';
          const { stdPriUnit: packPrice } = item;
          let finalPackPrice = packPrice;
          if (parseFloat(custBalanceRecharge) < 0) {
            finalPackPrice = Math.round((Math.abs(packPrice) + Math.abs(custBalanceRecharge)) * 100) / 100;
            params.amount = String(finalPackPrice);
          }

          if (winBackOffers.withoutRechargeFlagNT === STRINGS.YES && !accountInfo?.isDhamakaEligible) {
            // modal for with and without recharge
            const withRechargeMessage = `${t('alertMessages.confirmStart')} ${formatValue(VALUE_TYPE.CURRENCY, finalPackPrice)} ${t('alertMessages.confirmEnd')} ${parseFloat(custBalanceRecharge) < 0 ? t('alertMessages.negativeBalance') : ''}`;
            const withoutRechargeMessage = `${t('alertMessages.confirmStart')} ${formatValue(VALUE_TYPE.CURRENCY, finalPackPrice)} ${t('alertMessages.otpConfirmEnd')} ${parseFloat(custBalanceRecharge) < 0 ? t('alertMessages.negativeBalance') : ''}`;

            dispatch(
              uiActions.showAlert(
                t('alertMessages.selectOption'),
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                  isSecondaryRequire: true,
                  queryName: QUERY.ShowRechargeConfirmation,
                  queryParams: {
                    input: params,
                    mdn: accountInfo.customerRMN,
                    withRechargeMessage,
                    withoutRechargeMessage,
                    otpConfigForWithoutChange: winBackOffers.otpConfigForWithoutChangeNT,
                  },
                },
                {
                  type: CHILD_TYPE.RADIO_CONTAINER,
                  data: PROPERTIES.CUSTOMER_RECHARGE.RECHARGE_OPTIONS,
                },
              ),
            );
          } else {
            alertMessage = `${t('alertMessages.confirmStart')} ${formatValue(VALUE_TYPE.CURRENCY, finalPackPrice)} ${t('alertMessages.confirmEnd')} ${parseFloat(custBalanceRecharge) < 0 ? t('alertMessages.negativeBalance') : ''}`;
            // show confirm recharge modal
            dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                  isSecondaryRequire: true,
                  queryName: QUERY.AddUppOffer,
                  queryParams: params,
                  clearForm: false,
                },
                {},
              ),
            );
          }
        }
        break;

      case OFFER_TYPE.mahaBumperOffer:
        {
          const custBalanceRecharge = regionOffers.balance;
          params.packCategory = PACK_CATEGORY.GENERIC;
          params.campaignType = CAMPAIGN_TYPE.WINBACK_LDP;
          params.endDateFDR = '';
          const { stdPriUnit: packPrice } = item;

          let finalPackPrice = packPrice;
          if (parseFloat(custBalanceRecharge) < 0) {
            finalPackPrice = Math.round((Math.abs(packPrice) + Math.abs(custBalanceRecharge)) * 100) / 100;
            params.amount = String(finalPackPrice);
          }

          if (regionOffers.withoutRechargeFlagNT === STRINGS.YES && !accountInfo?.isDhamakaEligible) {
            // modal for with and without recharge
            const withRechargeMessage = `${t('alertMessages.confirmStart')} ${formatValue(VALUE_TYPE.CURRENCY, finalPackPrice)} ${t('alertMessages.confirmEnd')} ${parseFloat(custBalanceRecharge) < 0 ? t('alertMessages.negativeBalance') : ''}`;
            const withoutRechargeMessage = `${t('alertMessages.confirmStart')} ${formatValue(VALUE_TYPE.CURRENCY, finalPackPrice)} ${t('alertMessages.otpConfirmEnd')} ${parseFloat(custBalanceRecharge) < 0 ? t('alertMessages.negativeBalance') : ''}`;

            dispatch(
              uiActions.showAlert(
                t('alertMessages.selectOption'),
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                  isSecondaryRequire: true,
                  queryName: QUERY.ShowRechargeConfirmation,
                  queryParams: {
                    input: params,
                    mdn: accountInfo.customerRMN,
                    withRechargeMessage,
                    withoutRechargeMessage,
                    otpConfigForWithoutChange: regionOffers.otpConfigForWithoutChangeNT,
                  },
                },
                {
                  type: CHILD_TYPE.RADIO_CONTAINER,
                  data: PROPERTIES.CUSTOMER_RECHARGE.RECHARGE_OPTIONS,
                },
              ),
            );
          } else {
            alertMessage = `${t('alertMessages.confirmStart')} ${formatValue(VALUE_TYPE.CURRENCY, finalPackPrice)} ${t('alertMessages.confirmEnd')} ${parseFloat(custBalanceRecharge) < 0 ? t('alertMessages.negativeBalance') : ''}`;
            // show confirm recharge modal
            dispatch(
              uiActions.showAlert(
                alertMessage,
                ALERT.CONFIRM,
                {
                  primaryText: MODAL.OK,
                  secondaryText: MODAL.CANCEL,
                  isSecondaryRequire: true,
                  queryName: QUERY.AddUppOffer,
                  queryParams: params,
                  clearForm: false,
                },
                {},
              ),
            );
          }
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (bingeCategory?.length > 0 && bingeDuration?.length > 0) {
      dispatch(customerActions.setbingeCategorySelected(bingeCategory[0]));
      dispatch(customerActions.setBingeDurationSelected({ name: t('strings.All'), value: STRINGS.ALL }));
    } else {
      dispatch(customerActions.setbingeCategorySelected(undefined));
      dispatch(customerActions.setBingeDurationSelected(undefined));
    }
  }, [bingeCategory, bingeDuration, bingeOfferSelected]);

  const manageSelectedCategory = (value: ParentObject | null) => {
    if (value) {
      dispatch(customerActions.setIsBingeSelected(true));
      dispatch(customerActions.setBingeOfferSelected(value));
      dispatch(fetchBingePlusPack({}, QUERY.FetchBingePlusPack));
    } else {
      dispatch(customerActions.setIsBingeSelected(false));
      dispatch(customerActions.setbingeCategorySelected(undefined));
      dispatch(customerActions.setBingeDurationSelected(undefined));
      dispatch(customerActions.setBingeOfferSelected(undefined));
    }
  };
  const manageSelectedDuration = (value: ParentObject | null) => {
    let list;
    if (value?.value !== STRINGS.ALL) {
      list = bingeCategory.filter((item: ParentObject) => item.duration.toLowerCase() === value?.value.toLowerCase());
    } else {
      list = bingeCategory;
    }
    setFilteredCategory(list);
    if (list.length > 0) {
      dispatch(customerActions.setbingeCategorySelected(list[0]));
    } else {
      dispatch(customerActions.setbingeCategorySelected(undefined));
      dispatch(uiActions.showAlert(`${value?.value} ${t('strings.noPacksAvailable')}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
    }
  };

  const renderItem = (item: ParentObject, offerType: string) => {
    const dataArray = PROPERTIES.CUSTOMER_RECHARGE[offerType as keyof typeof PROPERTIES.CUSTOMER_RECHARGE];
    const screenWidth = getScreenWidth();
    const isMobileView = screenWidth <= Sizing.layout.x500;
    const isMobileOffer = isMobileView && (offerType === OFFER_TYPE.dynamicOffers || offerType === OFFER_TYPE.mahaBumperOffer || offerType === OFFER_TYPE.winbackOffers);
    const excludedKeys = new Set(['friendlyName', 'offerType']);
    const cleanedData = Array.isArray(dataArray) ? dataArray.filter((item: any) => !excludedKeys.has(item.key)) : [];

    return isMobileOffer ? (
      <View style={[styles.cardMobileContainer, styles[gcs('cardMobileContainer', inflection, true, ['lg', 'xl'])]]}>
        <View style={styles.headerSmall}>
          <Text style={styles.headerText}>{item?.friendlyName || item?.offerType}</Text>
        </View>
        <View style={styles.textContainerSmall}>
          <TextContainer
            itemContainerStyle={styles.textMobileWrapper}
            primaryStyle={styles.primaryMobileText}
            secondaryStyle={styles.secondaryMobileText}
            data={item}
            dataArray={isMobileOffer ? (cleanedData as itemType[]) : (dataArray as itemType[])}
          />
        </View>
        <View style={styles.buttonContainerSmall}>
          <Button
            onPress={() => showPackDetails(item)}
            style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            isDimension={false}
            label={t('strings.viewDetails')}
            outline
            fontColor={Colors.primary.brand}
            labelStyle={styles.buttonLabelStyle}
            fontSize={Sizing.layout.x16}
          />
          <Button
            label={t('strings.plusAdd')}
            onPress={() => handleAddOffer(item, offerType)}
            style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            labelStyle={styles.buttonLabelStyle}
            fontSize={Sizing.layout.x16}
          />
        </View>
      </View>
    ) : (
      <View>
        <View style={[styles.infoContainer]}>
          <TextContainer
            textContainerStyle={styles.textContainer}
            itemContainerStyle={styles.textWrapper}
            primaryStyle={styles.primaryOfferText}
            secondaryStyle={styles.secondaryOfferText}
            data={item}
            dataArray={dataArray as itemType[]}
            maxFontSize={Sizing.layout.x18}
            separator=": "
          />
          <View style={[styles.detailsContainer, styles[gcs('detailsContainer', inflection, true, ['xs', 'sm'])]]}>
            <TouchableOpacity onPress={() => showPackDetails(item)}>
              <Image iconName={ICONS.DETAILS_INFO} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
            </TouchableOpacity>
            <View style={styles.verticalSeparator} />
            <Button label={t('strings.plusAdd')} onPress={() => handleAddOffer(item, offerType)} style={styles.addButton} borderRadius={Sizing.layout.x0} />
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  const showPlanInfo = (planInfo: ParentObject) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.WINBACK_FLEXI_MARGIN,
        headerTitle: HEADER_TITLE.offerDetails,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          primaryButtonLabel: MODAL.OK,
          childData: planInfo,
          centerLabel: true,
        },
      }),
    );
  };

  const createAccordion = (accordionName: string) => {
    switch (accordionName) {
      case ACCORDION_TYPE.VALIDATE_SUBSCRIBER: {
        const boxDetails = accountInfo?.boxDetails?.slice().sort((a: BoxDetail, b: BoxDetail) => a.connectionTypeNT.localeCompare(b.connectionTypeNT)) || [];
        const mainConnectionType = boxDetails[0]?.connectionType;

        return Object.keys(accountInfo ?? {})?.length ? (
          <Accordion title={t('strings.subscriberInfoAccordion')} titleColor={Colors.neutral.black} accordionStyle={styles.firstAccordionStyle}>
            <View style={styles.cardContainer}>
              <TextContainer
                textContainerStyle={styles.rowContainer}
                itemContainerStyle={[styles.itemContainer, styles[gcs('itemContainer', inflection, true, ['md', 'lg', 'xl'])]]}
                data={accountInfo}
                primaryStyle={styles.primaryText}
                secondaryStyle={styles.secondaryText}
                dataArray={isValidMobile(formData.subscriberInfo) ? PROPERTIES.CUSTOMER_RECHARGE.VALIDATE_SUBSCRIBER0 : PROPERTIES.CUSTOMER_RECHARGE.VALIDATE_SUBSCRIBER1}
              />
              <View style={styles.borderViewStyle} />
              <TextContainer
                textContainerStyle={styles.rowContainer}
                itemContainerStyle={[styles.itemContainer, styles[gcs('itemContainer', inflection, true, ['md', 'lg', 'xl'])]]}
                data={{ ...accountInfo, connectionType: mainConnectionType }}
                primaryStyle={styles.primaryText}
                secondaryStyle={styles.secondaryText}
                dataArray={PROPERTIES.CUSTOMER_RECHARGE.VALIDATE_SUBSCRIBER2}
              />
            </View>

            <View style={[styles.cardContainer, styles[gcs('cardContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              <Text style={styles.headingText} label={t('strings.packages')} />
              <View style={styles.alignItemStart}>
                {boxDetails[0]?.packDetails?.map((info: PackDetail, idx: number) => (
                  <Text
                    style={[styles.infoText, styles.alignSelfStart, styles.fontMedium, styles.textLeft]}
                    label={`${info.packName} - ${formatValue(VALUE_TYPE.CURRENCY, info.packPrice)}, ${t('strings.endDate')}: ${info.endDate || 'NA'}`}
                    id={idx.toString()}
                  />
                ))}
              </View>
              {boxDetails?.length > 1 && (
                <View>
                  {boxDetails.slice(1).map((boxInfo: BoxDetail, index: number) => (
                    <View key={`${index + 1}`} style={[styles.topBorder, styles.alignSelfStart]}>
                      <InformationText separator=":" containerStyle={styles.infoTextContainer} primaryText={t('strings.connectionType')} secondaryText={boxInfo.connectionType} />
                      <Text style={styles.headingText} label={t('strings.packages')} />
                      <View style={styles.alignItemStart}>
                        {boxInfo?.packDetails?.map((info: PackDetail, idx: number) => (
                          <Text
                            style={[styles.infoText, styles.alignSelfStart, styles.fontMedium, styles.textLeft]}
                            label={`${info.packName} - ${formatValue(VALUE_TYPE.CURRENCY, info.packPrice)}, ${t('strings.endDate')}: ${info.endDate || 'NA'}`}
                            id={idx.toString()}
                          />
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.cardContainer}>
              <TextContainer
                data={accountInfo}
                textContainerStyle={styles.rowContainer}
                itemContainerStyle={[styles.itemContainer, styles[gcs('itemContainer', inflection, true, ['md', 'lg', 'xl'])]]}
                primaryStyle={styles.primaryText}
                secondaryStyle={styles.secondaryText}
                dataArray={PROPERTIES.CUSTOMER_RECHARGE.VALIDATE_SUBSCRIBER3}
              />
            </View>
          </Accordion>
        ) : null;
      }

      case ACCORDION_TYPE.RECHARGE_OFFER: {
        const groups = [
          ...(!accountInfo?.winbackFlexiOffers?.offerDetails?.length
            ? [
                {
                  heading: RADIO_GROUP.RechargeFlexiPlan,
                  items: PROPERTIES.CUSTOMER_RECHARGE.RECHARGE_FLEXI_PLAN,
                  data: accountInfo,
                  showIcon: true,
                },
              ]
            : [
                {
                  heading: RADIO_GROUP.RechargeWinbackFlexi,
                  items: PROPERTIES.CUSTOMER_RECHARGE.RECHARGE_WINBACK_FLEXI,
                  data: accountInfo?.winbackFlexiOffers,
                  showIcon: false,
                },
              ]),
          {
            heading: RADIO_GROUP.OtherRechargeOption,
            items: PROPERTIES.CUSTOMER_RECHARGE.OTHER_RECHARGE_OPTIONS,
            data: accountInfo,
          },
          ...(accountInfo?.bingeOffer === PROPERTIES.CUSTOMER_RECHARGE.U
            ? [
                {
                  heading: RADIO_GROUP.RechargeBingePlan,
                  items: PROPERTIES.CUSTOMER_RECHARGE.RECHARGE_BINGE_PLAN,
                  data: accountInfo,
                  showIcon: false,
                },
              ]
            : []),
        ];

        return Object.keys(accountInfo ?? {})?.length ? (
          <Accordion title={t('strings.rechargeOfferAccordion')} titleColor={Colors.neutral.black} accordionStyle={styles.accordionStyle}>
            <RadioGroup
              groups={groups}
              unSelectedValue={unSelectedValue}
              onSelect={(selectedValue: SelectedValue, id?: string) => {
                dispatch(customerActions.setSelectedId(undefined));
                dispatch(customerActions.setRadioSelected(id === STRINGS.BINGE_RECHARGE_VALUE));
                if (id !== STRINGS.BINGE_RECHARGE_VALUE) {
                  manageSelectedCategory(null);
                }
                onSelect(selectedValue);
                if (id === PROPERTIES.CUSTOMER_RECHARGE.RECHARGE_FLEXI_PLAN[0].key || id === PROPERTIES.CUSTOMER_RECHARGE.RECHARGE_FLEXI_PLAN[1].key) {
                  dispatch(customerActions.setBingeFlag(accountInfo.flexiRechargeFlag));
                } else {
                  dispatch(customerActions.setBingeFlag(PROPERTIES.CUSTOMER_RECHARGE.N));
                }
              }}
            />
            {accountInfo?.bingeOffer === PROPERTIES.CUSTOMER_RECHARGE.U && androidUpgradeSelected && isRadioSelected && (
              <View>
                <Text style={styles.titleText}>{t('strings.bingePlus')}</Text>
                <View style={styles.dropDownContainer}>
                  <Autocomplete
                    placeholder={t('strings.bingePlusOffer')}
                    containerStyle={styles.outerContainer}
                    innerContainerStyle={styles.innerDropDown}
                    queryName={STRINGS.BINGE_OFFER}
                    onSelect={manageSelectedCategory}
                    isCloseIconRequired={false}
                    queryParams="searchLocally"
                    actionNeeded={false}
                    data={bingePlusPack}
                  />
                </View>
              </View>
            )}
            {accountInfo?.bingeOffer === PROPERTIES.CUSTOMER_RECHARGE.U && androidUpgradeSelected && isRadioSelected && isBingeSelected && (
              <>
                <Text style={styles.titleText}>{t('strings.bingePlusCategoryTitle')}</Text>
                <View style={styles.rowContainerCenter}>
                  <View style={styles.dropDownContainer}>
                    <Autocomplete
                      placeholder={t('strings.SELECT_DURATION')}
                      containerStyle={styles.outerContainer}
                      innerContainerStyle={styles.innerDropDown}
                      queryName={STRINGS.DURATION_DROPDOWN}
                      selectedValue={bingeDurationSelected}
                      onSelect={manageSelectedDuration}
                      isCloseIconRequired={false}
                      queryParams="searchLocally"
                      actionNeeded={false}
                      data={bingeDuration}
                    />
                  </View>
                  <View style={styles.dropDownContainer}>
                    <Autocomplete
                      placeholder={t('strings.bingePlusCategory')}
                      containerStyle={styles.outerContainer}
                      innerContainerStyle={styles.innerDropDown}
                      queryName={STRINGS.CATEGORY_DROPDOWN}
                      selectedValue={bingeCategorySelected}
                      isCloseIconRequired={false}
                      queryParams="searchLocally"
                      actionNeeded={false}
                      data={filteredCategory}
                    />
                  </View>
                </View>
              </>
            )}
          </Accordion>
        ) : null;
      }

      case ACCORDION_TYPE.SEGMENTED_OFFER: {
        return Object.keys(accountInfo?.segmentedCashBackOffers?.offerDetails ?? {})?.length ? (
          <Accordion title={t('strings.cashBackOffers')} titleColor={Colors.neutral.black} accordionStyle={styles.accordionStyle}>
            <View style={styles.card}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => showPlanInfo(accountInfo?.segmentedCashBackOffers?.offerDetails)}>
                  <Image iconName={ICONS.DETAILS_INFO} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTextBig}>{t('strings.guaranteedCashback')}</Text>
              </View>

              <FlatList
                data={accountInfo?.segmentedCashBackOffers?.offerDetails}
                keyExtractor={(item) => item.offerDesc.toString()}
                renderItem={({ item }) => {
                  const isSelected = selectedId === item.offerKey;
                  return (
                    <TouchableOpacity
                      style={styles.optionContainer}
                      onPress={() => {
                        dispatch(customerActions.setSelectedOffer({ ...item, offerType: accountInfo?.segmentedCashBackOffers?.offerType }));
                        dispatch(customerActions.setSelectedId(item?.offerKey));
                        dispatch(customerActions.setSelectedIdRadio(undefined));
                        dispatch(formActions.setUpdatedFormFields({ amount: item?.rechargeAmount }));
                        dispatch(customerActions.setBingeFlag('Q'));
                      }}
                    >
                      {/* Radio Button */}
                      <View style={[styles.radioCircle, isSelected && styles.selectedRadioCircle]}>{isSelected ? <View style={styles.selectedRb} /> : null}</View>

                      {/* Offer Content */}
                      <View style={styles.subContainer}>
                        <Text style={[styles.primaryTextStyle, styles[gcs('primaryTextStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
                          {t('strings.rechargeFor')} Rs. {item?.rechargeAmount}
                        </Text>
                        <Text style={[styles.subTextStyle, styles.gap5]}>
                          {t('strings.flexiAnnualBonus')} Rs. {item?.cashbackValue}
                        </Text>
                        {item?.dealerMargin > 0 && (
                          <Text style={[styles.subTextStyle, styles.gap5]}>
                            {t('strings.flexiDealerIncentiveAnnual')} Rs. {item?.dealerMargin}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Accordion>
        ) : null;
      }

      case ACCORDION_TYPE.DYNAMIC_OFFERS: {
        return dynamicOffersList?.length > 0 ? (
          <View style={styles.dynamicOffersContainer}>
            {dynamicOffersList?.map((offer: ParentObject) => (
              <Accordion title={offer.offerCategory} accordionStyle={styles.accordionStyle} listStyle={styles.accordionListStyle} titleColor={Colors.neutral.black}>
                <Search queryName={offer.offerCategoryNT} commonQueryName={queryName} placeholder={t('strings.search')} />
                <List data={searchBarItems[offer.offerCategoryNT]} renderItem={({ item }) => renderItem(item, OFFER_TYPE.dynamicOffers)} showsVerticalScrollIndicator />
              </Accordion>
            ))}
          </View>
        ) : null;
      }

      case ACCORDION_TYPE.MAHA_BUMPER_OFFER: {
        return wbldpPackOffersList?.length > 0 ? (
          <Accordion title={t('strings.mahaBumperOfferAccordion')} titleColor={Colors.neutral.black} accordionStyle={styles.accordionStyle} listStyle={styles.accordionListStyle}>
            <Search queryName={queryName} placeholder={t('strings.search')} />
            <List data={searchBarItems?.searchMahaBumperOffers} renderItem={({ item }) => renderItem(item, OFFER_TYPE.mahaBumperOffer)} showsVerticalScrollIndicator={false} />
          </Accordion>
        ) : null;
      }

      case ACCORDION_TYPE.OFFERS_BASIS_RECHARGE_VALUE: {
        return offersBasisRechargeValue?.length > 0 ? (
          <Accordion
            title={t('strings.offersBasisRechargeValue')}
            titleColor={Colors.neutral.black}
            accordionStyle={styles.accordionStyle}
            listStyle={styles.accordionListStyle}
            isOpenDefault={isOpenDefault}
          >
            <Search queryName={queryName} placeholder={t('strings.search')} />
            <List
              data={searchBarItems?.searchOffersBasisRechargeValue}
              renderItem={({ item }) => renderItem(item, offersBasisRechargeValueType)}
              showsVerticalScrollIndicator={false}
            />
          </Accordion>
        ) : null;
      }

      case ACCORDION_TYPE.WINBACK_OFFER: {
        return winBackOffers?.d30WinBackPacksList?.length > 0 ? (
          <Accordion title={t('strings.winbackOfferAccordion')} titleColor={Colors.neutral.black} accordionStyle={styles.accordionStyle} listStyle={styles.accordionListStyle}>
            <Search queryName={queryName} placeholder={t('strings.search')} />
            <List data={searchBarItems?.searchWinbackOffers} renderItem={({ item }) => renderItem(item, OFFER_TYPE.winbackOffers)} showsVerticalScrollIndicator />
          </Accordion>
        ) : null;
      }
      case ACCORDION_TYPE.DISTRIBUTOR_DETAILS: {
        const details = {
          name: manageHierarchyDisDetails[0]?.userName,
          distributorMdn: manageHierarchyDisDetails[0]?.distributorMdn,
          circleDesc: manageHierarchyDisDetails[0]?.circleDesc,
        };
        const fosDetails = {
          name: manageHierarchyDisDetails[0]?.distributorName,
          distributorMdn: manageHierarchyDisDetails[0]?.distributorMdn,
          circleDesc: manageHierarchyDisDetails[0]?.circleDesc,
          fosName: info?.name,
          fosMobile: info?.mdn,
        };
        return (
          <View style={styles.accordionContainerDistributor}>
            <Accordion
              title={t('strings.distributorDetail')}
              accordionStyle={styles.distributerDetailsStyle}
              buttonStyle={styles.distributerDetailsButtonStyle}
              collapseIcon={ICONS.PINK_CHEVRON_UP}
              expandIcon={ICONS.PINK_CHEVRON_DOWN}
              titleColor={Colors.violet.darkViolet}
              listStyle={styles.listStyle}
              isDimension={false}
              iconHeight={Sizing.layout.x18}
              iconWidth={Sizing.layout.x18}
              dataCount={winBackPacks?.length}
            >
              <TextContainer
                itemContainerStyle={styles.textWrapperManage}
                primaryStyle={[styles.primaryTextManage, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                secondaryStyle={styles.secondaryTextManage}
                data={info?.roleId === PARTNER_ROLES.fos ? fosDetails : details}
                dataArray={info?.roleId === PARTNER_ROLES.fos ? PROPERTIES.MANAGE_HIERARCHY.DISTRIBUTER_FOS_DETAILS : PROPERTIES.MANAGE_HIERARCHY.DISTRIBUTER_DETAILS}
                hasSepratorBottom
              />
            </Accordion>
          </View>
        );
      }

      case ACCORDION_TYPE.RECHARGE_WINBACK: {
        return (
          winBackPacks?.length !== Sizing.x0 && (
            <>
              <Text style={[styles.winbackLable, styles[gcs('labelTextStyle', inflection, true, ['md', 'lg', 'xl'])]]}>{t('strings.packageOffers')}</Text>
              <View style={styles.accordionContainer}>
                <Accordion
                  title={t('strings.offerDetails')}
                  accordionStyle={styles.winbackAccordionStyle}
                  buttonStyle={styles.winbackAccoodianButtonStyle}
                  collapseIcon={ICONS.PINK_CHEVRON_UP}
                  expandIcon={ICONS.PINK_CHEVRON_DOWN}
                  titleColor={Colors.neutral.black}
                  listStyle={styles.listStyle}
                  isDimension={false}
                  iconHeight={Sizing.layout.x18}
                  iconWidth={Sizing.layout.x18}
                  dataCount={packsCount}
                >
                  <PackageOffersWrapper onRemove={onRemove} onItemSelect={onItemSelect} />
                </Accordion>
              </View>
            </>
          )
        );
      }
      case ACCORDION_TYPE.EXISTING_BOX_DETAILS: {
        return (
          <View style={styles.accordionContainer}>
            <Accordion
              title={t('strings.existingBox')}
              titleColor={Colors.neutral.black}
              accordionStyle={styles.accordionStyle}
              listStyle={styles.accordionListStyle}
              isOpenDefault={isOpenDefault}
            >
              <Text style={[styles.accordionContainerboxUpgradeBold, styles[gcs('labelTextStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
                <Text style={[styles.accordionContainerboxUpgrade, styles[gcs('labelTextStyle', inflection, true, ['md', 'lg', 'xl'])]]}>{toBeUpgradeType}</Text>
                {` -${vcNumber}-${boxType}`}
              </Text>
            </Accordion>
          </View>
        );
      }
      case ACCORDION_TYPE.DEMO_ACCOUNT_DIS_DETAILS: {
        const finalData = { ...demoAccountDealerDetails?.response?.dealerDetails, partnerCode: evdCode };
        return (
          <View style={styles.accordionContainerDemoAccount}>
            <Accordion
              title={
                demoAccountDealerDetails?.response?.dealerDetails?.roleId?.toLowerCase() === STRINGS.DSR
                  ? t('strings.fosDetail')
                  : `${demoAccountDealerDetails?.response?.dealerDetails?.roleId} ${t('strings.detailsType')}`
              }
              accordionStyle={styles.winbackAccordionStyle}
              buttonStyle={styles.winbackAccoodianButtonStyle}
              collapseIcon={ICONS.PINK_CHEVRON_UP}
              expandIcon={ICONS.PINK_CHEVRON_DOWN}
              titleColor={Colors.violet.darkViolet}
              listStyle={styles.listStyle}
              isDimension={false}
              iconHeight={Sizing.layout.x18}
              iconWidth={Sizing.layout.x18}
            >
              <TextContainer
                itemContainerStyle={styles.textWrapperManage}
                primaryStyle={[styles.primaryTextManage, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                secondaryStyle={styles.secondaryTextManage}
                data={finalData}
                dataArray={PROPERTIES.DEMO_ACCOUNT_CREATION.DISTRIBUTER_DETAILS}
                hasSepratorBottom
              />
            </Accordion>
          </View>
        );
      }

      case ACCORDION_TYPE.CANCEL_TSK_DETAILS: {
        const finalData = { ...cancelTskValidateData };
        return (
          <View style={styles.cancelTskContainer}>
            <TextContainer
              itemContainerStyle={styles.cancelTsktextWrapper}
              primaryStyle={[styles.primaryTextManage, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
              secondaryStyle={styles.secondaryTextManage}
              data={finalData}
              dataArray={PROPERTIES.CANCEL_TSK_DETAILS.TSK_DETAILS}
              hasSepratorBottom
            />
          </View>
        );
      }

      default:
        return null;
    }
  };

  return <View testID="accordion-test-wrapper">{createAccordion(name) ?? ''}</View>;
};

export default AccordionWrapper;
