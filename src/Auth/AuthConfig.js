import { Platform } from 'react-native';
import env from 'config/env';
import { PROPERTIES, STRINGS } from 'const';

export const AZURE_TENANT_ID = env.AZURE_TENANT_ID;

export const AZURE_CLIENT_ID = Platform.select({
  web: env.WEB_CLIENT_ID,
  default: env.MOBILE_CLIENT_ID,
});

export const mobileAuthConfig = {
  issuer: `${env.AD_URL}${AZURE_TENANT_ID}/v2.0`.replace(/([^:]\/)\/+/g, '$1'),
  clientId: AZURE_CLIENT_ID,
  redirectUrl: 'msauth.com.tpsales://auth',

  scopes: PROPERTIES.AD_SCOPE,
  additionalParameters: {
    prompt: STRINGS.AD_PROMT,
  },
};


export const webMsalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: `${env.AD_URL}${AZURE_TENANT_ID}`,
    redirectUri: typeof window !== 'undefined' ? window.location.origin : undefined,
  },
  cache: {
    cacheLocation: STRINGS.SESSION_STORAGE,
    storeAuthStateInCookie: false,
  },
};
