/**
 * @module store/query/packageInformation
 * @description Reducer query definitions for packageInformation actions.
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
 *   query: PACKAGE_INFORMATION_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const PACKAGE_INFORMATION_QUERY = gql`
  query GetLinksAndInfo {
    getLinksAndInfo {
      packageInformation {
        linkName
        linkURL
      }
      userGuide {
        linkName
        linkURL
      }
      trainingVideo {
        linkName
        linkURL
      }
      userGuidePDF {
        linkName
        linkURL
      }
    }
  }
`;
