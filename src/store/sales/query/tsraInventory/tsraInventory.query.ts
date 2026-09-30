/**
 * @module store/sales/query/tsraInventory
 * @description Reducer query definitions for tsraInventory actions.
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
 *   query: tsraInventory,
 *   variables: { sampleVariable: 'exampleValue' },
 * });
 */
export const tsraInventory = gql`
  query TsraInventory($formName: String) {
    tsraInventory(formName: $formName) {
      count
      status
      message
      tableColumns
      tsraInventory
    }
  }
`;
