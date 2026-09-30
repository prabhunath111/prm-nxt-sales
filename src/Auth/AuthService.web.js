import { jwtDecode } from 'jwt-decode';
import { PublicClientApplication } from '@azure/msal-browser';
import { webMsalConfig } from './AuthConfig';
import { PROPERTIES } from 'const';

const msalInstance = new PublicClientApplication(webMsalConfig);
let isInitialized = false;

const initialize = async () => {
  if (!isInitialized) {
    await msalInstance.initialize();
    isInitialized = true;
  }
};

export const login = async () => {
  await initialize();
  try {
    const response = await msalInstance.loginPopup({
      scopes: PROPERTIES.AD_LOGIN,
      prompt: 'select_account',
    });
    const decodedUser = jwtDecode(response.idToken);
    return {
      accessToken: response.idToken,
      idToken: response.idToken,
      user: decodedUser,
      originalResult: response,
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  await initialize();
  return msalInstance.logoutPopup();
};
