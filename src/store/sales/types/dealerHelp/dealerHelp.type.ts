import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef dealerHelpType
 * @property {string} text - Content for the reducer interface.
 */
export interface dealerHelpType {
  natureOfRequest: ParentObject;
  typeOfRequest: ParentObject;
  tableColumn: ParentObject[];
  tableRowData: ParentObject[];
  dealerSubArea: string;
  dealerRoleId: ParentObject[];
  dealerSuccessData: ParentObject;
  bposData: ParentObject;
  dashboardBingeRetailerLatest: ParentObject;
  bingeTableData: ParentObject;
  bingTableColumn: ParentObject[];
}
