/**
 * Table consists of table cells inside rows and columns
 *
 * @module components/InventoryTable
 * @memberof CommonComponent
 */

import React, { memo, useState } from 'react';
import { flexRender, SortingState, ColumnDef } from '@tanstack/react-table';
import { View, TouchableOpacity, ScrollView, Pressable, Dimensions, Platform } from 'react-native';
import { useDataTable, TableProps, RNTableProps } from 'hooks/useDataTable';
import { Colors, Sizing } from 'styles';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { getTextAlignment } from 'utils/tableHelper';
import { useTranslation } from 'react-i18next';
import Text from 'components/sales/Text';
import { FORMS, ICONS, STRINGS } from 'const';
import Image from 'components/sales/Image';
import { ParentObject } from 'store/sales/types/common';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import tsraInventoryActions from 'store/sales/actions/tsraInventory';
import { dropdown } from 'styles/forms';
import Dropdown, { DataItem } from 'components/sales/Dropdown';
import styles from './InventoryTable.styles';
import Tooltip from '../Tooltip/Tooltip';

const screenWidth = Dimensions.get('window').width;
const maxTableWidth = screenWidth * 0.9;

type CustomColumnDef<TData> = ColumnDef<TData> & {
  parentHeading?: string;
};

const DEFAULT_COLUMN_WIDTH = 160;

