/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import { Buffer } from 'buffer';

// FIXME: Some methods is missing from crypto-js.
import {
  sign,
  verify,
  createPrivateKey,
  createPublicKey,
  randomBytes
} from 'crypto-js';

// used to export node's public keys to buffers
const publicKeyEncoding = {format: 'der', type: 'spki'};
// used to turn private key bytes into a buffer in DER format
const DER_PRIVATE_KEY_PREFIX = Buffer.from(
  '302e020100300506032b657004220420', 'hex');
// used to turn public key bytes into a buffer in DER format
const DER_PUBLIC_KEY_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

const api = {
  /**
   * Generates a key using a 32 byte Uint8Array.
   *
   * @param {Uint8Array} seedBytes - The bytes for the private key.
   *
   * @returns {object} The object with the public and private key material.
  */
  async generateKeyPairFromSeed(seedBytes) {
    const privateKey = await createPrivateKey({
      // node is more than happy to create a new private key using a DER
      key: _privateKeyDerEncode({seedBytes}),
      format: 'der',
      type: 'pkcs8'
    });
    // this expects either a PEM encoded key or a node privateKeyObject
    const publicKey = await createPublicKey(privateKey);
    const publicKeyBuffer = publicKey.export(publicKeyEncoding);
    const publicKeyBytes = getKeyMaterial(publicKeyBuffer);
    return {
      publicKey: publicKeyBytes,
      secretKey: Buffer.concat([seedBytes, publicKeyBytes])
    };
  },
  // generates an ed25519 key using a random seed
  async generateKeyPair() {
    const seed = randomBytes(32);
    return api.generateKeyPairFromSeed(seed);
  },
  async sign(privateKeyBytes, data) {
    const privateKey = await createPrivateKey({
      key: _privateKeyDerEncode({privateKeyBytes}),
      format: 'der',
      type: 'pkcs8'
    });
    return sign(null, data, privateKey);
  },
  async verify(publicKeyBytes, data, signature) {
    const publicKey = await createPublicKey({
      key: _publicKeyDerEncode({publicKeyBytes}),
      format: 'der',
      type: 'spki'
    });
    return verify(null, data, publicKey, signature);
  }
};

export default api;

/**
 * The key material is the part of the buffer after the DER Prefix.
 *
 * @param {Buffer} buffer - A DER encoded key buffer.
 *
 * @throws {Error} If the buffer does not contain a valid DER Prefix.
 *
 * @returns {Buffer} The key material part of the Buffer.
*/
function getKeyMaterial(buffer) {
  if(buffer.indexOf(DER_PUBLIC_KEY_PREFIX) === 0) {
    return buffer.slice(DER_PUBLIC_KEY_PREFIX.length, buffer.length);
  }
  if(buffer.indexOf(DER_PRIVATE_KEY_PREFIX) === 0) {
    return buffer.slice(DER_PRIVATE_KEY_PREFIX.length, buffer.length);
  }
  throw new Error('Expected Buffer to match Ed25519 Public or Private Prefix');
}
/**
 * Takes a Buffer or Uint8Array with the raw private key and encodes it
 * in DER-encoded PKCS#8 format.
 * Allows Uint8Arrays to be interoperable with node's crypto functions.
 *
 * @param {object} options - Options to use.
 * @param {Buffer} [options.privateKeyBytes] - Required if no seedBytes.
 * @param {Buffer} [options.seedBytes] - Required if no privateKeyBytes.
 *
 * @throws {TypeError} Throws if the supplied buffer is not of the right size
 *  or not a Uint8Array or Buffer.
 *
 * @returns {Buffer} DER private key prefix + key bytes.
*/
export function _privateKeyDerEncode({privateKeyBytes, seedBytes}) {
  if(!(privateKeyBytes || seedBytes)) {
    throw new TypeError('`privateKeyBytes` or `seedBytes` is required.');
  }
  if(!privateKeyBytes && !(seedBytes instanceof Uint8Array &&
    seedBytes.length === 32)) {
    throw new TypeError('`seedBytes` must be a 32 byte Buffer.');
  }
  if(!seedBytes && !(privateKeyBytes instanceof Uint8Array &&
    privateKeyBytes.length === 64)) {
    throw new TypeError('`privateKeyBytes` must be a 64 byte Buffer.');
  }
  let p;
  if(seedBytes) {
    p = seedBytes;
  } else {
    // extract the first 32 bytes of the 64 byte private key representation
    p = privateKeyBytes.slice(0, 32);
  }
  return Buffer.concat([DER_PRIVATE_KEY_PREFIX, p]);
}

/**
 * Takes a Uint8Array of public key bytes and encodes it in DER-encoded
 * SubjectPublicKeyInfo (SPKI) format.
 * Allows Uint8Arrays to be interoperable with node's crypto functions.
 *
 * @param {object} options - Options to use.
 * @param {Uint8Array} options.publicKeyBytes - The keyBytes.
 *
 * @throws {TypeError} Throws if the bytes are not Uint8Array or of length 32.
 *
 * @returns {Buffer} DER Public key Prefix + key bytes.
*/
export function _publicKeyDerEncode({publicKeyBytes}) {
  if(!(publicKeyBytes instanceof Uint8Array && publicKeyBytes.length === 32)) {
    throw new TypeError('`publicKeyBytes` must be a 32 byte Buffer.');
  }
  return Buffer.concat([DER_PUBLIC_KEY_PREFIX, publicKeyBytes]);
}
