/**
 * reducer query definitions
 */
import { gql } from '@apollo/client';

export const REDIRECTION_LOGIN_QUERY = gql`
  query RedirectionLogin {
    redirectionLogin {
      user {
        roleId
        userId
        accessToken
        refreshToken
        accessExpiry
        refreshExpiry
        mdn
        name
        userStatus
        navigation
        hideAscWarranty
        internalRole
        internalRoleNT
      }
      redirectionInfo {
        sourceName
        moduleName
        subModuleName
        language
        moduleWiseParams
      }
    }
  }
`;

export const generateRedirectionToken = gql`
  mutation GetRedirectionToken($moduleName: String, $subModuleName: String, $language: String) {
    getRedirectionToken(moduleName: $moduleName, subModuleName: $subModuleName, language: $language) {
      message
      status
      code
      data
      errors
    }
  }
`;
