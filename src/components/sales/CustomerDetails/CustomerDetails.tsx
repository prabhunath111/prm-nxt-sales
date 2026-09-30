/**
 * full details of customer
 *
 * @module components/CustomerDetails
 * @memberof CommonComponent
 */

import React, { useEffect, useState, memo } from 'react';
import { View, TouchableOpacity, ViewStyle, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TextContainer, Image, Text, Button, DynamicTable } from 'components/sales';
import { ICONS, ROUTE, STRINGS, PROPERTIES } from 'const';
import { Colors, Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import { AMOUNT_NUMBER } from 'const/regexes';
import { sliceActions as transactionHistoryActions } from 'store/sales/reducer/transactionHistory';
import { filterSearchEvdBalance } from 'store/sales/actions/evdBalanceInfo/evdBalanceInfo.action';
import uiActions from 'store/sales/actions/ui';
import i18next from 'i18next';
import { sliceActions as evdActions } from 'store/sales/reducer/evdBalanceInfo';
import { itemType } from 'components/sales/TextContainer';
import useCurrentRoute from 'hooks/useCurrentRoute';
import styles from './CustomerDetails.styles';

type CustomerDataValue = string | number | null;
type CustomerData = {
  txnDate?: string;
} & Record<string, CustomerDataValue>;

type CustomerDetailsProps = {
  queryName: string;
  button?: boolean;
  inputFieldStyle?: ViewStyle;
};

const CustomerDetails = ({ queryName, inputFieldStyle, button = true }: CustomerDetailsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const { routeName } = useCurrentRoute();

  const [data, setData] = useState<CustomerData[]>([]);
  const [expandedIndexes, setExpandedIndexes] = useState<Record<number, boolean>>({});

  const [finalData, setFinalData] = useState<ParentObject>([]);
  const { filteredBalanceInfo, isFilterApplied } = useSelector((state: RootState) => state.evdBalanceInfo);
  const { tableFilteredData, tableColumns } = useSelector((state: RootState) => state.common);

  const screenWidth = Dimensions.get('window').width;
  const isWeb = screenWidth > Sizing.layout.x660;

  const handleFinalSubmit = (dataObj: CustomerData) => {
    dispatch(
      transactionHistoryActions.setTransactionHistoryDetails({
        data: {
          inTransId: dataObj.transactionID,
          subscriberId: dataObj.subscriberID,
          chargeableAmount: String(dataObj.creditAmount),
          requestDate: dataObj.txnDate,
        },
      }),
    );
    if (routeName === ROUTE.WEB.RECHARGE_TRANSACTION) {
      navigate(ROUTE.WEB.CONFIRM_REVERSAL_INFO);
    } else {
      navigate(ROUTE.WEB.CONFIRM_REVERSAL_INFO_FOS);
    }
  };

  useEffect(() => {
    if (!filteredBalanceInfo) return;
    const updated = filteredBalanceInfo?.transactions?.map((item: ParentObject) => ({
      ...item,
      transId: item?.transId === null ? 'null' : item?.transId,
    }));
    setFinalData(updated);
  }, [filteredBalanceInfo]);

  useEffect(() => {
    dispatch(callAction({}, queryName))?.then((response: ParentObject) => {
      if (Array.isArray(response?.transactions)) {
        setData(response.transactions as CustomerData[]);
        dispatch(evdActions.setFilteredBalanceInfo(response.transactions));
        dispatch(filterSearchEvdBalance({}));
      } else {
        setData([]);
      }
    });
  }, [dispatch, queryName]);

  const getRemainingDays = (txnDate: string): number => {
    if (!txnDate) return 0;
    const today = new Date();
    const txn = new Date(txnDate);

    const diffTime = today.getTime() - txn.getTime();
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, 3 - daysPassed);
  };

  const isWithinLast3Days = (dateString: string): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff <= 3 * 24 * 60 * 60 * 1000 && diff >= 0;
  };

  const formatValue = (value: string, key?: string) => {
    if (key === STRINGS.AMOUNT || key === STRINGS.CREDIT_AMOUNT || key === STRINGS.BONUS_AMOUNT || key === STRINGS.DEBIT_AMOUNT) {
      const raw = String(value ?? '').trim();
      const num = parseFloat(raw.replace(AMOUNT_NUMBER, ''));
      if (Number.isNaN(num)) return raw;
      const isTransferRoute = routeName === ROUTE.WEB.BALANCE_TRANSFER_DETAILS || routeName === ROUTE.WEB.BALANCE_TRANSFER_dETAILS_FOS;

      let sign = '';
      if (raw.startsWith('+') || raw.startsWith('-')) {
        sign = raw.charAt(0);
      } else if (num > 0) {
        sign = '+';
      } else if (num < 0) {
        sign = '-';
      }
      const tag = sign === '+' ? 'CR' : 'DR';
      return isTransferRoute ? `${tag} : ₹${sign}${Math.abs(num)}` : `₹${sign}${Math.abs(num)}`;
    }
    return value;
  };

  const getColorForValue = (value: string, key?: string) => {
    if (key === STRINGS.AMOUNT || key === STRINGS.CREDIT_AMOUNT || key === STRINGS.BONUS_AMOUNT || key === STRINGS.DEBIT_AMOUNT) {
      const raw = String(value ?? '').trim();
      if (raw.includes('-')) return { color: Colors.appColors.red };
      if (raw.includes('+')) return { color: Colors.appColors.green };
      return { color: Colors.neutral.black };
    }
    return { color: Colors.neutral.black };
  };

  const propertyMap: Record<string, itemType[]> = {
    [ROUTE.WEB.BALANCE_TRANSFER_DETAILS]: PROPERTIES.EVD_BALANCE_INFO_KEY.BALANCE_TRANSFER_DETAILS,
    [ROUTE.WEB.CONSOLIDATED_TRANSACTION]: PROPERTIES.EVD_BALANCE_INFO_KEY.CONSOLIDATED_TRANSACTIONS,
    [ROUTE.WEB.OTF_CREDIT_DETAILS]: PROPERTIES.EVD_BALANCE_INFO_KEY.OTF_CREDIT_DETAILS,
    [ROUTE.WEB.RECHARGE_TRANSACTION]: PROPERTIES.EVD_BALANCE_INFO_KEY.RECHARGE_TRANSACTION,
    [ROUTE.WEB.BALANCE_TRANSFER_dETAILS_FOS]: PROPERTIES.EVD_BALANCE_INFO_KEY.BALANCE_TRANSFER_DETAILS,
    [ROUTE.WEB.CONSOLIDATED_TRANSACTION_FOS]: PROPERTIES.EVD_BALANCE_INFO_KEY.CONSOLIDATED_TRANSACTIONS,
    [ROUTE.WEB.OTF_CREDIT_DETAILS_FOS]: PROPERTIES.EVD_BALANCE_INFO_KEY.OTF_CREDIT_DETAILS,
    [ROUTE.WEB.RECHARGE_TRANSACTION_FOS]: PROPERTIES.EVD_BALANCE_INFO_KEY.RECHARGE_TRANSACTION,
  };

  const getDataArrayForQuery = () => propertyMap[routeName] || [];

  const formatAmountForTransferDetails = (dataObj: CustomerData) => {
    const amount = typeof dataObj.amount === 'string' || typeof dataObj.amount === 'number' ? Number(dataObj.amount) : 0;
    if (amount > 0) {
      return dataObj.creditAmount ?? amount;
    }
    if (amount < 0) {
      return dataObj.debitAmount ?? amount;
    }
    return amount;
  };

  const getDisplayDataArray = (dataObj: ParentObject, visibleFields: ParentObject) => {
    const isTransferRoute = routeName === ROUTE.WEB.BALANCE_TRANSFER_DETAILS || routeName === ROUTE.WEB.BALANCE_TRANSFER_dETAILS_FOS;

    if (!isTransferRoute) return visibleFields;
    const amount = typeof dataObj.amount === 'string' || typeof dataObj.amount === 'number' ? Number(dataObj.amount) : 0;

    return visibleFields.map((item: ParentObject) => {
      if (item.key === STRINGS.AMOUNT) {
        if (amount > 0) {
          return { ...item, key: STRINGS.CREDIT_AMOUNT, label: t('strings.creditAmount') };
        }
        if (amount < 0) {
          return { ...item, key: STRINGS.DEBIT_AMOUNT, label: t('strings.debitedAmount') };
        }
      }
      return item;
    });
  };

  const renderCardAction = (index: number, isExpanded: boolean, dataObj: CustomerData) => {
    if (button) {
      const daysDiff = getRemainingDays(dataObj.txnDate ?? '');
      if (isWithinLast3Days(dataObj.txnDate ?? '')) {
        return (
          <View>
            <Text style={styles.viewStyle2} label={`${t('strings.applicable')} ${daysDiff} ${t('strings.days')}`} />
            <Button onPress={() => handleFinalSubmit(dataObj)} label={t('strings.reverseTransaction')} fontSize={Sizing.layout.x16} />
          </View>
        );
      }
      return (
        <View>
          <Text style={styles.viewStyle2} label={t('strings.applicableText')} />
          <Button
            onPress={() => dispatch(uiActions.showErrorPage(i18next.t('strings.applicableText') as unknown as string))}
            label={t('strings.reverseTransaction')}
            fontSize={Sizing.layout.x16}
          />
        </View>
      );
    }

    const keys = getDataArrayForQuery();
    if (keys.length > 3) {
      return (
        <TouchableOpacity onPress={() => setExpandedIndexes((prev) => ({ ...prev, [index]: !isExpanded }))}>
          <View style={styles.viewStyle}>
            <Text style={styles.viewStyle} label={isExpanded ? t('strings.viewLess') : t('strings.viewMore')} />
            <Image iconName={isExpanded ? ICONS.PINK_CHEVRON_UP : ICONS.PINK_CHEVRON_DOWN} isDimension={false} width={Sizing.layout.x16} height={Sizing.layout.x16} />
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderCard = (dataObj: CustomerData, index: number) => {
    const allKeys = getDataArrayForQuery();
    const isExpanded = expandedIndexes[index] || false;

    let visibleFields = allKeys;
    if (!button) {
      const limit = routeName === ROUTE.WEB.OTF_CREDIT_DETAILS || routeName === ROUTE.WEB.OTF_CREDIT_DETAILS_FOS ? 3 : 4;

      if (isExpanded) {
        visibleFields = allKeys;
      } else {
        visibleFields = allKeys.slice(0, limit);
      }
    }

    const displayDataArray = getDisplayDataArray(dataObj, visibleFields);
    const isTransferRoute = routeName === ROUTE.WEB.BALANCE_TRANSFER_DETAILS || routeName === ROUTE.WEB.BALANCE_TRANSFER_dETAILS_FOS;
    const isRechargeRoute = routeName === ROUTE.WEB.RECHARGE_TRANSACTION || routeName === ROUTE.WEB.RECHARGE_TRANSACTION_FOS;
    const isOTFRoute = routeName === ROUTE.WEB.OTF_CREDIT_DETAILS || routeName === ROUTE.WEB.OTF_CREDIT_DETAILS_FOS;

    let dataForTextContainer = { ...dataObj };
    if (isRechargeRoute) {
      dataForTextContainer = { ...dataObj, amount: dataObj.creditAmount };
    }
    if (isOTFRoute) {
      dataForTextContainer = { ...dataObj, otfDateTime: `${dataObj.otfDate} ${dataObj.transactionTime}` };
    }
    if (isTransferRoute) {
      dataForTextContainer = {
        ...dataObj,
        creditAmount: formatAmountForTransferDetails(dataObj),
        debitAmount: formatAmountForTransferDetails(dataObj),
      };
    }

    return (
      <View key={index} style={[styles.cardContainer, inputFieldStyle]}>
        <TextContainer
          data={Object.fromEntries(Object.entries(dataForTextContainer).map(([k, v]) => [k, formatValue(String(v ?? ''), k)]))}
          dataArray={displayDataArray}
          textContainerStyle={styles.textContainer}
          itemContainerStyle={styles.itemContainer}
          primaryStyle={styles.primaryText}
          secondaryStyle={(key: string) => [styles.secondaryText, getColorForValue(formatValue(String(dataForTextContainer[key] ?? ''), key), key)]}
          hasSepratorBottom={false}
        />
        <View style={styles.horizontalSeparator} />
        {renderCardAction(index, isExpanded, dataObj)}
      </View>
    );
  };
  const displayData = (() => {
    const reducerData = Array.isArray(finalData?.transactions) ? (finalData.transactions as CustomerData[]) : finalData;
    const isFiltered = reducerData?.length >= 0 && reducerData?.length <= data.length;

    if (isFiltered && isFilterApplied) {
      return reducerData; // show filtered data
    }
    if (data.length > 0) {
      return data;
    }
    return [];
  })();

  const formatRowData = (row: ParentObject) => {
    const formattedRow: ParentObject = {};
    const styleMap: Record<string, any> = {};
    Object.entries(row).forEach(([key, value]) => {
      const formattedValue = formatValue(String(value ?? ''), key);

      formattedRow[key] = formattedValue;

      styleMap[key] = getColorForValue(formattedValue, key);
    });
    return {
      ...formattedRow,
      style: styleMap,
    };
  };

  const formattedTableData = React.useMemo(() => {
    if (!Array.isArray(tableFilteredData)) return [];
    return tableFilteredData.map(formatRowData);
  }, [tableFilteredData]);

  const shouldRenderTable = isWeb && PROPERTIES.EVD_BALANCE_INFO_KEY.TABLE_ROUTES.includes(routeName) && formattedTableData.length > 0;

  let content: React.ReactNode;

  if (shouldRenderTable) {
    content = (
      <View style={styles.tableContainer}>
        <DynamicTable data={formattedTableData} columns={tableColumns} />
      </View>
    );
  } else if (isWeb && formattedTableData.length === 0) {
    content = <Text label={t('errors.noDataAvailable')} fontSize={Sizing.layout.x20} />;
  } else if (Array.isArray(displayData) && displayData.length > 0) {
    content = displayData.map(renderCard);
  } else {
    content = <Text label={t('errors.noDataAvailable')} fontSize={Sizing.layout.x20} />;
  }

  // return <View style={styles.container}>{content}</View>;
  return <View style={[styles.container, !shouldRenderTable && styles.centeredContent]}>{content}</View>;
};

export default memo(CustomerDetails);
