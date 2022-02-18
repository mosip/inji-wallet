/*!
 * Copyright (c) 2018-2020 Digital Bazaar, Inc. All rights reserved.
 */
import * as bs58 from 'base58-universal/main';
import * as util from './util';
import ed25519 from './ed25519';
import {LDKeyPair} from 'crypto-ld';

const SUITE_ID = 'Ed25519VerificationKey2018';

class Ed25519VerificationKey2018 extends LDKeyPair {
  /**
   * An implementation of the Ed25519VerificationKey spec, for use with
   * Linked Data Proofs.
   * @see https://w3c-dvcg.github.io/lds-ed25519-2018/
   * @see https://github.com/digitalbazaar/jsonld-signatures
   * @example
   * > const privateKeyBase58 =
   *   '3Mmk4UzTRJTEtxaKk61LxtgUxAa2Dg36jF6VogPtRiKvfpsQWKPCLesKSV182RMmvM'
   *   + 'JKk6QErH3wgdHp8itkSSiF';
   * > const options = {
   *   publicKeyBase58: 'GycSSui454dpYRKiFdsQ5uaE8Gy3ac6dSMPcAoQsk8yq',
   *   privateKeyBase58
   * };
   * > const EDKey = new Ed25519VerificationKey2018(options);
   * > EDKey
   * Ed25519VerificationKey2018 { ...
   * @param {object} options - Options hashmap.
   * @param {string} options.controller - Controller DID or document url.
   * @param {string} [options.id] - The key ID. If not provided, will be
   * @param {string} options.publicKeyBase58 - Base58btc encoded Public Key.
   * @param {string} [options.privateKeyBase58] - Base58btc Private Key.
   * @param {string} [options.revoked] - Timestamp of when the key has been
   *   revoked, in RFC3339 format. If not present, the key itself is considered
   *   not revoked. Note that this mechanism is slightly different than DID
   *   Document key revocation, where a DID controller can revoke a key from
   *   that DID by removing it from the DID Document.
   */
  constructor(options: any = {}) {
    super(options);
    this.type = SUITE_ID;
    this.publicKeyBase58 = options.publicKeyBase58;
    if(!this.publicKeyBase58) {
      throw new TypeError('The "publicKeyBase58" property is required.');
    }
    this.privateKeyBase58 = options.privateKeyBase58;
    if(this.controller && !this.id) {
      this.id = `${this.controller}#${this.fingerprint()}`;
    }
  }

  /**
   * Creates an instance of LDKeyPair from a key fingerprint.
   * Note: Only key types that use their full public key in the fingerprint
   * are supported (so, currently, only 'ed25519').
   *
   * @param {string} fingerprint
   * @returns {LDKeyPair}
   * @throws Unsupported Fingerprint Type.
   */
  static fromFingerprint({fingerprint} = {}) {
    if(!fingerprint ||
       !(typeof fingerprint === 'string' && fingerprint[0] === 'z')) {
      throw new Error('`fingerprint` must be a multibase encoded string.');
    }

    // skip leading `z` that indicates base58 encoding
    const buffer = bs58.decode(fingerprint.substr(1));

    // buffer is: 0xed 0x01 <public key bytes>
    if(buffer[0] === 0xed && buffer[1] === 0x01) {
      return new Ed25519VerificationKey2018({
        publicKeyBase58: bs58.encode(buffer.slice(2))
      });
    }

    throw new Error(`Unsupported fingerprint "${fingerprint}".`);
  }

  /**
   * Generates a KeyPair with an optional deterministic seed.
   * @example
   * > const keyPair = await Ed25519VerificationKey2018.generate();
   * > keyPair
   * Ed25519VerificationKey2018 { ...
   * @param {object} [options={}] - See LDKeyPair
   * docstring for full list.
   * @param {Uint8Array|Buffer} [options.seed] -
   * a 32-byte array seed for a deterministic key.
   *
   * @returns {Promise<Ed25519VerificationKey2018>} Generates a key pair.
   */
  static async generate(options = {}) {
    let keyObject;
    if(options.seed) {
      keyObject = await ed25519.generateKeyPairFromSeed(options.seed);
    } else {
      keyObject = await ed25519.generateKeyPair();
    }
    return new Ed25519VerificationKey2018({
      publicKeyBase58: bs58.encode(keyObject.publicKey),
      privateKeyBase58: bs58.encode(keyObject.secretKey),
      ...options
    });
  }

