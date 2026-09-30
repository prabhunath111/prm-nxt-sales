/**
 * MOCK Realm Schema for Web
 * Realm is not supported on web; this file prevents Webpack from 
 * attempting to bundle the native realm package.
 */
export const getEncryptedRealm = (_encryptionKey: Uint8Array): any => {
  throw new Error('Realm is not supported on Web');
};

const realmSchema: any = null;
export default realmSchema;

