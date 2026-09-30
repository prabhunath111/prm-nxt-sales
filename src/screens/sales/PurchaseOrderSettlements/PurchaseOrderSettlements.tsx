/**
 * this is show the payment sattlemts
 *
 * @module components/PurchaseOrderSettlements
 * @memberof - View Component
 */
import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { gcs } from 'styles/webBreakpoints';
import useNavigate from 'hooks/useNavigate';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import uiActions from 'store/sales/actions/ui';
import { Button, Dropdown, DynamicTable, Image, Search, Text } from 'components/sales';
import { Sizing } from 'styles';
import { CHILD_TYPE, ICONS, PROPERTIES } from 'const';
import { QUERY, ROUTE, STRINGS } from 'const/strings';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { callAction } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import Autocomplete from 'components/sales/Autocomplete';
import styles from './PurchaseOrderSettlements.styles';
/**
 * Component prop types.
 *
 * @typedef {object} PurchaseOrderSettlementsProps
 * @property {string} [text] - The text to display inside the component.
 */
type DropdownItem = {
  id: string;
  name: string;
};
type DetailsData = {
  year: DropdownItem[];
  month: DropdownItem[];
  date: DropdownItem[];
};
/**
 * Represents a PurchaseOrderSettlements component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const PurchaseOrderSettlements = () => {
  const [currentDateState, setCurrentDate] = useState<DropdownItem>({ id: '', name: '' });
  const [currentMonthState, setCurrentMonth] = useState<DropdownItem>({ id: '', name: '' });
  const [currentYearState, setCurrentYear] = useState<DropdownItem>({ id: '', name: '' });
  const [selectedDealerId, setSelectedDealerId] = useState<string>();
  const [detailsData, setDetailsData] = useState<DetailsData>({ year: [], month: [], date: [] });
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const { selectedDate } = useSelector((state: RootState) => state.storeDashboard);
  const { tableFilteredData } = useSelector((state: RootState) => state.common);
  const { tableColumn, settlementsData } = useSelector((state: RootState) => state.purchaseOrder);
  const dispatch = useDispatch<AppDispatch>();
  const fetchSettlements = (year: string, month: string, date: string) => {
    dispatch(callAction({ year, month, date }, QUERY.FetchSettlements));
  };
  const parseSelectedDate = (dateStr: string) => {
    const [year, month, date] = dateStr.split('-');
    return {
      year,
      monthIndex: String(Number(month) - 1),
      date: String(Number(date)),
    };
  };
  const handelDateDropDownChange = (value: ParentObject) => {
    setCurrentDate({ id: value.id, name: value.name });
    fetchSettlements(currentYearState.id, currentMonthState?.id, value.id);
  };
  const handelMonthDropDownChange = (value: ParentObject) => {
    setCurrentMonth({ id: value?.id, name: value.name });
    fetchSettlements(currentYearState.id, value.id, currentDateState.id);
  };
  const handelYearDropDownChange = (value: ParentObject) => {
    setCurrentYear({ id: value.id, name: value.name });
    fetchSettlements(value.id, currentMonthState?.id, currentDateState.id);
  };

  const handelCalender = () => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.SIMPLE_CALENDER,
        headerTitle: t('strings.selectDate'),
        showHeader: true,
        buttonInfo: {
          isMultiDates: false,
        },
      }),
    );
  };

  useEffect(() => {
    if (!selectedDate || !detailsData.year.length) return;

    const { year, monthIndex, date } = parseSelectedDate(selectedDate);

    const yearObj = detailsData.year.find((y) => y.id === year);
    const monthObj = detailsData.month.find((m) => m.id === monthIndex);
    const dateObj = detailsData.date.find((d) => d.id === date);

    if (yearObj) setCurrentYear(yearObj);
    if (monthObj) setCurrentMonth(monthObj);
    if (dateObj) setCurrentDate(dateObj);

    fetchSettlements(year, monthIndex, date);
  }, [selectedDate, detailsData.year.length]);

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    const currentDate = now.getDate();
    setCurrentDate({ id: String(currentDate), name: String(currentDate) });
    setCurrentYear({ id: String(currentYear), name: String(currentYear) });
    setCurrentMonth({ id: String(currentMonthIndex), name: PROPERTIES.TOTAL_MONTHS[currentMonthIndex] });
    const recentMonths = Array.from({ length: 12 }, (_, i) => ({
      id: String(i),
      name: PROPERTIES.TOTAL_MONTHS[i],
    }));
    const years = Array.from({ length: 6 }, (_, i) => ({
      id: String(currentYear - i),
      name: String(currentYear - i),
    }));
    const dates = [
      { id: '', name: 'All' },
      ...Array.from({ length: 31 }, (_, i) => ({
        id: String(i + 1),
        name: String(i + 1),
      })),
    ];
    setDetailsData((prev) => ({
      ...prev,
      month: recentMonths,
      year: years,
      date: dates,
    }));
  }, []);

  const handleBack = () => {
    navigate(ROUTE.WEB.PURCHASE_ORDER_REQUEST);
  };

  const filteredTableData = useMemo(() => {
    if (!selectedDealerId || selectedDealerId === STRINGS.ALL) return tableFilteredData;
    return tableFilteredData.filter((row: ParentObject) => row.dealerCode === selectedDealerId);
  }, [tableFilteredData, selectedDealerId]);

  const handelDropDownChange = (item: ParentObject) => {
    setSelectedDealerId(item?.value);
  };
  return (
    <SafeAreaView style={[styles.container]} testID="SelectBox">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <View style={styles.settlementAmount}>
            <Text fontSize={Sizing.layout.x20}>{t('strings.totalSettlementAmount')}</Text>
            <Text fontSize={Sizing.layout.x20} style={styles.amountStyle}>
              <Image iconName={ICONS.RUPEE_SYMBOL} height={Sizing.layout.x15} width={Sizing.layout.x20} isDimension={false} style={styles.amountStyle} />
              {settlementsData?.totalAmount ?? '0'}
            </Text>
          </View>
          <View style={styles.dropdownContanier}>
            <Dropdown data={detailsData.year} queryParams="searchLocally" onSelect={handelYearDropDownChange} placeholder={t('strings.year')} selectedValue={currentYearState} />
            <Dropdown
              data={detailsData.month}
              queryParams="searchLocally"
              onSelect={handelMonthDropDownChange}
              placeholder={t('strings.month')}
              selectedValue={currentMonthState}
            />
            <Dropdown data={detailsData.date} queryParams="searchLocally" onSelect={handelDateDropDownChange} placeholder={t('strings.date')} selectedValue={currentDateState} />
            <Pressable onPress={handelCalender} testID="btn-calendar">
              <Image iconName={ICONS.CALENDAR_PINK} height={Sizing.layout.x20} width={Sizing.layout.x20} isDimension={false} style={styles.amountStyle} />
            </Pressable>
          </View>
          <View>
            {settlementsData?.dealers?.length > 0 ? (
              <Autocomplete
                data={settlementsData?.dealers}
                onSelect={handelDropDownChange}
                isCloseIconRequired={false}
                queryParams="searchLocally"
                actionNeeded={false}
                placeholder={t('strings.filterByDealer')}
                isReadOnly
                testID="autocomplete-dealer"
              />
            ) : null}
          </View>
          <View style={styles.searchContainer}>
            {tableFilteredData?.length > 0 ? <Search queryName={tableFilteredData?.length > 0 ? 'searchSettlements' : ''} placeholder="Search..." /> : null}
          </View>
          <View style={styles.alignItemCenter}>
            {filteredTableData?.length > 0 ? (
              <DynamicTable columns={tableColumn} data={filteredTableData} listStyle={styles.heightAdjust} />
            ) : (
              <Text style={styles.alignCenter} label={t('errors.noSettlementsFound')} />
            )}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          type="secondary"
          outline
          fontSize={Sizing.layout.x16}
          label={t('modal.back')}
          isDimension={false}
          onPress={() => handleBack()}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(PurchaseOrderSettlements);
