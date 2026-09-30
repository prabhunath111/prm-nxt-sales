/**
 * @module store/query/utility
 * @description Reducer query definitions for utility actions.
 */
import { gql } from '@apollo/client';
/**
 * Mutation to create a new navigation entry.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.mutate({
 *   mutation: createNavigation,
 *   variables: { input: 'ExampleInput', responsibilities: 'ExampleResponsibilities' },
 * });
 */
export const createNavigation = gql`
  mutation CreateNavigation($input: String, $responsibilities: String) {
    createNavigation(input: $input, responsibilities: $responsibilities)
  }
`;

/**
 * Mutation to create a new form.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.mutate({
 *   mutation: createForm,
 *   variables: { input: 'ExampleInput', responsibilities: 'ExampleResponsibilities' },
 * });
 */

export const createForm = gql`
  mutation CreateForm($input: String, $responsibilities: String) {
    createForm(input: $input, responsibilities: $responsibilities) {
      message
      status
    }
  }
`;

/**
 * Mutation to delete a form.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.mutate({
 *   mutation: deleteForm,
 *   variables: { formName: 'ExampleFormName' },
 * });
 */

export const deleteForm = gql`
  mutation DeleteForm($formName: String) {
    deleteForm(formName: $formName) {
      message
      status
    }
  }
`;

/**
 * Mutation to delete a navigation path.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.mutate({
 *   mutation: deleteMenu,
 *   variables: { navigationPath: 'ExampleNavigationPath' },
 * });
 */

export const deleteMenu = gql`
  mutation DeleteNavigation($navigationPath: String) {
    deleteNavigation(navigationPath: $navigationPath) {
      message
      status
    }
  }
`;

/**
 * Mutation to create a form-role mapping.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.mutate({
 *   mutation: createFormRoleMapping,
 *   variables: { formName: 'ExampleFormName', responsibilities: 'ExampleResponsibilities' },
 * });
 */

export const createFormRoleMapping = gql`
  mutation CreateFormRoleMapping($formName: String, $responsibilities: String) {
    createFormRoleMapping(formName: $formName, responsibilities: $responsibilities) {
      message
      status
    }
  }
`;

/**
 * Mutation to remove a form-role mapping.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.mutate({
 *   mutation: removeFormRoleMapping,
 *   variables: { formName: 'ExampleFormName', responsibilities: 'ExampleResponsibilities' },
 * });
 */

export const removeFormRoleMapping = gql`
  mutation RemoveFormRoleMapping($formName: String, $responsibilities: String) {
    removeFormRoleMapping(formName: $formName, responsibilities: $responsibilities) {
      message
      status
    }
  }
`;

/**
 * Mutation to create a navigation-role mapping.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.mutate({
 *   mutation: createNavigationRoleMapping,
 *   variables: {
 *     navigationName: 'ExampleNavigationName',
 *     path: 'ExamplePath',
 *     responsibilities: 'ExampleResponsibilities',
 *   },
 * });
 */

export const createNavigationRoleMapping = gql`
  mutation CreateNavigationRoleMapping($navigationName: String, $path: String, $responsibilities: String) {
    createNavigationRoleMapping(navigationName: $navigationName, path: $path, responsibilities: $responsibilities) {
      message
      status
    }
  }
`;

/**
 * Mutation to remove a navigation-role mapping.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.mutate({
 *   mutation: removeNavigationRoleMapping,
 *   variables: { navigationPath: 'ExampleNavigationPath', responsibilities: 'ExampleResponsibilities' },
 * });
 */

export const removeNavigationRoleMapping = gql`
  mutation RemoveNavigationRoleMapping($navigationPath: String, $responsibilities: String) {
    removeNavigationRoleMapping(navigationPath: $navigationPath, responsibilities: $responsibilities) {
      message
      status
    }
  }
`;

/**
 * Query to fetch all forms.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.query({
 *   query: getAllForms,
 * });
 */

export const getAllForms = gql`
  query GetAllForms {
    getAllForms {
      id: formName
      formId
      name: title
    }
  }
`;

/**
 * Query to fetch all navigation paths.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.query({
 *   query: getAllPath,
 * });
 */

export const getAllPath = gql`
  query GetAllNavigations {
    getAllNavigations {
      name: path
      id: path
      module_name
    }
  }
`;

/**
 * Query to fetch all roles.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.query({
 *   query: getAllRoles,
 * });
 */

export const getAllRoles = gql`
  query GetAllRoles {
    getAllRoles {
      roleId
      id: roleCode
      name: roleName
    }
  }
`;

/**
 * Query to fetch all forms and roles.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.query({
 *   query: getAllFormsAndRoles,
 * });
 */

export const getAllFormsAndRoles = gql`
  query GetAllFormsAndRoles {
    getAllForms {
      id: formName
      formId
      name: title
    }
    getAllRoles {
      roleId
      id: roleCode
      name: roleName
    }
  }
`;

/**
 * Query to fetch all navigation paths and roles.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.query({
 *   query: getAllNavigationPathAndRoles,
 * });
 */

export const getAllNavigationPathAndRoles = gql`
  query GetAllNavigationPathAndRoles {
    getAllRoles {
      roleId
      id: roleCode
      name: roleName
    }
    getAllNavigationName: getAllNavigations {
      name: path
      id: name
      module_name
    }

    getAllPath: getAllNavigations {
      name: path
      id: path
      module_name
    }
  }
`;

/**
 * Query to fetch all navigation paths and roles.
 *
 * @constant
 * @type {DocumentNode}
 *
 * @example
 * const response = await api.query({
 *   query: getAllPathAndRoles,
 * });
 */

export const getAllPathAndRoles = gql`
  query GetAllPathAndRoles {
    getAllRoles {
      roleId
      id: roleCode
      name: roleName
    }

    getAllPath: getAllNavigations {
      name: path
      id: path
      module_name
    }
  }
`;
