/**
 * @module store/query/heavyRefresh
 * @description Reducer query definitions for heavyRefresh actions.
 */
import { gql } from '@apollo/client';

export const doHeavyRefresh = gql`
  mutation DoHeavyRefresh($input: RefreshInput) {
    doHeavyRefresh(input: $input) {
      message
      status
      subscriberId
      accountInfo {
        subIdList {
          rmn
          subId
          subIdNT
          aliasName
          status
          statusNT
        }
      }
    }
  }
`;
