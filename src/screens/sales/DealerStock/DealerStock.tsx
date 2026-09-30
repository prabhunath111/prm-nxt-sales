/**
 * This screen will show dealer stocks and filters
 *
 * @module components/DealerStock
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { Button, Dropdown, Image, Search, TableWrapper, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { Colors, Sizing } from 'styles';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, PROPERTIES, STRINGS } from 'const';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import useNavigate from 'hooks/useNavigate';
import { getWindowWidth } from 'styles/dimentionHelper';
import uiActions from 'store/sales/actions/ui';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './DealerStock.styles';

/**
 * Represents a DealerStock component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const DealerStock = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { goBack } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const { stockList, productTypeDropdownList, multiCheckboxStockFilter } = useSelector((state: RootState) => state.dealerStock);
  const [filterCount, setFilterCount] = useState(0);
  const [selectedPartner, setSelectedPartner] = useState<{ name: string; value: string }>();
  const { tableColumns }: any = PROPERTIES.DEALER_STOCK;
  const filteredStock = multiCheckboxStockFilter?.multiCheckboxStockFilter;

  const [filteredDealerStocks, setFilteredDealerStocks] = useState<any[]>([]);

  useEffect(() => {
    setFilterCount(filteredStock?.length || 0);
    if (!stockList?.dealerStocks) {
      setFilteredDealerStocks([]);
      return;
    }
    let filtered = [...stockList.dealerStocks];
    let isFilterApplied = false;
    // 1. Search filter
    if (searchQuery.trim()) {
      isFilterApplied = true;
      filtered = filtered.filter(
        (item) => item?.product?.toLowerCase().includes(searchQuery.toLowerCase()) || item?.purchaseCode?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    // 2. Partner filter
    if (selectedPartner?.value && selectedPartner?.value.toLowerCase() !== STRINGS.All) {
      isFilterApplied = true;
      filtered = filtered.filter((item) => item?.productType?.toLowerCase() === selectedPartner?.value.toLowerCase());
    }
    // 3. Stock filters
    if (filteredStock?.length > 0) {
      const allFilter = filteredStock.find((f: ParentObject) => f.id === STRINGS.ALL.toLowerCase());
      const lessStockFilter = filteredStock.find((f: ParentObject) => f.id === STRINGS.LESS_STOCK_IN_HAND);
      const greaterStockFilter = filteredStock.find((f: ParentObject) => f.id === STRINGS.GREATER_STOCK_IN_HAND);
      if (allFilter) {
        // Show all data - no filtering
      } else if (greaterStockFilter) {
        isFilterApplied = true;
        filtered = filtered.filter((item) => {
          const stockInHand = item.stockInHand || 0;
          const suggestedQty = item.xTslSugestedQty;
          return suggestedQty !== null && stockInHand > suggestedQty;
        });
      } else if (lessStockFilter) {
        isFilterApplied = true;
        filtered = filtered.filter((item) => {
          const stockInHand = item.stockInHand || 0;
          const suggestedQty = item.xTslSugestedQty;
          return suggestedQty !== null && stockInHand < suggestedQty;
        });
      }
    }
    setFilteredDealerStocks(isFilterApplied ? filtered : stockList.dealerStocks);
  }, [searchQuery, selectedPartner, filteredStock, stockList?.dealerStocks]);

  const openFilter = () => {
    dispatch(callAction({}, FORMS.filterDealerStock));
  };

  const handleChangeDealer = () => {
    setSelectedPartner({ name: '', value: '' });
    setSearchQuery('');
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.DealerStock.DealerStockChangeDealer.moduleName, {
      [MoengageMixpanelModules.DealerStock.DealerStockChangeDealer.attributes.Status]: true,
    });
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.DEALER_STOCK,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.dealerStock,
        isCenterModal: true,
      }),
    );
  };

  return (
    <View style={styles.flex}>
      <ScrollView nestedScrollEnabled style={[styles.partnerScreen, styles[gcs('partnerScreen', inflection, true, ['md', 'lg', 'xl'])]]}>
        <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
          <View style={[styles.balanceContainer, styles.partnerContainer]}>
            <View style={[styles.partnerNameContainer, styles[gcs('partnerNameContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              <View style={styles.rowContainer}>
                <View style={styles.textDetails}>
                  <Text style={styles.smallTextStyle} label={t(`strings.mdn`)} />
                  <Text style={styles.mediumTextStyle} label={stockList?.mdn} />
                </View>
                <View style={styles.verticalSeparator} />
                <View style={styles.textDetails}>
                  <Text style={styles.smallTextStyle} label={t(`strings.dealerFosName`)} />
                  <Text style={styles.mediumTextStyle} label={stockList?.name} />
                </View>
              </View>
              <View style={getWindowWidth() > Sizing.layout.x660 ? styles.verticalSeparator : styles.horizontalSeparator} />
              <View style={styles.rowContainer}>
                <View style={styles.textDetails}>
                  <Text style={styles.smallTextStyle} label={t(`strings.dealerStockBalance`)} />
                  <Text style={styles.mediumTextStyle} label={stockList?.evdBalance} />
                </View>
                <View style={styles.verticalSeparator} />
                <View style={styles.textDetails}>
                  <Text style={styles.smallTextStyle} label={t(`strings.evdCode`)} />
                  <View style={styles.flexRow}>
                    <Text style={styles.mediumTextStyle} label={stockList?.userId} />
                    <Pressable style={styles.editIconStyle} onPress={() => handleChangeDealer()}>
                      <Image iconName={ICONS.EDIT_PENCIL} height={Sizing.layout.x14} width={Sizing.layout.x14} isDimension={false} />
                      <Text style={styles.changeDealer}>{t('strings.changeDealer')}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.searchFilterContainer}>
            <Search placeholder={t('strings.search')} searchStyles={styles.minWidthContainer} value={searchQuery} onChange={setSearchQuery} />
            {getWindowWidth() >= Sizing.layout.x660 && (
              <View style={styles.labelDropDownContainer}>
                <Dropdown
                  placeholder={t(`strings.productType`)}
                  placeholderTextColor={Colors.violet.v200}
                  innerContainerStyle={styles.innerDropDown}
                  data={productTypeDropdownList?.productTypes}
                  hasStaticValues
                  selectedValue={selectedPartner}
                  onSelect={(val: { name: string; value: string }) => setSelectedPartner(val)}
                  iconStyle={styles.dropdowniconStyle}
                />
              </View>
            )}
            <Pressable testID="filter-icon" style={styles.iconContainer} onPress={() => openFilter()}>
              <Image iconName={ICONS.FILTER_ICON} width={Sizing.layout.x24} height={Sizing.layout.x24} isDimension={false} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{filterCount}</Text>
              </View>
            </Pressable>
          </View>
          {getWindowWidth() <= Sizing.layout.x660 && (
            <View style={styles.labelDropDownContainer}>
              <Dropdown
                placeholder={t(`strings.productType`)}
                placeholderTextColor={Colors.violet.v200}
                innerContainerStyle={styles.innerDropDown}
                data={productTypeDropdownList?.productTypes}
                hasStaticValues
                selectedValue={selectedPartner}
                onSelect={(val: { name: string; value: string }) => setSelectedPartner(val)}
                iconStyle={styles.dropdowniconStyle}
              />
            </View>
          )}
        </View>
        <View style={[styles.listContainer, styles[gcs('listContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          {filteredDealerStocks?.length > 0 ? (
            <TableWrapper
              tableColumns={tableColumns}
              tableData={filteredDealerStocks}
              isDashboardTable
              headerStyle={styles.centeredHeader}
              isTsraTable={false}
              parentSize={getWindowWidth() - getWindowWidth() * 0.23}
            />
          ) : (
            <Text style={styles.errorStyle}>{t('errors.stockDetailsNotAvailable')}</Text>
          )}
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          type="secondary"
          outline
          fontSize={Sizing.layout.x16}
          label={t('strings.back')}
          isDimension={false}
          onPress={() => goBack()}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(DealerStock);
