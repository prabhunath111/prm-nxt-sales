/**
 * details for transactions
 *
 * @module components/Transaction
 * @memberof - View Component
 */
import React, { memo, useEffect, useRef, useState } from 'react';
import { View, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Dropdown, Search, Text, TransactionCard } from 'components/sales';
import { dropdown } from 'styles/forms';
import { useTranslation } from 'react-i18next';
import { CHILD_TYPE, FIELD_TYPE, PROPERTIES, QUERY, STRINGS } from 'const';
import { getScreenWidth } from 'styles/dimentionHelper';
import { Sizing } from 'styles';
// import List from 'components/sales/List';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import homePageActions from 'store/sales/actions/homePage';
import { DataItem } from 'components/sales/Dropdown';
import { ParentObject } from 'store/sales/types/common';
import uiActions from 'store/sales/actions/ui';
import { useDebounce } from 'hooks/useDebounce';
import commonActions from 'store/sales/actions/common';
import TransactionDetails from '../TransactionDetails';
import styles from './Transaction.styles';

const PAGE_SIZE = 20;

/**
 * Represents a Transaction component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */

const Transaction = () => {
  const screenWidth = getScreenWidth();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const isMobileView = screenWidth <= Sizing.layout.x500;
  // const { customFormData } = useSelector((state: RootState) => state.common);
  const { transactionData, transactionsDetails, daysFilter, statusFilter, paymentType, transactionAmount } = useSelector((state: RootState) => state.homePage);
  const { customFormData } = useSelector((state: RootState) => state.common);

  const defaultValues = {
    requestObject: {
      dateFilter: { name: t('strings.date') },
      status: { name: t('strings.status') },
      amountFilter: { name: t('strings.transactionAmount') },
      paymentType: { name: t('strings.paymentType') },
    },
    values: {
      dateFilter: '',
      status: '',
      amountFilter: '',
      paymentType: '',
    },
  };
  const [requestObject, setRequestObject] = useState<ParentObject>(defaultValues.requestObject);
  const [values, setValues] = useState<ParentObject>(defaultValues.values);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  type InputChangeProps = {
    name: string;
    value: any;
    queryName?: string;
    fieldType?: string;
    queryParam?: string | undefined;
  };

  // const getFtdData = async () => {
  //   if (loading || !hasMore) return;
  //   setLoading(true);

  //   dispatch(homePageActions.getTransactionSummary(QUERY.GetTransactionSummary, {page}));

  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // fake delay

  //   // setData(prev => [...prev, ...newItems]);
  //   setPage(prev => prev + 1);
  //   setLoading(false);

  //   // Stop pagination if limit reached
  //   if (transactionsDetails.length < PAGE_SIZE) setHasMore(false);

  // };

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageloading, setPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const isInitialRender = useRef(true);

  // 1️ Fetch paginated data
  const loadMoreData = async () => {
    if (loading || !hasMore || isFilterApplied || filteredList?.length <= 0) return;
    setLoading(true);
    const nextPage = page + 1; // compute manually from state
    await dispatch(homePageActions.getTransactionSummaryWithFilter(QUERY.GetTransactionSummaryWithFilter, { ...values, page: nextPage }));

    setPage(nextPage);
  };
  const getTransactionSummary = async () => {
    await dispatch(homePageActions.getTransactionSummary(QUERY.GetTransactionSummary, { page }));
  };

  // 2️ Initial load
  useEffect(() => {
    getTransactionSummary();
  }, []);

  // 3️ When new data arrives update filtered list
  useEffect(() => {
    setFilteredList((prev) => (isFilterApplied ? [...(transactionsDetails || [])] : [...prev, ...(transactionsDetails || [])]));
    if (transactionsDetails && transactionsDetails.length % PAGE_SIZE !== 0) {
      setHasMore(false);
    }
    setIsFilterApplied(false);
    setLoading(false);
    setPageLoading(false);
    // reset back to pagination mode
  }, [transactionsDetails]);

  const handleChange = ({ name, value, fieldType }: InputChangeProps) => {
    if (fieldType === FIELD_TYPE.DROPDOWN && value.nameNT === 'Custom date range') {
      setTimeout(() => {
        dispatch(
          uiActions.showBottomModal({
            isModalVisible: true,
            type: CHILD_TYPE.CUSTOM_DATE_PICKER,
            headerTitle: t(`strings.${PROPERTIES.EVD_MDN_CHANGE_DETAILS.dateRangeTitle}`),
            showCloseIcon: true,
            showHeader: true,
            data: { name, value },
            buttonInfo: {
              isDateRangePicker: true,
              defaultDateSelection: 90,
              isMultiDates: true,
            },
          }),
        );
      }, 500);
    } else {
      setPageLoading(true);
      setIsFilterApplied(true);
      if (name === STRINGS.DATE_FILTER) {
        dispatch(commonActions.resetCustomFormData());
      }
      const updatedObj = { ...requestObject, [name]: value };
      setRequestObject(updatedObj);
    }
    setValues((prevValues) => ({
      ...prevValues,
      [name]: fieldType === FIELD_TYPE.DROPDOWN ? value.object.valueNT : value,
    }));
  };

  const debouncedSearch = useDebounce((text: string) => {
    handleChange({
      name: 'searchKeyword',
      value: text,
      fieldType: FIELD_TYPE.INPUT,
    });
  }, 500);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (!requestObject) return;
    setPageLoading(true);
    setPage(1);
    setHasMore(true);
    setIsFilterApplied(true);
    const hasCustomDate = customFormData?.evdMdnChangeFilter?.customDateRange?.startDate && customFormData?.evdMdnChangeFilter?.customDateRange?.endDate;

    const apiPayload = {
      page: 1,
      ...values,
      customFromDate: hasCustomDate ? customFormData.evdMdnChangeFilter.customDateRange.startDate : null,
      customToDate: hasCustomDate ? customFormData.evdMdnChangeFilter.customDateRange.endDate : null,
    };
    setValues((prevValues) => ({
      ...prevValues,
      ...apiPayload,
    }));
    dispatch(homePageActions.getTransactionSummaryWithFilter(QUERY.GetTransactionSummaryWithFilter, apiPayload));
  }, [requestObject, customFormData]);
  return (
    <View style={styles.container} testID="transactionTest">
      <View style={styles.innerContainer}>
        <View style={styles.transactionStyle}>
          <Text label={t('strings.lastUpdatedOnText') + transactionData.lastUpdatedOn} />
        </View>
        <View style={isMobileView ? styles.filterContainerMobile : styles.filterContainer}>
          <View style={styles.TransactionCardContainer}>
            <TransactionCard
              headerText={transactionData?.headerText}
              primaryText={transactionData?.primaryText}
              secondaryText={transactionData?.secondaryText}
              tertiaryText={transactionData?.tertiaryText}
              quaternaryText={transactionData?.quaternaryText}
            />
          </View>
        </View>
        {isMobileView ? (
          <View style={styles.filterContainerMobile}>
            <Search onChange={(text) => debouncedSearch(text)} placeholder={t('strings.searchPlaceholder')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.dropdownContainer}>
                <Dropdown
                  data={daysFilter}
                  selectedValue={requestObject.dateFilter}
                  onSelect={(item: DataItem) => {
                    handleChange({ name: 'dateFilter', value: item, fieldType: FIELD_TYPE.DROPDOWN });
                  }}
                  placeholder={t('strings.date')}
                  innerContainerStyle={dropdown.secondary}
                />

                <Dropdown
                  data={statusFilter}
                  selectedValue={requestObject.status}
                  onSelect={(item: DataItem) => {
                    handleChange({ name: 'status', value: item, fieldType: FIELD_TYPE.DROPDOWN });
                  }}
                  placeholder={t('strings.status')}
                  innerContainerStyle={dropdown.secondary}
                />

                <Dropdown
                  data={paymentType}
                  selectedValue={requestObject.paymentType}
                  onSelect={(item: DataItem) => {
                    handleChange({ name: 'paymentType', value: item, fieldType: FIELD_TYPE.DROPDOWN });
                  }}
                  placeholder={t('strings.paymentType')}
                  innerContainerStyle={dropdown.secondary}
                />
                <Dropdown
                  data={transactionAmount}
                  selectedValue={requestObject.amountFilter}
                  onSelect={(item: DataItem) => {
                    handleChange({ name: 'amountFilter', value: item, fieldType: FIELD_TYPE.DROPDOWN });
                  }}
                  placeholder={t('strings.transactionAmount')}
                  innerContainerStyle={dropdown.secondary}
                />
              </View>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.filterContainer}>
            <View style={styles.searchContatiner}>
              <Search
                onChange={(text) => debouncedSearch(text)}
                placeholder={t('strings.searchPlaceholder')}
                // searchStyles={styles.searchStyle}
                inputFeildStyle={styles.searchStyle}
                innerContainer={styles.searchStyle}
              />
            </View>
            <Dropdown
              data={daysFilter}
              selectedValue={requestObject.dateFilter}
              onSelect={(item: DataItem) => {
                handleChange({ name: 'dateFilter', value: item, fieldType: FIELD_TYPE.DROPDOWN });
              }}
              placeholder={t('strings.date')}
              innerContainerStyle={dropdown.secondary}
            />

            <Dropdown
              data={statusFilter}
              selectedValue={requestObject.status}
              onSelect={(item: DataItem) => {
                handleChange({ name: 'status', value: item, fieldType: FIELD_TYPE.DROPDOWN });
              }}
              placeholder={t('strings.status')}
              innerContainerStyle={dropdown.secondary}
            />

            <Dropdown
              data={paymentType}
              selectedValue={requestObject.paymentType}
              onSelect={(item: DataItem) => {
                handleChange({ name: 'paymentType', value: item, fieldType: FIELD_TYPE.DROPDOWN });
              }}
              placeholder={t('strings.paymentType')}
              innerContainerStyle={dropdown.secondary}
            />
            <Dropdown
              data={transactionAmount}
              selectedValue={requestObject.amountFilter}
              onSelect={(item: DataItem) => {
                handleChange({ name: 'amountFilter', value: item, fieldType: FIELD_TYPE.DROPDOWN });
              }}
              placeholder={t('strings.transactionAmount')}
              innerContainerStyle={dropdown.secondary}
            />
          </View>
        )}
        <View style={styles.transactionContainer}>
          {/* <List style={styles.transactionContainer} contentContainerStyle={styles.distance} data={filteredList} renderItem={({ item }) => <TransactionDetails {...item} />} /> */}
          {/* <FlatList
            style={styles.transactionContainer} 
            contentContainerStyle={styles.distance}
            data={filteredList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionDetails {...item} />}
            onEndReached={getFtdData}
            onEndReachedThreshold={0.5} // Trigger earlier
            ListFooterComponent={
              loading ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
            }
          /> */}
          {pageloading ? (
            <View style={styles.centerStyle}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              testID="transaction-list"
              data={filteredList}
              keyExtractor={(item, index) => item.transactionId + index}
              renderItem={({ item }) => <TransactionDetails {...item} />}
              onEndReached={loadMoreData}
              onEndReachedThreshold={0.2}
              ListEmptyComponent={
                <View>
                  <Text label={t('strings.noItemAvailable')} fontSize={Sizing.layout.x20} />
                </View>
              }
              ListFooterComponent={loading && hasMore ? <ActivityIndicator size="small" style={{ marginVertical: 16 }} /> : null}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(Transaction);
