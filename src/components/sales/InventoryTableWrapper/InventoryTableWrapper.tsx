/**
 * These wrappers are used to provide additional functionality or behavior to the wrapped component without modifying its original implementation.
 *
 * @module components/TableWrapper
 * @memberof CommonComponent
 */
import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Row } from '@tanstack/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { usePagination } from 'hooks/usePagination';
import { TableCellProps, TableColumnProps, TableMeta, TableRow } from 'hooks/useDataTable';
import alertActions from 'store/sales/actions/ui';
import formActions from 'store/sales/actions/form';
import { RootState, AppDispatch } from 'store';
import { ALERT, STATE_KEY } from 'const';
import { Sizing } from 'styles';
import { getFullScreenWidth } from 'styles/dimentionHelper';
import { useTranslation } from 'react-i18next';
import TableCell from 'components/sales/TableCell';
import Text from 'components/sales/Text';
import InventoryTable from 'components/sales/InventoryTable';
import styles from './InventoryTableWrapper.styles';

/**
 * Component type definitions
 *
 * @typedef {object} TableWrapperProps
 * @property {string} tableName - Name of the table to fetch and display data for
 */
export type TableWrapperProps<TData> = {
  showPagination?: boolean;
  onTableDataSubmit?: (props: object, tableInstance: object) => void;
  tableColumns?: TableColumnProps<TData>[] | any;
  queryParams?: string;
  queryName?: string;
  isDataRequiredForForm?: boolean;
  tableData?: SetStateAction<TableRow[]>;
  parentSize?: number;
  isDashboardTable?: boolean;
  stateKey?: string;
  isScrollable?: boolean;
  maxFontSize?: number;
  formName?: string;
  isTsraTable?: boolean;
};

/**
 * Represents a TableWrapper component
 *
 * @component
 * @param {TableWrapperProps} props - React properties passed from composition
 * @returns {JSX.Element} TableWrapper component
 */
const TableWrapper = <TData extends object>({
  showPagination = false,
  onTableDataSubmit,
  tableColumns = [],
  tableData = [],
  queryName = '',
  queryParams = '',
  isDataRequiredForForm = false,
  parentSize = getFullScreenWidth(),
  isDashboardTable = false,
  stateKey = STATE_KEY.FORM_STATE,
  maxFontSize,
  formName = '',
  isTsraTable = true,
}: TableWrapperProps<TData>) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { formDependentData, dropdownOptions, tables, isMarkedForDeletion } = useSelector((state: RootState) => state.form[stateKey]);
  const {
    error: { message: error },
  } = useSelector((state: RootState) => state.ui);
  const [columns, setColumns] = useState<TableColumnProps<TData>[]>([]);
  const [data, setData] = useState<TableRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tableCellReference, setTableCellReference] = useState<any>({});

  const { limit, setPagination, skip, pagination } = usePagination();

  const onConfirmationAlert = (row: Row<TData>, tableMeta: TableMeta, columnDef: TableColumnProps<TData>) => {
    dispatch(
      alertActions.showAlert(
        t('alertMessages.deleteItem'),
        t('alertMessages.loaderInfo'),
        {
          primaryText: t('modal.yes'),
          secondaryText: t('modal.cancel'),
          isPrimaryRequire: true,
          isSecondaryRequire: true,
          primaryAction: ALERT.INFO,
        },
        {},
      ),
    );
    setTableCellReference({ row, tableMeta, columnDef });
  };

  const calculateSize = (size: number, totalSize: number, containerSize: number): number => {
    const scaleFactor = containerSize / totalSize; // Calculate the scale factor based on total size and window width
    const scaledSize = size * scaleFactor; // Scale the current column size proportionally
    return scaleFactor > 1 ? scaledSize : size;
  };

  const getColumns = (columnList: TableColumnProps<TData>[]) => {
    const newColumns: TableColumnProps<TData>[] = [];
    const totalInitialSize = columnList.reduce((sum, column) => sum + Number(column.size), 0); // Calculate the total initial size of all columns

    columnList.forEach((column: TableColumnProps<TData>) => {
      newColumns.push({
        ...column,
        size: calculateSize(Number(column.size), totalInitialSize, parentSize),
        header: column.label,
        cell: (props: TableCellProps) => <TableCell {...props} maxFontSize={maxFontSize} />,
        onConfirmationAlert,
        onTableDataSubmit,
        minSize: Sizing.x5,
        maxSize: Sizing.x500,
      });
    });
    setColumns(newColumns);
  };

  const getAllData = () => {
    if (formDependentData[queryParams]) {
      dispatch(formActions.fetchTableData({ limit, skip, [queryParams]: formDependentData[queryParams] }, queryName));
    }
  };

  useEffect(() => {
    if (tableColumns?.length > 0) {
      getColumns(tableColumns);
    }
  }, [tableColumns]);

  useEffect(() => {
    if (tableData?.length > 0) {
      setData(tableData);
    }
  }, [tableData]);

  useMemo(() => {
    setData(dropdownOptions[queryName]);
  }, [dropdownOptions[queryName]]);

  useEffect(() => {
    if (tables[queryName]) {
      if (tables[queryName]?.length > 0) {
        setData(tables[queryName]);
        setTotalCount(tables[queryName]?.length);
      }
    }
  }, [tables[queryName]]);

  useEffect(() => {
    getAllData();
  }, [pagination]);

  useEffect(() => {
    if (isMarkedForDeletion) {
      tableCellReference?.tableMeta?.removeRow(tableCellReference?.row.index);
      dispatch(formActions.processAlertConfirmation(false));
    }
  }, [isMarkedForDeletion]);

  const handleTableReference = (tableRef: object, data: TableRow[]) => {
    if (isDataRequiredForForm) {
      onTableDataSubmit?.(data, tableRef);
    }
  };

  return error ? (
    <View testID="table-test">
      <Text>{t('errors.queryFetchError')}</Text>
    </View>
  ) : (
    <View style={styles.container} testID="table-test">
      <InventoryTable
        columns={columns as unknown as TableColumnProps<object>[]}
        data={data}
        totalCount={totalCount}
        limit={limit}
        showPagination={showPagination}
        pagination={pagination}
        setPagination={setPagination}
        setTableDetails={handleTableReference}
        isDashboardTable={isDashboardTable}
        maxFontSize={maxFontSize}
        formName={formName}
        isTsraTable={isTsraTable}
      />
    </View>
  );
};
export default TableWrapper;
