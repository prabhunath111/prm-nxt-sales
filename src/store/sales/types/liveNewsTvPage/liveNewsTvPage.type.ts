/**
 * Reducer interface/type definitions.
 *
 * @typedef liveNewsTvPageType
 * @property {string} text - Content for the reducer interface.
 */

export interface MetaApiResponse {
  meta: Meta[];
  detail?: Detail;
  channelMeta?: ChannelMeta;
}

export interface Meta {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  description: string;
  rating: string;
  audio: string[];
  duration: number;
  genre: string[];
  boxCoverImage: string;
  epgState: string;
  contentType: string;
  provider: string;
  primaryGenre: string;
}

export interface Detail {
  contractName: string;
  entitlements: string[];
  offerId: OfferId;
}

export interface OfferId {
  key: string;
  epids: Epid[];
}

export interface Epid {
  epid: string;
  bid: string;
}

export interface ChannelMeta {
  id: number;
  name: string;
  logo: string;
  contentType: string;
  channelNumber: string;
  genre: string[];
  transparentImageUrl: string;
}
export interface CurrentMetaData{
    contentId:string
    contentType:string
  }
export interface liveNewsTvPageType {
  metaData: MetaApiResponse;
  currentMetaData:CurrentMetaData;
  playBackData:{};

}

export interface metaDataType {
  metaContentId: string
  metaContentType: string
}