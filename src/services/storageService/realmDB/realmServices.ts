/**
 * MOCK Realm Services for Web
 * This file provides the same interface as realmServices.native.ts 
 * but does nothing, preventing Webpack from bundling the 'realm' dependency.
 */

const realmServices = {
  storeTokens: async (_accessToken: string, _refreshToken?: string, _userId?: string, _mdn?: string): Promise<void> => {
    // No-op on web
  },
  getTokens: async (): Promise<any> => {
    return null;
  },
  removeTokens: async (): Promise<boolean> => {
    return true;
  },
};

export default realmServices;

