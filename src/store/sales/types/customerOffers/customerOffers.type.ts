import { ParentObject } from 'store/sales/query/common';

/**
 * Reducer interface/type definitions.
 *
 * @typedef customerOffersType
 * @property {string} text - Content for the reducer interface.
 */
export interface customerOffersType {
  offersList: ParentObject[];
  selectedOffer: ParentObject;
  isOfferRemoved: boolean;
}

export interface SubChannel {
  pid: string;
  pName: string;
  channelName: string;
  bid: string;
  pmrp: string;
  hdFlag: string;
  epgNumber: string;
  hdOrSd: string;
  sdOrId: string | null;
  rentalFlag: string;
  cName: string;
  recoGenreId: string;
  channelId: string;
  language: string;
  genreName: string;
  bcat: string;
  packageCat: string;
  imageName: string;
  imageURL: string;
}

export interface PackItem {
  id: string;
  title: string;
  subChannels: SubChannel[];
  showAllChannels?: boolean; // Local state property for toggling visibility
}

export interface BouquetChannel {
  id: string;
  packName: string;
  packItems: PackItem[];
}

export interface SelectedOffer {
  packageId: string;
  bouquetType: string;
  packName: string;
  packFriendlyName: string;
  hdCount: string;
  sdCount: string;
  packPrice: string;
  genre: string[];
  bouquetChannels: BouquetChannel[];
}
