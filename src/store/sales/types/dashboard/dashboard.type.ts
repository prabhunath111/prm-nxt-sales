import { TableRow } from 'hooks/useDataTable';
import { SetStateAction } from 'react';
import { ParentObject } from 'store/sales/query/common';

/**
 * Reducer interface/type definitions for the dashboard data.
 *
 * @typedef dashboardType
 * @property {ParentObject} cumulativeFilterData - Stores the cumulative filter data used for filtering the dashboard results.
 * @property {ParentObject} cumulativeTableData - Contains the cumulative table data displayed on the dashboard.
 * @property {ParentObject} monthWiseFilterData - Stores the month-wise filter data used to filter results on a monthly basis.
 * @property {SetStateAction<TableRow[]> | undefined} monthWiseTableData - Represents the table data displayed for month-wise results. Can be undefined if no data is available.
 * @property {string} infoLastUpdatedDate - Stores the last date when the information on the dashboard was updated.
 */
export interface dashboardType {
  cumulativeFilterData: ParentObject;
  cumulativeTableData: ParentObject;
  monthWiseFilterData: ParentObject;
  monthWiseTableData: SetStateAction<TableRow[]> | undefined;
  infoLastUpdatedDate: string;
}
