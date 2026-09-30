/**
 * @module store/sales/query/fetchLanguage
 * @description Reducer query definitions for fetchLanguage actions.
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
 *   query: SAMPLE_QUERY,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const fetchLanguage = gql`
  query FetchLanguage {
    fetchLanguage {
      result
      status
      message
    }
  }
`;

export const setLanguagePreference = gql`
  query SetLanguagePreference($languagePreference: String) {
    setLanguagePreference(languagePreference: $languagePreference) {
      status
      message
    }
  }
`;
export const GetMenus = gql`
  query GetMenus {
    getMenus {
      routes
      menus
      dashboard
    }
  }
`;
