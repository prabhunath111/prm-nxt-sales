import { ParentObject } from 'store/sales/query/common';

export interface etskRegSchedularType {
  date: string;
  rechargeAmount: '';
  evdPin: '';
  successData: object;
  timeSlotsData: ParentObject;
  selectedSlot: string;
}
