/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */

// import { Ed25519KeyPair } from 'crypto-ld';
import { Ed25519VerificationKey2018 } from './Ed25519VerificationKey2018';
import { JwsLinkedDataSignature } from '../JwsLinkedDataSignature';

export class Ed25519Signature2018 extends JwsLinkedDataSignature {
  /**
   * @param type {string} Provided by subclass.
   *
   * One of these parameters is required to use a suite for signing:
   *
   * @param [creator] {string} A key id URL to the paired public key.
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
    signer,
    key,
    verificationMethod,
    proof,
    date,
    useNativeCanonize,
  }: any = {}) {
    super({
      type: 'Ed25519Signature2018',
      alg: 'EdDSA',
      LDKeyClass: Ed25519VerificationKey2018,
      verificationMethod,
      signer,
      key,
      proof,
      date,
      useNativeCanonize,
    });
    this.requiredKeyType = 'Ed25519VerificationKey2018';
  }
}
