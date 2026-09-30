import Realm from 'realm';
import { STRINGS } from 'const';

class SalesSchema extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: STRINGS.REALM_KEY,
    primaryKey: 'key',
    properties: {
      key: 'string',
      accessToken: { type: 'string', default: '' },
      refreshToken: { type: 'string', default: '' },
      userId: { type: 'string', default: '' },
      mdn: { type: 'string', default: '' },
    },
  };
}

/**
 * Initializes and returns an encrypted Realm instance.
 * @param {Uint8Array} encryptionKey - 64-byte encryption key.
 */
export const getEncryptedRealm = (encryptionKey: Uint8Array): Realm =>
  new Realm({
    schema: [SalesSchema],
    schemaVersion: 1,
    encryptionKey,
  });
// Default export remains for backward compatibility but without encryption unless handled.
const realmSchema = new Realm({ schema: [SalesSchema], schemaVersion: 1 });
export default realmSchema;
