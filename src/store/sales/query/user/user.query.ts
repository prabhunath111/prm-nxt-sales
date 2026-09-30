/**
 * reducer query definitions
 */
import { gql } from '@apollo/client';

export const LOGIN_QUERY = gql`
  mutation Login($userName: String, $password: String, $isPrmLogin: Boolean) {
    login(userName: $userName, password: $password, isPrmLogin: $isPrmLogin) {
      accessToken
      refreshToken
      accessExpiry
      refreshExpiry
      userId
      mdn
      name
      roleId
      userStatus
      navigation
      internalRole
      internalRoleNT
      hideAscWarranty
      eligibleStoreAutomation
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      tokenStatus
      accessToken
      accessExpiry
      refreshToken
      refreshExpiry
    }
  }
`;

export const INIT_MIXPANEL = gql`
  mutation SetMetadata($distinctId: String!, $metadata: JSON!) {
    setMetadata(distinctId: $distinctId, metadata: $metadata) {
      metaStatus
      metaMessage
    }
  }
`;

export const getAsmCsmMobileName = gql`
  query GetAsmCsmMobileName {
    getAsmCsmMobileName {
      name
      mobile
      status
      message
    }
  }
`;

export const loginWithOtp = gql`
  mutation Login($userName: String, $mdn: String, $isPrmLogin: Boolean, $deviceId: String) {
    login(userName: $userName, mdn: $mdn, isPrmLogin: $isPrmLogin, deviceId: $deviceId) {
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
      languagePreference
      eligibleStoreAutomation
    }
  }
`;

export const loginOtpVerification = gql`
  mutation Login($userName: String, $mdn: String, $isPrmLogin: Boolean, $deviceId: String, $otp: String) {
    login(userName: $userName, mdn: $mdn, isPrmLogin: $isPrmLogin, deviceId: $deviceId, otp: $otp) {
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
      languagePreference
      eligibleStoreAutomation
    }
  }
`;

export const handleRefreshToken = gql`
  mutation RefreshToken($userId: String!, $deviceId: String) {
    refreshToken(userId: $userId, deviceId: $deviceId) {
      tokenStatus
      accessToken
      accessExpiry
      refreshToken
      refreshExpiry
    }
  }
`;

export const checkMultipleLogins = gql`
  query GetloginInUserDetails($userId: String!, $deviceId: String, $checkDeviceIsActive: Boolean) {
    getloginInUserDetails(userId: $userId, deviceId: $deviceId, checkDeviceIsActive: $checkDeviceIsActive) {
      transMessage
      tranStatus
    }
  }
`;

export const loginWithLocalAuth = gql`
  query DataForLocalAuth($userName: String!) {
    dataForLocalAuth(userName: $userName) {
      roleId
      userId
      mdn
      name
      userStatus
      navigation
      isDeviceAuthEnabled
    }
  }
`;
export const LOGOUT = gql`
  mutation Logout($deviceId: String) {
    logout(deviceId: $deviceId)
  }
`;
