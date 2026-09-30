import { ParentObject } from '../common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef customerServiceType
 * @property {ParentObject} subscriberDetails - Content for the reducer interface.
 */
export interface customerServiceType {
  accountInfo: ParentObject;
  messages: ParentObject;
  allCategoryInfo: Array<CategoryProps>;
  categories: Array<DropdownType>;
  subCategories: Array<DropdownType>;
  suspensionReason: Array<DropdownType>;
  subscriberRequests: any;
  availableSlot: ParentObject;
  slotSuggestions: ParentObject;
  slotDate: Array<DropdownType>;
  slotTime: Array<DropdownType>;
  taskId: ParentObject;
  selectedType: string;
  typeOfRequest: string;
}

export interface DropdownType {
  label: string;
  value: string;
}

export type CategoryProps = {
  category: string;
  categoryNT: string;
  subCategory: string;
  subCategoryNT: string;
  subArea: string;
  woType: string;
  woSubType: string;
  status: string;
};
export interface ServiceRequestType {
  requestNumber: string;
  natureOfRequest: string;
  requestType: string;
  status: string;
}
