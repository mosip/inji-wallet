/*
 * Copyright (c) 2018-2020 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Wraps Base58 decoding operations in
 * order to provide consistent error messages.
 * @ignore
 * @example
 * > const pubkeyBytes = _base58Decode({
 *    decode: base58.decode,
 *    keyMaterial: this.publicKeyBase58,
 *    type: 'public'
 *   });
 * @param {object} options - The decoder options.
 * @param {Function} options.decode - The decode function to use.
 * @param {string} options.keyMaterial - The Base58 encoded
 * key material to decode.
 * @param {string} options.type - A description of the
 * key material that will be included
 * in an error message (e.g. 'public', 'private').
 *
 * @returns {object} - The decoded bytes. The data structure for the bytes is
 *   determined by the provided decode function.
 */
export function base58Decode({decode, keyMaterial, type}) {
  let bytes;
  try {
    bytes = decode(keyMaterial);
  } catch(e) {
    // do nothing
    // this helper throws when no result is produced
  }
  if(bytes === undefined) {
    throw new TypeError(`The ${type} key material must be Base58 encoded.`);
  }
  return bytes;
}
