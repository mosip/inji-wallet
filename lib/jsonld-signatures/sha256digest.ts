import crypto from 'isomorphic-webcrypto';
import 'fast-text-encoding';

/**
 * Hashes a string of data using SHA-256.
 *
 * @param {string} string - the string to hash.
 *
 * @return {Uint8Array} the hash digest.
 */
export async function sha256digest({ string }: any) {
  const bytes = new TextEncoder().encode(string);

  return new Uint8Array(await crypto.subtle.digest({ name: 'SHA-256' }, bytes));
}