  /**
   * Creates an Ed25519 Key Pair from an existing serialized key pair.
   * @example
   * > const keyPair = await Ed25519VerificationKey2018.from({
   *     controller: 'did:ex:1234',
   *     type: 'Ed25519VerificationKey2018',
   *     publicKeyBase58,
   *     privateKeyBase58
   *   });
   *
   * @returns {Promise<Ed25519VerificationKey2018>} An Ed25519 Key Pair.
   */
  static async from(options) {
    return new Ed25519VerificationKey2018(options);
  }

  /**
   * Returns a signer object for use with Linked Data Proofs.
   * @see https://github.com/digitalbazaar/jsonld-signatures
   * @example
   * > const signer = keyPair.signer();
   * > signer
   * { sign: [AsyncFunction: sign] }
   * > signer.sign({data});
   *
   * @returns {{sign: Function}} A signer for the json-ld block.
   */
  signer() {
    const signer = ed25519SignerFactory(this);
    signer.id = this.id;
    return signer;
  }

  /**
   * Returns a verifier object for use with signature suites.
   * @see https://github.com/digitalbazaar/jsonld-signatures
   *
   * @example
   * > const verifier = keyPair.verifier();
   * > verifier
   * { verify: [AsyncFunction: verify] }
   * > verifier.verify(key);
   *
   * @returns {{verify: Function}} Used to verify jsonld-signatures.
   */
  verifier() {
    const verifier = ed25519VerifierFactory(this);
    verifier.id = this.id;
    return verifier;
  }

  /**
   * Exports the serialized representation of the KeyPair
   * and other information that json-ld Signatures can use to form a proof.
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {boolean} [options.publicKey] - Export public key material?
   * @param {boolean} [options.privateKey] - Export private key material?
   * @param {boolean} [options.includeContext] - Include JSON-LD context?
   *
   * @returns {object} A public key object
   *   information used in verification methods by signatures.
   */
  export({publicKey = false, privateKey = false, includeContext = false} = {}) {
    if(!(publicKey || privateKey)) {
      throw new TypeError(
        'Export requires specifying either "publicKey" or "privateKey".');
    }
    const exportedKey = {
      id: this.id,
      type: this.type
    };
    if(includeContext) {
      exportedKey['@context'] = Ed25519VerificationKey2018.SUITE_CONTEXT;
    }
    if(this.controller) {
      exportedKey.controller = this.controller;
    }
    if(publicKey) {
      exportedKey.publicKeyBase58 = this.publicKeyBase58;
    }
    if(privateKey) {
      exportedKey.privateKeyBase58 = this.privateKeyBase58;
    }
    if(this.revoked) {
      exportedKey.revoked = this.revoked;
    }
    return exportedKey;
  }

  /**
   * Generates and returns a multiformats encoded
   * ed25519 public key fingerprint (for use with cryptonyms, for example).
   * @see https://github.com/multiformats/multicodec
   *
   * @param {string} publicKeyBase58 - The base58 encoded public key material.
   *
   * @returns {string} The fingerprint.
   */
  static fingerprintFromPublicKey({publicKeyBase58} = {}) {
    // ed25519 cryptonyms are multicodec encoded values, specifically:
    // (multicodec ed25519-pub 0xed01 + key bytes)
    const pubkeyBytes = util.base58Decode({
      decode: bs58.decode,
      keyMaterial: publicKeyBase58,
      type: 'public'
    });
    const buffer = new Uint8Array(2 + pubkeyBytes.length);
    buffer[0] = 0xed;
    buffer[1] = 0x01;
    buffer.set(pubkeyBytes, 2);
    // prefix with `z` to indicate multi-base base58btc encoding
    return `z${bs58.encode(buffer)}`;
  }

  /**
   * Generates and returns a multiformats encoded
   * ed25519 public key fingerprint (for use with cryptonyms, for example).
   * @see https://github.com/multiformats/multicodec
   *
   * @returns {string} The fingerprint.
   */
  fingerprint() {
    const {publicKeyBase58} = this;
    return Ed25519VerificationKey2018
      .fingerprintFromPublicKey({publicKeyBase58});
  }

