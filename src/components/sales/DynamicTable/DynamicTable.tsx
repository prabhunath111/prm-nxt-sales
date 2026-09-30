import React, { useMemo, useState } from 'react';
import { ScrollView, FlatList, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { STRINGS, FORMS, ICONS, ROUTE, QUERY } from 'const';
import { Sizing } from 'styles';
import Image from 'components/sales/Image';
import { ParentObject } from 'store/sales/types/common';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { callAction } from 'utils/formBuilderHelper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { sliceActions as evdActions } from 'store/sales/reducer/evdBalanceInfo';
import styles from './DynamicTable.styles';
import Button from '../Button';

export type DynamicTableProps = {
  columns: any[];
  data: any[];
  alignLeft?: boolean;
  formName?: string;
  onLinkPress?: (item: any) => void;
  listStyle?: ViewStyle;
};

const getAlign = (alignment: string | null) => {
  switch (alignment) {
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
    default:
      return 'flex-start';
  }
};

const DynamicTable = ({ columns, data, alignLeft = true, formName, onLinkPress, listStyle }: DynamicTableProps) => {
  const { inflection } = useInflection();
  const { i18n } = useTranslation();
  const isDesktop = inflection === BreakPoints.XL || inflection === BreakPoints.LG || inflection === BreakPoints.MD;
  const { routeName } = useCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();

  const { pageNumber, paginationData } = useSelector((state: RootState) => state.evdBalanceInfo);
  const tableMinWidth = columns.reduce((sum, col) => sum + Number(col.size), 0);
  const getFlexBasis = (colSize: number) => `${(colSize / tableMinWidth) * 100}%`;

  const [sorting, setSorting] = useState<{ id: string; desc: boolean } | null>(null);

  const handleSort = (col: ParentObject) => {
    if (!col.accessorKey) return;
    setSorting((prev) => {
      if (!prev || prev.id !== col.accessorKey) {
        return { id: col.accessorKey, desc: false };
      }
      return { id: col.accessorKey, desc: !prev.desc };
    });
  };

  const sortedData = useMemo(() => {
    if (!sorting) return data;
    const { id, desc } = sorting;
    return [...data].sort((a, b) => {
      const valA = a[id];
      const valB = b[id];
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (Number.isFinite(valA) && Number.isFinite(valB)) {
        return desc ? valB - valA : valA - valB;
      }
      return desc ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
    });
  }, [data, sorting]);

  const handelPress = (col: ParentObject, row: ParentObject) => {
    dispatch(callAction({ col, row }, col?.operation, '', navigate));
  };

  const loadMoreData = () => {
    if (routeName === ROUTE.WEB.CONSOLIDATED_TRANSACTION || routeName === ROUTE.WEB.CONSOLIDATED_TRANSACTION_FOS) {
      if (pageNumber === 0) {
        return;
      }
      if (pageNumber >= paginationData?.totalPages) {
        return;
      }
      dispatch(evdActions.setPageNumber(pageNumber + 1));
      dispatch(callAction({ page: pageNumber }, 'consolidatedOnlineReport'));
    }
    if (routeName === ROUTE.WEB.RECHARGE_TRANSACTION || routeName === ROUTE.WEB.RECHARGE_TRANSACTION_FOS) {
      if (pageNumber === 0) {
        return;
      }
      if (pageNumber >= paginationData?.totalPages) {
        return;
      }
      dispatch(evdActions.setPageNumber(pageNumber + 1));
      dispatch(callAction({ page: pageNumber }, QUERY.RechargeReport));
    }
    if (routeName === ROUTE.WEB.OTF_CREDIT_DETAILS || routeName === ROUTE.WEB.OTF_CREDIT_DETAILS_FOS) {
      if (pageNumber === 0) {
        return;
      }
      if (pageNumber >= paginationData?.totalPages) {
        return;
      }
      dispatch(evdActions.setPageNumber(pageNumber + 1));
      dispatch(callAction({ page: pageNumber }, QUERY.ConsolidateOTFReport));
    }
    if (routeName === ROUTE.WEB.BALANCE_TRANSFER_DETAILS || routeName === ROUTE.WEB.BALANCE_TRANSFER_dETAILS_FOS) {
      if (pageNumber === 0) {
        return;
      }
      if (pageNumber >= paginationData?.totalPages) {
        return;
      }
      dispatch(evdActions.setPageNumber(pageNumber + 1));
      dispatch(callAction({ page: pageNumber }, QUERY.ConsolidateBalanceTransferReport));
    }
  };

  const renderCellContent = (col: any, item: any) => {
    const textStyle = item?.style?.[col.accessorKey] ?? {};

    if (col.renderCell) {
      return col.renderCell(item);
    }

    switch (col.type) {
      case 'button':
        return (
          <View style={styles.buttonContainer}>
            <Button style={styles.buttonText} onPress={() => handelPress(col, item)} label={col.name} fontSize={Sizing.layout.x16} />
            <Text style={[styles.buttomText, textStyle]}>{item[col.accessorKey] ?? ''}</Text>
          </View>
        );

      case 'link':
        return (
          <TouchableOpacity onPress={() => onLinkPress?.(item)} testID={`link-${col.accessorKey}`}>
            <Text style={[styles.linkText, textStyle]}>{item[col.accessorKey] ?? 'View'}</Text>
          </TouchableOpacity>
        );

      default:
        return <Text style={[styles.cellText, textStyle]}>{item[col.accessorKey] ?? 'NA'}</Text>;
    }
  };

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.contentContainerStyle}
      style={!isDesktop && styles.scrollContainer}
      testID="dynamicTable"
      nestedScrollEnabled
      showsHorizontalScrollIndicator
    >
      <View style={[{ minWidth: tableMinWidth }, styles.tableBorderWrap]}>
        <View style={styles.headerRow}>
          {columns.map((col, index) => {
            const isLastCol = index === columns.length - 1;
            const isSortingAllowed = formName === FORMS.storeOperationalDetails;

            return (
              <View
                key={col.accessorKey}
                style={[
                  styles.cell,
                  {
                    flexBasis: getFlexBasis(Number(col.size)),
                    flexGrow: 0,
                    flexShrink: 0,
                    alignItems: getAlign(col.alignment),
                  },
                  !isLastCol && styles.cellBorder,
                ]}
              >
                <View style={isSortingAllowed ? styles.rowContainerWidth : styles.rowContainer}>
                  <Text style={[alignLeft ? styles.headerTextLeft : styles.headerText, i18n.language === STRINGS.TA && styles.tamilHeader]}>{col.label}</Text>

                  {isSortingAllowed && (
                    <TouchableOpacity onPress={() => isSortingAllowed && handleSort(col)} disabled={!isSortingAllowed} testID={`sort-${col.accessorKey}`}>
                      <Image iconName={ICONS.SORTING_ARROWS} isDimension={false} width={Sizing.layout.x10} height={Sizing.layout.x20} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Scrollable Rows*/}
        <View style={[styles.fixHeader, listStyle]}>
          <FlatList
            testID="dynamic-table-flatlist"
            showsVerticalScrollIndicator
            nestedScrollEnabled
            data={sortedData}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item, index }) => (
              <View style={[styles.row, index % 2 === 1 && styles.altRow]}>
                {columns.map((col, colIndex) => {
                  const isLastCol = colIndex === columns.length - 1;
                  return (
                    <View
                      key={col.accessorKey}
                      style={[
                        styles.cell,
                        {
                          flexBasis: getFlexBasis(Number(col.size)),
                          flexGrow: 0,
                          flexShrink: 0,
                          alignItems: getAlign(routeName === ROUTE.WEB.TRACK_PARTNER_REQUEST ? null : col.alignment),
                        },
                        !isLastCol && styles.cellBorder,
                      ]}
                    >
                      <Text style={[alignLeft ? styles.cellTextLeft : styles.cellText, routeName === ROUTE.WEB.TRACK_PARTNER_REQUEST && styles.leftAlignment]}>
                        {renderCellContent(col, item)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DynamicTable;
