/**
 * This component displays a list of searched items based on the provided query name and list type.
 * It interacts with the Redux store to manage selected dealer data and navigates to different screens based on conditions.
 *
 * @module components/SearchBarItems
 * @memberof CommonComponent
 */

import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { DealerData } from 'store/sales/types/autoEvd';
import formActions from 'store/sales/actions/form';
import commonActions from 'store/sales/actions/common';
import autoEvdActions from 'store/sales/actions/autoEvd';
import List from 'components/sales/List';
import DealerEvdDetails from 'components/sales/DealerEvdDetails';
import { CAMPAIGN_TYPE, ICONS, MODAL, OFFER_TYPE, PACK_CATEGORY, PROPERTIES, QUERY, ROUTE, SEARCH_LIST, STATE_KEY, STRINGS, STYLES } from 'const';
import { ParentObject } from 'store/sales/types/common';
import AddPackageOffer from 'components/sales/AddPackageOffer';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { callAction } from 'utils/formBuilderHelper';
import { useTranslation } from 'react-i18next';
import { Sizing, Typography } from 'styles';
import { gcs } from 'styles/webBreakpoints';
import customerOfferActions from 'store/sales/actions/customerOffers';
import { handleWebViewUrl } from 'utils/navigationHelper';
import Text from 'components/sales/Text';
import Button from 'components/sales/Button';
import InvoiceTransactions from 'components/sales/InvoiceTransactions';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './SearchBarItems.styles';

/**
 * Component type definitions
 *
 * @typedef {object} SearchBarItemsProps
 * @property {string} listType - The type of list to be displayed (used for conditionally rendering items)
 * @property {string} queryName - The query name used to retrieve search results from the Redux store
 */

export type SearchBarItemsProps = {
  listType: string;
  queryName: string;
  onItemSelect: (item: ParentObject | null, showProceedWithoutRecharge: number[]) => void;
  selectedItem: ParentObject;
  stateKey?: string;
  itemsArr?: ParentObject[];
  fieldDependencyValue?: string | number;
};

/**
 * SearchBarItems component
 *
 * Displays a list of items matching the search query and renders them conditionally based on the list type.
 * It allows users to select a dealer and triggers navigation to the appropriate screen depending on the item’s properties.
 *
 * @param {SearchBarItemsProps} props - The properties for the SearchBarItems component
 * @returns {JSX.Element} The rendered SearchBarItems component
 *
 * @example
 * <SearchBarItems listType={SEARCH_LIST.AUTO_EVD_DEALERS} queryName="autoEvdSearch" />
 */