  /**
   * Tests whether the fingerprint was generated from a given key pair.
   * @example
   * > edKeyPair.verifyFingerprint({fingerprint: 'z2S2Q6MkaFJewa'});
   * {valid: true};
   * @param {string} fingerprint - A Base58 public key.
   *
   * @returns {object} An object indicating valid is true or false.
   */
  verifyFingerprint({fingerprint} = {}) {
    // fingerprint should have `z` prefix indicating
    // that it's multi-base encoded
    if(!(typeof fingerprint === 'string' && fingerprint[0] === 'z')) {
      return {
        error: new Error('`fingerprint` must be a multibase encoded string.'),
        valid: false
      };
    }
    let fingerprintBuffer;
    try {
      fingerprintBuffer = util.base58Decode({
        decode: bs58.decode,
        keyMaterial: fingerprint.slice(1),
        type: `fingerprint's`
      });
    } catch(e) {
      return {error: e, valid: false};
    }
    let publicKeyBuffer;
    try {
      publicKeyBuffer = util.base58Decode({
        decode: bs58.decode,
        keyMaterial: this.publicKeyBase58,
        type: 'public'
      });
    } catch(e) {
      return {error: e, valid: false};
    }

    const buffersEqual = _isEqualBuffer(
      publicKeyBuffer, fingerprintBuffer.slice(2));

    // validate the first two multicodec bytes 0xed01
    const valid = fingerprintBuffer[0] === 0xed &&
      fingerprintBuffer[1] === 0x01 &&
      buffersEqual;
    if(!valid) {
      return {
        error: new Error('The fingerprint does not match the public key.'),
        valid: false
      };
    }
    return {valid};
  }
}

/**
 * @ignore
 * Returns an object with an async sign function.
 * The sign function is bound to the KeyPair
 * and then returned by the KeyPair's signer method.
 * @param {Ed25519VerificationKey2018} key - A key par instance.
 * @example
 * > const mySigner = ed25519SignerFactory(edKeyPair);
 * > await mySigner.sign({data})
 *
 * @returns {{sign: Function}} An object with an async function sign
 * using the private key passed in.
 */
function ed25519SignerFactory(key) {
  if(!key.privateKeyBase58) {
    return {
      async sign() {
        throw new Error('No private key to sign with.');
      }
    };
  }
  const privateKeyBytes = util.base58Decode({
    decode: bs58.decode,
    keyMaterial: key.privateKeyBase58,
    type: 'private'
  });
  return {
    async sign({data}) {
      const signature = ed25519.sign(privateKeyBytes, data);
      return signature;
    }
  };
}

/**
 * @ignore
 * Returns an object with an async verify function.
 * The verify function is bound to the KeyPair
 * and then returned by the KeyPair's verifier method.
 * @param {Ed25519VerificationKey2018} key - An Ed25519VerificationKey2018.
 * @example
 * > const myVerifier = ed25519Verifier(edKeyPair);
 * > await myVerifier.verify({data, signature});
 *
 * @returns {{verify: Function}} An async verifier specific
 * to the key passed in.
 */
function ed25519VerifierFactory(key) {
  const publicKeyBytes = util.base58Decode({
    decode: bs58.decode,
    keyMaterial: key.publicKeyBase58,
    type: 'public'
  });
  return {
    async verify({data, signature}) {
      return ed25519.verify(publicKeyBytes, data, signature);
    }
  };
}

function _isEqualBuffer(buf1, buf2) {
  if(buf1.length !== buf2.length) {
    return false;
  }
  for(let i = 0; i < buf1.length; i++) {
    if(buf1[i] !== buf2[i]) {
      return false;
    }
  }
  return true;
}
// Used by CryptoLD harness for dispatching.
Ed25519VerificationKey2018.suite = SUITE_ID;
// Used by CryptoLD harness's fromKeyId() method.
Ed25519VerificationKey2018.SUITE_CONTEXT =
  'https://w3id.org/security/suites/ed25519-2018/v1';

export {
  Ed25519VerificationKey2018
};
