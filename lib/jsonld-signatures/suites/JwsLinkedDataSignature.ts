/*!
 * Copyright (c) 2020-2021 Digital Bazaar, Inc. All rights reserved.
 */
import { Buffer } from 'buffer';
import 'fast-text-encoding';
import jsonld from 'jsonld';
import LinkedDataSignature from 'jsonld-signatures/lib/suites/LinkedDataSignature';
import { encode, decode } from 'base64url-universal';

export interface JwsLinkedDataSignature {
  [key: string]: any;
}

export class JwsLinkedDataSignature extends LinkedDataSignature {
  /**
   * @param type {string} Provided by subclass.
   * @param alg {string} JWS alg provided by subclass.
   * @param [LDKeyClass] {LDKeyClass} provided by subclass or subclass
   *   overrides `getVerificationMethod`.
   *
   * @param [verificationMethod] {string} A key id URL to the paired public key.
   *
   * This parameter is required for signing:
   *
   * @param [signer] {function} an optional signer.
   *
   * Advanced optional parameters and overrides:
   *
   * @param [proof] {object} a JSON-LD document with options to use for
   *   the `proof` node (e.g. any other custom fields can be provided here
   *   using a context different from security-v2).
   * @param [date] {string|Date} signing date to use if not passed.
   * @param [key] {LDKeyPair} an optional crypto-ld KeyPair.
   * @param [useNativeCanonize] {boolean} true to use a native canonize
   *   algorithm.
   */
  constructor({
    type,
    alg,
    LDKeyClass,
    verificationMethod,
    signer,
    key,
    proof,
    date,
    useNativeCanonize,
  }: any = {}) {
    super({ type, verificationMethod, proof, date, useNativeCanonize });
    this.alg = alg;
    this.LDKeyClass = LDKeyClass;
    this.signer = signer;
    if (key) {
      if (verificationMethod === undefined) {
        const publicKey = key.export({ publicKey: true });
        this.verificationMethod = publicKey.id;
      }
      this.key = key;
      if (typeof key.signer === 'function') {
        this.signer = key.signer();
      }
      if (typeof key.verifier === 'function') {
        this.verifier = key.verifier();
      }
    }
  }

  /**
   * @param verifyData {Uint8Array}.
   * @param proof {object}
   *
   * @returns {Promise<{object}>} the proof containing the signature value.
   */
  async sign({ verifyData, proof }) {
    if (!(this.signer && typeof this.signer.sign === 'function')) {
      throw new Error('A signer API has not been specified.');
    }
    // JWS header
    const header = {
      alg: this.alg,
      b64: false,
      crit: ['b64'],
    };

    /*
    +-------+-----------------------------------------------------------+
    | "b64" | JWS Signing Input Formula                                 |
    +-------+-----------------------------------------------------------+
    | true  | ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.' ||     |
    |       | BASE64URL(JWS Payload))                                   |
    |       |                                                           |
    | false | ASCII(BASE64URL(UTF8(JWS Protected Header)) || '.') ||    |
    |       | JWS Payload                                               |
    +-------+-----------------------------------------------------------+
    */

    // create JWS data and sign
    const encodedHeader = encode(JSON.stringify(header));

    const data = _createJws({ encodedHeader, verifyData });

    const signature = await this.signer.sign({ data });

    // create detached content signature
    const encodedSignature = encode(signature);
    proof.jws = encodedHeader + '..' + encodedSignature;
    return proof;
  }

  /**
   * @param verifyData {Uint8Array}.
   * @param verificationMethod {object}.
   * @param document {object} the document the proof applies to.
   * @param proof {object} the proof to be verified.
   * @param purpose {ProofPurpose}
   * @param documentLoader {function}
   * @param expansionMap {function}
   *
   * @returns {Promise<{boolean}>} Resolves with the verification result.
   */
  async verifySignature({ verifyData, verificationMethod, proof }) {
    if (
      !(proof.jws && typeof proof.jws === 'string' && proof.jws.includes('.'))
    ) {
      throw new TypeError('The proof does not include a valid "jws" property.');
    }
    // add payload into detached content signature
    const [encodedHeader /*payload*/, , encodedSignature] =
      proof.jws.split('.');

    let header;
    try {
      header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
    } catch (e) {
      throw new Error(`Could not parse JWS header; ${e}`);
    }
    if (!(header && typeof header === 'object')) {
      throw new Error('Invalid JWS header.');
    }

    // confirm header matches all expectations
    if (
      !(
        header.alg === this.alg &&
        header.b64 === false &&
        Array.isArray(header.crit) &&
        header.crit.length === 1 &&
        header.crit[0] === 'b64'
      ) &&
      Object.keys(header).length === 3
    ) {
      throw new Error(`Invalid JWS header parameters for ${this.type}.`);
    }

    // do signature verification
    const signature = Buffer.from(encodedSignature, 'base64');

    const data = _createJws({ encodedHeader, verifyData });

    let { verifier } = this;
    if (!verifier) {
      const key = await this.LDKeyClass.from(verificationMethod);
      verifier = key.verifier();
    }
    return verifier.verify({ data, signature });
  }

  async assertVerificationMethod({ verificationMethod }) {
    if (!jsonld.hasValue(verificationMethod, 'type', this.requiredKeyType)) {
      throw new Error(
        `Invalid key type. Key type must be "${this.requiredKeyType}".`
      );
    }
  }

  async getVerificationMethod({ proof, documentLoader }) {
    if (this.key) {
      return this.key.export({ publicKey: true });
    }

    const verificationMethod = await super.getVerificationMethod({
      proof,
      documentLoader,
    });
    await this.assertVerificationMethod({ verificationMethod });
    return verificationMethod;
  }

  async matchProof({ proof, document, purpose, documentLoader, expansionMap }) {
    if (
      !(await super.matchProof({
        proof,
        document,
        purpose,
        documentLoader,
        expansionMap,
      }))
    ) {
      return false;
    }
    // NOTE: When subclassing this suite: Extending suites will need to check
    // for the presence their contexts here and in sign()

    if (!this.key) {
      // no key specified, so assume this suite matches and it can be retrieved
      return true;
    }

    const { verificationMethod } = proof;

    // only match if the key specified matches the one in the proof
    if (typeof verificationMethod === 'object') {
      return verificationMethod.id === this.key.id;
    }
    return verificationMethod === this.key.id;
  }
}

/**
 * Creates the bytes ready for signing.
 *
 * @param {string} encodedHeader - base64url encoded JWT header.
 * @param {Uint8Array} verifyData - Payload to sign/verify.
 * @returns {Uint8Array} A combined byte array for signing.
 */
function _createJws({ encodedHeader, verifyData }) {
  const encodedHeaderBytes = new TextEncoder().encode(encodedHeader + '.');

  // concatenate the two uint8arrays
  const data = new Uint8Array(encodedHeaderBytes.length + verifyData.length);
  data.set(encodedHeaderBytes, 0);
  data.set(verifyData, encodedHeaderBytes.length);
  return data;
}