const SearchBarItems = ({ itemsArr, queryName, listType, onItemSelect, selectedItem, fieldDependencyValue, stateKey = STATE_KEY.FORM_STATE }: SearchBarItemsProps) => {
  const { searchBarItems } = useSelector((state: RootState) => state.form[stateKey]);
  const { offersData, isOfferRemoved } = useSelector((state: RootState) => state.customerOffers);
  const isDhamakaEligible = offersData?.accountInfo?.isDhamakaEligible;

  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const { inflection } = useInflection();
  const { t, i18n } = useTranslation();

  const listItems = searchBarItems[queryName];

  const selectedOffer = offersData?.offers?.find((offer: ParentObject) => offer.offerCategoryNT === queryName);

  const handleButtonPress = (data: DealerData) => {
    dispatch(commonActions.setDealerDetails({ name: data?.name, evdCode: data.userId, mdn: data.mdn }));
    dispatch(autoEvdActions.setAutoEvdNavigationData({ dealerId: data.userId, dealerName: data?.nameNT, status: data.thresholdSetNT }));
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.autoEVDTransfer.Update_Auto_EVD_Transfer_Page_Visit.moduleName, {
      [MoengageMixpanelModules.autoEVDTransfer.Update_Auto_EVD_Transfer_Page_Visit.attributes.Status]: true,
    });
    if (data.thresholdSetNT === MODAL.Y) {
      dispatch(formActions.setFormValues({ thresholdLimitValue: data?.minBalance, autoEvdAmount: data?.reqBalance }));
      dispatch(formActions.setUpdatedFormFields({ thresholdLimitValue: data?.minBalance, autoEvdAmount: data?.reqBalance }));
      dispatch(autoEvdActions.setAutoEvdCurrentValues({ minBalance: data?.minBalance, reqBalance: data?.reqBalance }));
      navigate(ROUTE.WEB.UPDATE_AUTO_EVD);
    } else {
      dispatch(formActions.setFormValues({ thresholdLimitValue: '', autoEvdAmount: '' }));
      dispatch(formActions.setUpdatedFormFields({ thresholdLimitValue: '', autoEvdAmount: '' }));
      navigate(ROUTE.WEB.SET_AUTO_EVD);
    }
  };

  const handleAddOffer = (item: ParentObject) => {
    const params = {
      campaignType: item.campaignTypeNT ?? '',
      endDateFDR: offersData?.endDateFDR ?? '',
      amount: item.stdPriUnit ? String(item.stdPriUnit) : String(item.packPrice),
      packCategory: item.categoryNT ?? '',
      pack: item.nameNT || item.packNameNT,
    };

    let showProceedRecharge = false;
    let showProceedWithoutRecharge = false;
    const rechargeActStatusNT = offersData?.actStatusNT;
    const rechargeActBal = offersData?.balance;

    if (item.isRechargeReqNT === STRINGS.YES) {
      showProceedRecharge = true;
      if (item.isOtpReqNT === STRINGS.YES) {
        showProceedWithoutRecharge = true;
      } else if (rechargeActStatusNT === STRINGS.DEACTIVATED && parseFloat(rechargeActBal) < 0) {
        let { packPrice } = item;
        packPrice = Math.ceil(parseFloat(packPrice) - parseFloat(rechargeActBal));
        packPrice = packPrice.toString();
        params.amount = packPrice;
      }
    } else if (item.isOtpReqNT === STRINGS.YES) {
      showProceedWithoutRecharge = true;
    } else if (queryName === PROPERTIES.CUSTOMER_OFFERS.WINBACK_OFFERS_KEY || queryName === PROPERTIES.CUSTOMER_OFFERS.MAHA_BUMPER) {
      showProceedRecharge = true;
      const { balance: custBalanceRecharge, withoutRechargeFlagNT, otpConfigForWithoutChangeNT } = selectedOffer;
      params.packCategory = PACK_CATEGORY.GENERIC;
      params.campaignType = queryName === PROPERTIES.CUSTOMER_OFFERS.MAHA_BUMPER ? CAMPAIGN_TYPE.WINBACK_LDP : CAMPAIGN_TYPE.WINBACK_D30;
      let { stdPriUnit: packPrice } = item;

      if (parseFloat(custBalanceRecharge) < 0) {
        packPrice = Math.ceil(parseFloat(packPrice) - parseFloat(custBalanceRecharge));
        packPrice = packPrice.toString();
        params.amount = packPrice;
      }
      if (withoutRechargeFlagNT === STRINGS.YES && otpConfigForWithoutChangeNT === STRINGS.YES) {
        showProceedWithoutRecharge = true;
      }
    }
    if (isDhamakaEligible) {
      showProceedWithoutRecharge = false;
    }

    const visibleIndexes = [0]; // 0 index is always visible
    const amountValue = parseFloat(params.amount);

    if ((amountValue >= Number(fieldDependencyValue) || queryName !== PROPERTIES.CUSTOMER_OFFERS.MY_OFFERS_KEY) && showProceedRecharge) {
      visibleIndexes.push(1); // Show "Proceed to Recharge" if amount is 200 or more
    }
    if (showProceedWithoutRecharge) {
      visibleIndexes.push(2); // Show "Proceed Without Recharge" if allowed
    }
    if (!visibleIndexes.includes(1) && !visibleIndexes.includes(2)) {
      visibleIndexes.push(3); // Show fallback button if both main buttons are hidden
    }
    visibleIndexes.push(4); // show disclaimer as index basis of related fields
    dispatch(formActions.setUpdatedFormFields({ requiredAmount: params.amount }));
    dispatch(callAction({ item, input: params, offerType: selectedOffer?.type }, QUERY.SetSelectedOfferData));
    onItemSelect({ item, input: params }, visibleIndexes);
  };

  const handleViewDetails = (item: ParentObject) => {
    if (item.heading === PROPERTIES.CUSTOMER_OFFERS.BINGLE_FLEXI_LITE) {
      navigate(ROUTE.WEB.BINGE_VIEW_DETAILS);
    } else {
      dispatch(
        callAction({ offerName: item.nameNT || item.packNameNT, packPrice: item.stdPriUnit ? String(item.stdPriUnit) : String(item.packPrice) }, QUERY.GetOfferPackDetails),
      )?.then((response: ParentObject) => {
        if (response?.status) {
          navigate(ROUTE.WEB.MY_OFFERS_VIEW_DETAILS);
        }
      });
    }
  };

  const handleDownloadInvoice = (data: ParentObject) => {
    dispatch(callAction({ transactionID: data?.transactionId, isDownload: true, keepFalse: true }, QUERY.GetInvoiceTransactions))?.then((response: ParentObject) => {
      if (response?.status) {
        handleWebViewUrl(response?.invoiceUrl, true);
        return { status: true };
      }
      return { status: false };
    });
  };

  useEffect(() => {
    if (!selectedItem) {
      onItemSelect(null, []);
    }
  }, [selectedItem]);

  // remove offers on click of button remove offers
  useEffect(() => {
    if (isOfferRemoved) {
      onItemSelect(null, []);
      dispatch(customerOfferActions.handleRemoveOffer(false)); // set isRemoveOffer state to default
    }
  }, [isOfferRemoved]);

  const autoEvdColumn = Sizing.x8;
  const invoiceColumn = Sizing.x6;
  const keysArray = PROPERTIES.AUTO_EVD.autoEvdHeader;
  const keysInvoiceArray = PROPERTIES.CUSTOMER_INVOICE.invoiceHeader;

  const getRenderItem = (listData: DealerData) => {
    const data = Object.entries(listData).map(([key, value]) => ({
      key,
      value,
    }));

    // Filter and map the data to return an array of key-value pairs

    const filteredData = keysArray
      .map((key) => {
        // Find the item in data with the matching key
        const item = data.find((d) => d.key === key);

        return item ? { key: item.key, value: item.value } : null; // Return object or null if not found
      })
      .filter((item) => item !== null); // Remove any null entries if no match was found
    filteredData.push({ key: PROPERTIES.AUTO_EVD.tableHeaderAction, value: '' });

    const filteredInvoiceData = keysInvoiceArray
      .map((key) => {
        // Find the item in data with the matching key
        const item = data.find((d) => d.key === key);

        return item ? { key: item.key, value: item.value } : null; // Return object or null if not found
      })
      .filter((item) => item !== null); // Remove any null entries if no match was found
    filteredInvoiceData.push({ key: PROPERTIES.CUSTOMER_INVOICE.tableHeaderAction, value: '' });

    switch (listType) {
      case t('strings.autoEvdDealers'):
        return inflection === BreakPoints.LG || inflection === BreakPoints.MD || inflection === BreakPoints.XL ? (
          <List
            key={autoEvdColumn}
            data={filteredData}
            numColumns={autoEvdColumn}
            columnWrapperStyle={styles.subColumnWrapper}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.tableContainer,
                  { borderRightWidth: index === filteredData.length - 1 ? 0 : 1, height: i18n.language !== STRINGS.EN ? Sizing.layout.x40 : Sizing.layout.x35 },
                ]}
              >
                <View style={styles.row}>
                  <Text
                    label={
                      item.key === STRINGS.AVERAGE_DAILY_RECHARGE && !Number.isNaN(item.value)
                        ? `${item.value % Sizing.x1 === Sizing.x0 ? parseInt(item.value, Sizing.x10) : parseFloat(item.value).toFixed(Sizing.x2)}`
                        : item.value
                    }
                    style={[styles.cell, styles[item.key], i18n.language !== STRINGS.EN && { lineHeight: Typography.lineHeight.x18.lineHeight }]}
                  />
                </View>
                {index === filteredData.length - 1 && (
                  <View style={styles.buttonContainer}>
                    <Button
                      fontSize={i18n.language === STRINGS.TA ? Sizing.layout.x11 : Sizing.layout.x12}
                      style={[styles.buttonStyle, { maxHeight: i18n.language !== STRINGS.EN ? Sizing.layout.x35 : Sizing.layout.x30 }]}
                      labelStyle={[styles.buttonLabelStyle, i18n.language === STRINGS.TA && { ...Typography.lineHeight.x12 }]}
                      label={listData.thresholdSetNT === MODAL.Y ? t('strings.updateAutoEvd') : t('strings.setAutoEvd')}
                      onPress={() => handleButtonPress(listData)}
                    />
                  </View>
                )}
              </View>
            )}
          />
        ) : (
          <DealerEvdDetails data={listData} onButtonPress={handleButtonPress} />
        );

      case t('strings.customerOffers'):
        return (
          <AddPackageOffer
            data={listData}
            isOfferAdded={listData.name ? selectedItem?.item?.name === listData.name : selectedItem?.item?.offerType === listData.offerType}
            onAddOffer={() => handleAddOffer(listData)}
            onRemoveOffer={() => onItemSelect(null, [])}
            onViewDetails={() => handleViewDetails(listData)}
            offerType={OFFER_TYPE[selectedOffer?.type as keyof typeof OFFER_TYPE]}
          />
        );
      case t('strings.invoiceTransaction'):
        return inflection === BreakPoints.LG || inflection === BreakPoints.MD || inflection === BreakPoints.XL ? (
          <List
            key={invoiceColumn}
            data={filteredInvoiceData}
            numColumns={invoiceColumn}
            columnWrapperStyle={styles.subColumnWrapper}
            renderItem={({ item, index }) => (
              <View style={[styles.tableContainer, { borderRightWidth: index === filteredInvoiceData.length - 1 ? 0 : 1 }]}>
                <View style={styles.row}>
                  <Text label={item.value} style={[styles.cell, styles[item.key]]} />
                </View>
                {index === filteredInvoiceData.length - 1 && (
                  <View style={styles.buttonContainer}>
                    <Button
                      fontSize={PROPERTIES.LANG_LIST_SOUTH.includes(i18n.language) ? Sizing.layout.x11 : Sizing.layout.x12}
                      style={styles.buttonStyle}
                      label={t('strings.downloadInvoice')}
                      onPress={() => handleDownloadInvoice(listData)}
                      iconName={ICONS.FILE_DOWNLOAD}
                      iconPosition={STYLES.POSITION.LEFT}
                      iconHeight={Sizing.layout.x1Dot5}
                      iconWidth={Sizing.layout.x1Dot5}
                      iconStyle={styles.primaryIconStyle}
                      labelStyle={PROPERTIES.LANG_LIST_SOUTH.includes(i18n.language) && styles.invoiceLabel}
                    />
                  </View>
                )}
              </View>
            )}
          />
        ) : (
          <InvoiceTransactions data={listData} />
        );
      default:
        return null;
    }
  };

  const numberOfColumns = useMemo(() => Sizing.x1, [inflection]);

  const TableRow = ({ item, column }: ParentObject) => (
    <Text
      numberOfLines={2}
      maxFontSize={i18n.language !== STRINGS.EN ? Typography.fontSize.x12.fontSize : Typography.fontSize.x14.fontSize}
      fontSize={i18n.language !== STRINGS.EN ? Typography.fontSize.x12.fontSize : Typography.fontSize.x14.fontSize}
      style={[styles.headerCell, styles[column]]}
      label={item ? t(`strings.${item}`) : ''}
    />
  );

  const [isScrollbarVisible, setIsScrollbarVisible] = useState<boolean>(false);
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Determine scrollbar visibility
  const checkScrollbar = () => {
    setIsScrollbarVisible(contentHeight > layoutHeight);
  };

  // Handle layout change event
  const handleLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout; // Access layout correctly
    setLayoutHeight(height);
    checkScrollbar();
  };

  // Handle content size change event
  const handleContentSizeChange = (_width: number, height: number) => {
    setContentHeight(height);
    checkScrollbar();
  };

  return (
    <>
      {listType === SEARCH_LIST.AUTO_EVD_DEALERS && (inflection === BreakPoints.LG || inflection === BreakPoints.MD || inflection === BreakPoints.XL) && (
        <View style={styles.listHeader}>
          <List
            key={autoEvdColumn}
            data={keysArray}
            numColumns={autoEvdColumn}
            columnWrapperStyle={[styles.subColumnWrapper, styles.subColumnWrapperHeader]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.tableContainer,
                  { borderRightWidth: index === keysArray.length - 1 ? 0 : 1, height: i18n.language !== STRINGS.EN ? Sizing.layout.x40 : Sizing.layout.x35 },
                ]}
              >
                <View style={styles.headerRow}>
                  <TableRow
                    item={
                      (item === PROPERTIES.AUTO_EVD.autoEvdHeader[1] && PROPERTIES.AUTO_EVD.evdDetailsSearchKeys[0]) ||
                      (item === PROPERTIES.AUTO_EVD.autoEvdHeader[0] && PROPERTIES.AUTO_EVD.evdDetailsSearchKeys[2]) ||
                      item
                    }
                    column={`${item}H`}
                  />
                  {index !== keysArray.length - 1 && <Text label="" />} {/* Only show blank Text for non-last items */}
                </View>
              </View>
            )}
          />
        </View>
      )}
      {listType === SEARCH_LIST.INVOICE_TRANSACTION && (inflection === BreakPoints.LG || inflection === BreakPoints.MD || inflection === BreakPoints.XL) && (
        <View style={styles.listHeader}>
          <List
            key={invoiceColumn}
            data={keysInvoiceArray}
            numColumns={invoiceColumn}
            columnWrapperStyle={[styles.subColumnWrapper, styles.subColumnWrapperHeader]}
            renderItem={({ item, index }) => (
              <View style={[styles.tableContainer, { borderRightWidth: index === keysInvoiceArray.length - 1 ? 0 : 1 }]}>
                <View style={styles.headerRow}>
                  <TableRow item={item} column={`${item}H`} />
                  {index !== keysInvoiceArray.length - 1 && <Text label="" />}
                </View>
              </View>
            )}
          />
        </View>
      )}

      <View
        style={[
          styles.listWrapper,
          styles[gcs('listWrapper', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          listType === t('strings.autoEvdDealers') && styles.listWrapperAutoEvd,
          listType === t('strings.invoiceTransaction') && styles.listWrapperInvoiceTransaction,
        ]}
      >
        <List
          testID="searchBarItemTest"
          key={numberOfColumns}
          data={itemsArr ?? listItems}
          numColumns={numberOfColumns}
          columnWrapperStyle={numberOfColumns > 1 ? styles.columnWrapper : undefined}
          renderItem={({ item }) => getRenderItem(item)}
          style={[listType === SEARCH_LIST.CUSTOMER_OFFERS ? styles.offersListData : styles.listData, { marginRight: isScrollbarVisible ? -5 : 0 }]}
          onLayout={handleLayout}
          onContentSizeChange={handleContentSizeChange}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text label={listType === SEARCH_LIST.CUSTOMER_OFFERS ? t('strings.noOffersApplicable') : t('strings.noItemAvailable')} fontSize={Sizing.layout.x20} />
            </View>
          }
        />
      </View>
    </>
  );
};

export default SearchBarItems;
