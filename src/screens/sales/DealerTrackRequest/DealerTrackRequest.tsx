import React, { memo, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { DynamicTable, Search, Text, Dropdown, IconTextInput, Button } from 'components/sales';
import { Colors } from 'styles';
import uiActions from 'store/sales/actions/ui';
import { gcs } from 'styles/webBreakpoints';
import { t } from 'i18next';
import { CHILD_TYPE, ICONS, PROPERTIES, ROUTE, STYLES } from 'const';
import { ParentObject } from 'store/sales/types/common';
import useNavigate from 'hooks/useNavigate';
import styles from './DealerTrackRequest.styles';

const DealerTrackRequest = () => {
  const { inflection } = useInflection();
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { customFormData } = useSelector((state: RootState) => state.common);
  const { tableColumn, tableRowData } = useSelector((state: RootState) => state.dealerHelp);

  const [status, setStatus] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filteredData, setFilteredData] = useState(tableRowData);

  const parseDate = (dateStr?: string) => {
    if (!dateStr) return 0;

    // Remove .0 if present
    const cleanDate = dateStr.replace('.0', '');

    // If format is dd/mm/yyyy
    if (cleanDate.includes('/')) {
      const [day, month, year] = cleanDate.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    }

    if (cleanDate.includes('-') && cleanDate.includes(':')) {
      const [datePart, timePart] = cleanDate.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute, second] = timePart.split(':');

      return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)).getTime();
    }
    // Otherwise fallback (ISO etc.)
    return new Date(cleanDate).getTime();
  };

  useEffect(() => {
    let result = [...tableRowData];

    if (searchQuery?.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (item: ParentObject) =>
          item?.srNumber?.toLowerCase().includes(query) ||
          item?.srTypeNT?.toLowerCase().includes(query) ||
          item?.raisedDate?.toLowerCase().includes(query) ||
          item?.srAreaNT?.toLowerCase().includes(query) ||
          item?.statusNT?.toLowerCase().includes(query),
      );
    }
    if (status?.id && status.id.toLowerCase() !== 'all') {
      result = result.filter((item: ParentObject) => item?.status?.trim().toLowerCase() === status?.name?.trim().toLowerCase());
    }

    const dateRange = customFormData?.evdMdnChangeFilter?.customDateRange;
    if (dateRange?.startDate && dateRange?.endDate) {
      const start = parseDate(dateRange.startDate);
      const endDateObj = new Date(parseDate(dateRange.endDate));
      endDateObj.setHours(23, 59, 59, 999);
      const end = endDateObj.getTime();
      result = result.filter((item: ParentObject) => {
        const itemDate = parseDate(item?.raisedDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    setFilteredData(result);
  }, [searchQuery, status, tableRowData, customFormData]);

  useEffect(() => {
    const dateRange = customFormData?.evdMdnChangeFilter?.customDateRange;
    if (dateRange?.startDate && dateRange?.endDate) {
      const from = dateRange.startDate;
      const to = dateRange.endDate;

      setSelectedDate(`${from} - ${to}`);
    } else {
      setSelectedDate('');
    }
  }, [customFormData]);

  const handleSelection = () => {
    // dispatch(actions.resetCustomFormData());
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.CUSTOM_DATE_PICKER,
        headerTitle: t(`strings.${PROPERTIES.EVD_MDN_CHANGE_DETAILS.dateRangeTitle}`),
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          isDateRangePicker: true,
          isMultiDates: true,
        },
      }),
    );
  };
  const translatedStatusOptions = PROPERTIES.STATUS_OPTIONS.STATUS.map((item) => ({
    ...item,
    name: t(`strings.${item.id}`),
  }));
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            // styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            // styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <View style={[styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
            <View style={styles.searchContainer}>
              <Search placeholder={t('strings.dealerSearchText')} value={searchQuery} onChange={setSearchQuery} />
            </View>

            <Text label={t('strings.filterBy')} style={styles.labelTextStyle} />
            <View style={styles.filterContainer}>
              <View style={styles.dropdownContainer}>
                <Pressable onPress={handleSelection}>
                  <IconTextInput
                    readOnly
                    value={selectedDate}
                    placeholder={t('strings.selectDate')}
                    placeholderTextColor={Colors.neutral.g300}
                    leftIconName={ICONS.CALENDAR_PINK}
                    containerStyle={[styles.filterInputBox, selectedDate && styles.selectedDatebox]}
                    multiline
                  />
                </Pressable>
              </View>
              <View style={styles.dropdownContainer}>
                <Dropdown
                  placeholder={t('strings.status')}
                  data={translatedStatusOptions}
                  selectedValue={status}
                  onSelect={setStatus}
                  innerContainerStyle={styles.filterInputBox}
                  hasStaticValues={false}
                />
              </View>
            </View>
          </View>

          <View style={styles.alignItemCenter}>
            {filteredData?.length > 0 ? <DynamicTable columns={tableColumn} data={filteredData} /> : <Text style={styles.alignCenter} label={t('errors.noDataFound')} />}
          </View>
        </View>
      </ScrollView>
      <View style={styles.backButton}>
        <Button
          type={STYLES.TYPE.SECONDARY}
          outline
          style={[styles.backButtonStyle, styles[gcs('backButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
          onPress={() => navigate(ROUTE.WEB.BINGE_RETAILER)}
          label={t('strings.back')}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(DealerTrackRequest);
