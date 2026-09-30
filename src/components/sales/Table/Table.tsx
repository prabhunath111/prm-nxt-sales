/**
 * Table consists of table cells inside rows and columns
 *
 * @module components/Table
 * @memberof - Common Component
 */
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { flexRender, SortingState, ColumnDef } from '@tanstack/react-table';
import { View, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useDataTable, TableProps, RNTableProps } from 'hooks/useDataTable';
import { Colors, Sizing } from 'styles';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { getTextAlignment } from 'utils/tableHelper';
import { useTranslation } from 'react-i18next';
import Text from 'components/sales/Text';
import { FORMS, ICONS } from 'const';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import Image from 'components/sales/Image';
import { ParentObject } from 'store/sales/types/common';
import styles from './Table.styles';

type CustomColumnDef<TData> = ColumnDef<TData> & {
  parentHeading?: string; // Add missing property
};

/**
 * Represents a Table component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} - Table component.
 */
const RNTable = memo(
  <TData extends object>({ table, showPagination, data, isTsraTable, isDashboardTable, maxFontSize, formName, tableHeaderStyle, maxWidthScroll }: RNTableProps<TData>) => {
    const { inflection } = useInflection();
    const { t } = useTranslation();
    const [columnWidths, setColumnWidths] = useState<number[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const scrollViewRef = useRef<ScrollView>(null);
    const [isSortIcon, setIsSortIcon] = useState<boolean>(false);
    const { totalListCount } = useSelector((state: RootState) => state.common);

    useEffect(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: Sizing.x0, animated: true });
      }
    }, [data]);

    const handleLayout = useCallback((event: ParentObject, index: number) => {
      const { width } = event.nativeEvent.layout;
      setColumnWidths((prevWidths) => {
        const newWidths = [...prevWidths];
        newWidths[index] = width;
        return newWidths;
      });
    }, []);

    const handleSort = (header: ParentObject) => {
      const isDesc = sorting.some((s) => s.id === header.id && s.desc);
      const newSorting = [{ id: header.id, desc: !isDesc }];
      setSorting(newSorting);
      table.setSorting(newSorting);
    };

    const renderSorting = (header: ParentObject) => {
      if (formName === FORMS.tsraInventory && !isSortIcon) {
        setIsSortIcon(true);
      } else if (formName !== FORMS.tsraInventory && isSortIcon) {
        setIsSortIcon(false);
      }
      return formName === FORMS.tsraInventory ? (
        <Pressable onPress={() => handleSort(header)}>
          <Image iconName={ICONS.SORTING_ARROWS} isDimension={false} width={Sizing.layout.x10} height={Sizing.layout.x20} />
        </Pressable>
      ) : null;
    };

    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        style={[styles.tableContainer, styles[gcs('tableContainer', inflection, true, ['md', 'lg', 'xl'])], (isDashboardTable || maxWidthScroll) && styles.tableContainerWidth]}
        contentContainerStyle={styles.tableStyle}
        testID="table-test"
        nestedScrollEnabled
      >
        <View id="table">
          <View id="thead">
            {/* Render Primary Headers (if parentHeading exists) */}
            {table.getHeaderGroups().some((headerGroup) => headerGroup.headers.some((header) => (header.column.columnDef as CustomColumnDef<TData>)?.parentHeading)) && (
              <View key="primary-header" style={[styles.tableRowHeaderStyle]} id="tr">
                {(() => {
                  const mergedHeaders: { key: string; title: string; colSpan: number; totalWidth: number }[] = [];
                  let previousHeading: string | null = null;

                  table.getHeaderGroups()[0].headers.forEach((header: any) => {
                    const parentHeading = header.column.columnDef?.parentHeading;
                    const colWidth = header.getSize();
                    if (parentHeading) {
                      if (previousHeading === parentHeading) {
                        // Increase colSpan and width if the same heading continues
                        mergedHeaders[mergedHeaders.length - 1].colSpan += 1;
                        mergedHeaders[mergedHeaders.length - 1].totalWidth += colWidth;
                      } else {
                        // Create new merged header entry
                        mergedHeaders.push({ key: header.id, title: parentHeading, colSpan: Sizing.flexSize.x100, totalWidth: colWidth });
                      }
                    } else {
                      // Handle single column headers
                      mergedHeaders.push({ key: header.id, title: header.column.columnDef.header, colSpan: Sizing.flexSize.x100, totalWidth: colWidth });
                    }
                    previousHeading = parentHeading;
                  });

                  return mergedHeaders.map((item, index) => (
                    <View
                      id="th"
                      key={item.key}
                      style={[
                        styles.primarytableColumnStyle,
                        index > 0 && styles.noBorderLeft,
                        {
                          width: item.totalWidth,
                        },
                      ]}
                    >
                      <Text style={[styles.primaryHeaderStyle]}>
                        {item.title}
                        <Text style={styles.countText}> {index === Sizing.x0 ? `(${totalListCount})` : ''}</Text>
                      </Text>
                    </View>
                  ));
                })()}
              </View>
            )}
            {table.getHeaderGroups().map((headerGroup: any) => (
              <View key={headerGroup.id} style={[styles.tableRowHeaderStyle]} id="tr">
                {headerGroup.headers.map((header: any, headerIndex: number) => {
                  // Get raw header text
                  const rawHeader =
                    typeof header.column.columnDef.header === 'string' ? header.column.columnDef.header : flexRender(header.column.columnDef.header, header.getContext());

                  // Conditionally format header text if tsra table
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
                        headerIndex === Sizing.x0 && styles.borderLeftStyle,
                        isDashboardTable && styles.dashboardTableColumnStyle,
                        {
                          width: header.column.columnDef.size,
                          maxWidth: Sizing.layout.x250,
                          minWidth: columnWidths[headerIndex] || header.getSize(),
                        },
                        isSortIcon && styles.horizontalHeaderStyle,
                        tableHeaderStyle,
                        header.column.columnDef.headerAlignment && styles.headerAlignment,
                      ]}
                    >
                      {/* Render header text - formatted only if tsra table */}
                      {!header.isPlaceholder && (
                        <Text
                          {...{
                            onPress: header.column.getToggleSortingHandler(),
                            style: [
                              styles.headerNameStyle,
                              styles[gcs('headerNameStyle', inflection, true, ['md', 'lg', 'xl'])],
                              isDashboardTable && styles.dashboardHeaderNameStyle,
                            ],
                          }}
                          maxFontSize={maxFontSize}
                          id="header"
                        >
                          {formattedHeaderText}
                          {{
                            asc: '',
                            desc: '',
                          }[header.column.getIsSorted() as string] ?? null}
                        </Text>
                      )}
                      {renderSorting(header)}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          <ScrollView nestedScrollEnabled style={[styles.tableBodyScroll, styles[gcs('tableBodyScroll', inflection, true, ['md', 'lg', 'xl'])]]}>
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
                    {row.getVisibleCells().map((cell: ParentObject, cellIndex: number) => (
                      <View
                        key={cell.id}
                        id={cell.colSpan}
                        style={[
                          styles.tableCellStyle,
                          cell.column.columnDef?.isBorder && styles.borderRightStyle,
                          cellIndex === Sizing.x0 && styles.borderLeftStyle,
                          styles[gcs('tableCellStyle', inflection, true, ['md', 'lg', 'xl'])],
                          {
                            width: cell.column.getSize(),
                            maxWidth: Sizing.layout.x250,
                            minWidth: cell.column.getSize(),
                            justifyContent: getTextAlignment(cell.column.columnDef?.alignment),
                          },
                        ]}
                        onLayout={(event) => handleLayout(event, cellIndex)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                      width: table.getCenterTotalSize(),
                    },
                  ]}
                >
                  <Text style={styles.noRecordFoundStyle}>{t('errors.noDataFound')}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        {showPagination ? (
          <View style={styles.paginationContainer} id="pagination">
            <TouchableOpacity style={styles.buttonStyle} onPress={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <Text style={styles.textStyle}>{'<<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <Text style={styles.textStyle}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <Text style={styles.textStyle}>{'>'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <Text style={styles.textStyle}>{'>>'}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    );
  },
);

const Table = <TData extends object>({ ...props }: TableProps<TData>) => {
  /**
   * React hook to manage data table functionality.
   */
  const { table, data, showPagination, isTsraTable, isDashboardTable, formName, tableHeaderStyle, maxWidthScroll } = useDataTable({
    ...props,
  });
  /**
   * Renders the table.
   *
   * @returns {JSX.Element} - Rendered table component or loader.
   */

  return data?.length > 0 ? (
    <RNTable
      table={table}
      showPagination={showPagination}
      data={data}
      isTsraTable={isTsraTable}
      isDashboardTable={isDashboardTable}
      maxFontSize={props.maxFontSize}
      formName={formName}
      tableHeaderStyle={tableHeaderStyle}
      maxWidthScroll={maxWidthScroll}
    />
  ) : null;
};

export default memo(Table);
