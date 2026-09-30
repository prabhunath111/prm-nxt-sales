/**
 * @module store/sales/query/etskRepush
 * @description Reducer query definitions for etskRepush actions.
 */
import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch sample data.
 *
 * @constant
 * @type {DocumentNode}
 * @default
 *
 * @example
 * const response = await api.query({
 *   query: etskRepushStatus,
 * });
 */
export const etskRepushStatus = gql`
  query EtskRepushStatus($input: EtskRepushStatusInput) {
    etskRepushStatus(input: $input) {
      status
      message
      response {
        subID
        dealerCode
        serviceRegionId
        ocsFlag
        bookingFormNumber
        rechargeSuccess
        boxType {
          boxType
          boxTypeNT
        }
        boxType2 {
          boxType
          boxTypeNT
        }
        boxType3 {
          boxType
          boxTypeNT
        }
        boxType4 {
          boxType
          boxTypeNT
        }
        selectedPacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        offerCategory {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        packageName {
          OfferCategory
          PackageInfo {
            packName
            pricePt
            uom
            uomNT
            productLine
            packNameNT
          }
        }
        bingeEligible
        etskSelectedOffer {
          etskSelectedOffer
          etskSelectedOfferNT
        }
        PopularPacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        TataskyPacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        BroadCastPacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        AlacartePacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        BingePacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        BingeplusPacks {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        bingepluspayablebox {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        notapplicableboxBingeplus {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        tskValue
        languages {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        geners {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        boxTypes {
          id
          name
          nameNT
          object {
            name
            value
          }
        }
        durations {
          name
          value
        }
        offerCategories {
          offerCategory
          offerCategoryNT
        }
        customerInformation
      }
    }
  }
`;

export const etskRepush = gql`
  mutation EtskRepush($input: EtskRepushInput) {
    etskRepush(input: $input) {
      status
      message
      response {
        transId
        message
        woNumber
        rechargeAmount
      }
    }
  }
`;

export const etskRepushSchedular = gql`
  mutation EtskShedular($input: EtskShedularInput) {
    etskShedular(input: $input) {
      message
      status
      response {
        transId
        message
        woNumber
      }
    }
  }
`;
