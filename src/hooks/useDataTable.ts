import { getCoreRowModel, useReactTable, getSortedRowModel, PaginationState, Row, Table } from '@tanstack/react-table';
import { useSorting } from 'hooks/useSorting';
import { useEffect, useMemo, useState } from 'react';
import { ParentObject } from 'store/sales/types/common';
import { findExistingKey, checkForDuplicateEntries } from 'utils/tableHelper';

export interface TableRow {
  [key: string]: any;
}

/**
 * Component type definitions
 *
 * @typedef {object} TableCellProps
 * @property {Function} getValue - function that returns the content for the component
 */
export type TableCellProps = {
  getValue: any;
  row: any;
  column: any;
  table: any;
  maxFontSize?: number;
};

type Callback = (...args: any[]) => void;

export type TableMeta = {
  updateData: (rowIndex: number, columnId: string, value: any, isEditable: boolean, callback: Callback) => void;
  addRow: (newRow: TableRow | undefined, isRequireDuplicateCheck: boolean) => void;
};

export type TableColumnProps<TData> = {
  accessorKey: string;
  enableSorting: boolean;
  header: string;
  minSize?: number;
  size?: number;
  maxSize?: number;
  meta?: object;
  cell?: any;
  operation: string;
  dependentId: string;
  icon: string;
  isRowFormatter: boolean;
  type: string;
  placeholder: string;
  disabled: boolean;
  editable: boolean;
  color: string;
  fontFamily: string;
  label: string;
  alignment: string;
  isBorder: boolean;
  isAddRemoveRequired: boolean;
  onTableDataSubmit?: (props: object, tableInstance: object) => void;
  onConfirmationAlert?: (row: Row<TData>, tableMeta: TableMeta, columnDef: TableColumnProps<TData>) => void;
  formName: string;
  tableHeaderStyle: ParentObject;
  maxWidthScroll: boolean;
};

export type TableProps<TData> = {
  totalCount: number;
  limit: number;
  pagination?: PaginationState;
  setPagination?: any;
  data: TableRow[];
  columns: TableColumnProps<TData>[];
  showPagination: boolean;
  setTableDetails?: (props: object, data: TableRow[]) => void;
  isDashboardTable?: boolean;
  maxFontSize?: number;
  formName?: string;
  isTsraTable?: boolean;
  tableHeaderStyle?: ParentObject;
  maxWidthScroll?: boolean;
};

export type RNTableProps<TData> = {
  showPagination: boolean;
  data: any;
  table: Table<TData>;
  isDashboardTable: boolean | undefined;
  maxFontSize?: number;
  formName?: string;
  isTsraTable?: boolean | undefined;
  tableHeaderStyle?: ParentObject;
  maxWidthScroll?: boolean;
};

export const useDataTable = <TData extends object>({
  totalCount,
  limit,
  pagination,
  setPagination,
  data: tableRecords,
  columns,
  showPagination,
  setTableDetails,
  isDashboardTable,
  formName,
  isTsraTable,
  tableHeaderStyle,
  maxWidthScroll,
}: TableProps<TData>) => {
  const { sorting, onSortingChange } = useSorting();
  const [data, setData] = useState<TableRow[]>([]);

  useEffect(() => {
    setData(tableRecords);
  }, [tableRecords]);

  const pageCount = Math.round(totalCount / limit);

  const table = useReactTable<any>({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      sorting,
      pagination,
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string, isEditable: boolean) => {
        const newData: any = data.map((row: TableRow, index: number) => {
          const matchedKey = findExistingKey(columnId, row, isEditable);
          if (index === rowIndex && matchedKey) {
            return {
              ...row,
              [matchedKey]: value,
            };
          }
          return row;
        });
        setData(newData);
      },
      removeRow: (rowIndex: number) => {
        const newData = [...data];
        newData.splice(rowIndex, 1);
        setData(newData);
      },
      addRow: (newRow: TableRow, isRequireDuplicateCheck: boolean) => {
        if (isRequireDuplicateCheck) {
          setData(checkForDuplicateEntries('id', newRow, data));
        } else {
          const setFunc = (old: TableRow[]) => [...old, newRow];
          setData(setFunc);
        }
      },
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    enableRowSelection: true,
    manualPagination: true,
  });

  useMemo(() => {
    setTableDetails?.(table, data);
  }, [table, data]);

  return {
    table,
    columns,
    data,
    showPagination,
    isDashboardTable,
    formName,
    isTsraTable,
    tableHeaderStyle,
    maxWidthScroll,
  };
};