const RNTable = memo(<TData extends object>({ table, showPagination, data, isTsraTable, isDashboardTable, formName }: RNTableProps<TData>) => {
  const { inflection } = useInflection();
  const { t, i18n } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedSort, setSelectedSort] = useState<DataItem | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();

  const [columnWidths, _setColumnWidths] = useState<{ [index: number]: any }>({
    0: 230,
    1: i18n.language !== STRINGS.EN ? 200 : 100,
    2: i18n.language !== STRINGS.EN ? 200 : 100,
    3: i18n.language !== STRINGS.EN ? 210 : 100,
    4: i18n.language !== STRINGS.EN ? 210 : 100,
    5: i18n.language !== STRINGS.EN ? 200 : 100,
    6: i18n.language !== STRINGS.EN ? 200 : 100,
    7: i18n.language !== STRINGS.EN ? 200 : 160,
  });

  const getColumnWidth = (index: number) => {
    if (index === 0) {
      return columnWidths[0];
    }

    const visibleColumns = table.getHeaderGroups()[0]?.headers.length || 1;

    if (visibleColumns < 6) {
      return DEFAULT_COLUMN_WIDTH;
    }

    if (!(6 in columnWidths)) {
      return DEFAULT_COLUMN_WIDTH;
    }

    if (index === visibleColumns - 1) {
      return DEFAULT_COLUMN_WIDTH;
    }
    return columnWidths[index] ?? DEFAULT_COLUMN_WIDTH;
  };

  const sortOptions = [
    {
      id: '1',
      name: t(`strings.AZ_ALPHABETICAL`),
      object: { value: STRINGS.AZ_ALPHABETICAL },
    },
    {
      id: '2',
      name: t(`strings.HIGH_TO_LOW`),
      object: { value: STRINGS.HIGH_TO_LOW },
    },
    {
      id: '3',
      name: t(`strings.LOW_TO_HIGH`),
      object: { value: STRINGS.LOW_TO_HIGH },
    },
  ];

  const handleDropdownSelect = (item: DataItem): void => {
    setSorting([]);
    table.setSorting([]);

    switch (item.object?.value) {
      case STRINGS.AZ_ALPHABETICAL:
        dispatch(tsraInventoryActions.sortTsraInventoryAlphabetically());
        break;
      case STRINGS.HIGH_TO_LOW:
        dispatch(tsraInventoryActions.sortTsraInventoryByMaxStockDays());
        break;
      case STRINGS.LOW_TO_HIGH:
        dispatch(tsraInventoryActions.sortTsraInventoryByMaxStockDaysAsc());
        break;
      default:
        break;
    }
  };

  const { totalListCount } = useSelector((state: RootState) => state.common);

  const handleSort = (header: ParentObject) => {
    const isDesc = sorting.some((s) => s.id === header.id && s.desc);
    const newSorting = [{ id: header.id, desc: !isDesc }];
    setSorting(newSorting);
    table.setSorting(newSorting);
  };

  const renderSorting = (header: ParentObject, index: number) =>
    formName === FORMS.tsraInventory && index !== 0 ? (
      <Pressable testID={`sort-arrow-${index}`} onPress={() => handleSort(header)}>
        <Image iconName={ICONS.SORTING_ARROWS} isDimension={false} width={Sizing.layout.x10} height={Sizing.layout.x20} />
      </Pressable>
    ) : null;

  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator
      showsHorizontalScrollIndicator
      style={[styles.tableContainer, { maxWidth: maxTableWidth }, styles[gcs('tableContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])], isDashboardTable]}
      contentContainerStyle={styles.tableStyle}
      testID="table-test"
    >
      <View id="table">
        <View id="thead">
          {table.getHeaderGroups().some((group) => group.headers.some((header) => (header.column.columnDef as CustomColumnDef<TData>)?.parentHeading)) && (
            <View key="primary-header" style={styles.tableRowHeaderStyle} id="tr">
              {(() => {
                const mergedHeaders: { key: string; title: string; colSpan: number; startIndex: number }[] = [];
                let previousHeading: string | null = null;
                let currentIndex = 0;

                table.getHeaderGroups()[0].headers.forEach((header: any) => {
                  const parentHeading = header.column.columnDef?.parentHeading;
                  if (parentHeading) {
                    if (previousHeading === parentHeading) {
                      mergedHeaders[mergedHeaders.length - 1].colSpan += 1;
                    } else {
                      mergedHeaders.push({ key: header.id, title: parentHeading, colSpan: 1, startIndex: currentIndex });
                    }
                  } else {
                    mergedHeaders.push({ key: header.id, title: header.column.columnDef.header, colSpan: 1, startIndex: currentIndex });
                  }
                  previousHeading = parentHeading;
                  currentIndex += 1;
                });

                return mergedHeaders.map((item, index) => {
                  const totalWidth = Array.from({ length: item.colSpan })
                    .map((_, i) => getColumnWidth(item.startIndex + i))
                    .reduce((acc, width) => acc + width, 0);
                  return (
                    <View key={item.key} id="th" style={[styles.primarytableColumnStyle, index > 0 && styles.noBorderLeft, { width: totalWidth }]}>
                      <Text style={styles.primaryHeaderStyle}>
                        {item.title}
                        <Text style={styles.countText}>{index === 0 ? ` (${totalListCount})` : ''}</Text>
                      </Text>
                    </View>
                  );
                });
              })()}
            </View>
          )}
          {table.getHeaderGroups().map((headerGroup: any) => (
            <View key={headerGroup.id} style={styles.tableRowHeaderStyle} id="tr">
              {headerGroup.headers.map((header: any, index: number) => {
                const rawHeader =
                  typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header : flexRender(header.column.columnDef.header, header.getContext());

                const formattedHeaderText =
                  isTsraTable && typeof rawHeader === 'string'
                    ? rawHeader
                        .split(' ')
                        .reduce((acc: string, word: string, idx: number) => (idx === 2 ? `${acc}\n${word}` : `${acc} ${word}`), '')
                        .trim()
                    : rawHeader;

                return (
                  <View
                    id="th"
                    key={header.id}
                    style={[
                      styles.tableColumnStyle,
                      header.column.columnDef?.isBorder && styles.borderRightStyle,
                      index === 0 && styles.borderLeftStyle,
                      isDashboardTable && styles.dashboardTableColumnStyle,
                      styles.horizontalHeaderStyle,
                      { width: getColumnWidth(index) },
                    ]}
                  >
                    {index === 0 ? (
                      <Dropdown
                        testID="sort-dropdown"
                        data={sortOptions}
                        onSelect={(item: DataItem) => {
                          setSelectedSort(item);
                          handleDropdownSelect(item);
                        }}
                        selectedValue={selectedSort}
                        isMultiline
                        placeholder={t(`strings.AZ_ALPHABETICAL`)}
                        innerContainerStyle={dropdown.inventoryDropdown}
                      />
                    ) : (
                      !header.isPlaceholder && (
                        <View style={[styles.centerContent, { width: getColumnWidth(index) }]}>
                          <Text
                            onPress={header.column.getToggleSortingHandler()}
                            style={[
                              styles.headerNameStyle,
                              styles[gcs('headerNameStyle', inflection, true, ['md', 'lg', 'xl'])],
                              isDashboardTable && styles.dashboardHeaderNameStyle,
                            ]}
                            numberOfLines={2}
                          >
                            {formattedHeaderText}
                          </Text>
                        </View>
                      )
                    )}
                    {renderSorting(header, index)}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <ScrollView style={[styles.tableBodyScroll, styles[gcs('tableBodyScroll', inflection, true, ['md', 'lg', 'xl'])]]} showsVerticalScrollIndicator>
          <View style={styles.tableBody} id="tbody">
            {data?.length > 0 ? (
              table.getRowModel().rows.map((row: any, rowIndex: number) => (
                <View
                  key={row.id}
                  style={[
                    styles.tableRowStyle,
                    {
                      backgroundColor: isDashboardTable && rowIndex % 2 !== 0 ? Colors.violet.v50 : Colors.neutral.white,
                    },
                  ]}
                  id="tr"
                >
                  {row.getVisibleCells().map((cell: ParentObject, index: number) => (
                    <View
                      key={cell.id}
                      id={cell.colSpan}
                      style={[
                        styles.tableCellStyle,
                        cell.column.columnDef?.isBorder && styles.borderRightStyle,
                        index === 0 && styles.borderLeftStyle,
                        styles[gcs('tableCellStyle', inflection, true, ['md', 'lg', 'xl'])],
                        {
                          width: getColumnWidth(index),
                          justifyContent: getTextAlignment(cell.column.columnDef?.alignment),
                          paddingHorizontal: 4,
                        },
                        index !== 0 && styles.centeredData,
                      ]}
                    >
                      {index === 0 ? (
                        <Tooltip text={String(cell.getValue?.() ?? '')}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.cellTextStyle,
                              {
                                maxWidth: getColumnWidth(index) - 8,
                                ...(Platform.OS === 'web'
                                  ? {
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'inline-block',
                                      flexShrink: 1,
                                    }
                                  : {}),
                              },
                            ]}
                          >
                            {String(cell.getValue?.() ?? '')}
                          </Text>
                        </Tooltip>
                      ) : (
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.cellTextStyle,
                            {
                              maxWidth: getColumnWidth(index) - 8,
                              ...(Platform.OS === 'web'
                                ? {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block',
                                    flexShrink: 1,
                                  }
                                : {}),
                            },
                          ]}
                        >
                          {String(cell.getValue?.() ?? '')}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <View
                id="tr"
                style={[
                  styles.noRecordFoundContainerStyle,
                  {
                    backgroundColor: Colors.neutral.white,
                    width: maxTableWidth,
                  },
                ]}
              >
                <Text style={styles.noRecordFoundStyle}>{t('errors.noDataFound')}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {showPagination && (
        <View style={styles.paginationContainer} id="pagination">
          <TouchableOpacity testID="pagination-first" style={styles.buttonStyle} onPress={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <Text style={styles.textStyle}>{'<<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="pagination-prev" style={styles.buttonStyle} onPress={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <Text style={styles.textStyle}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="pagination-next" style={styles.buttonStyle} onPress={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <Text style={styles.textStyle}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="pagination-last" style={styles.buttonStyle} onPress={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <Text style={styles.textStyle}>{'>>'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
});

const InventoryTable = <TData extends object>({ ...props }: TableProps<TData>) => {
  const { table, data, showPagination, isTsraTable, isDashboardTable, formName } = useDataTable({
    ...props,
  });

  return data?.length > 0 ? (
    <RNTable
      table={table}
      showPagination={showPagination}
      data={data}
      isTsraTable={isTsraTable}
      isDashboardTable={isDashboardTable}
      maxFontSize={props.maxFontSize}
      formName={formName}
    />
  ) : null;
};

export default memo(InventoryTable);
