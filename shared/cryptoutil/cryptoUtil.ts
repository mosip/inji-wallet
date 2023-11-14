/**
 * NOTE: Encryption for MMKV datastore has been disabled temporarily for
 *  **iOS devices ONLY** to evaluate the cause of an infrequent data loss
 *  issue. For more information see
 * https://github.com/mosip/inji/pull/1006/files &
 * https://mosip.atlassian.net/browse/INJI-149
 */
import {KeyPair, RSA} from 'react-native-rsa-native';
import forge from 'node-forge';
import {BIOMETRIC_CANCELLED, DEBUG_MODE_ENABLED, isIOS} from '../constants';
import SecureKeystore from 'react-native-secure-keystore';
import CryptoJS from 'crypto-js';
import {BiometricCancellationError} from '../error/BiometricCancellationError';

// 5min
export const AUTH_TIMEOUT = 5 * 60;
export const ENCRYPTION_ID = 'c7c22a6c-9759-4605-ac88-46f4041d863d';
export const HMAC_ALIAS = '860cc320-4248-11ee-be56-0242ac120002';
//This key is used to request biometric at app open to reset auth timeout which is used by encryption key
export const DUMMY_KEY_FOR_BIOMETRIC_ALIAS =
  '9a6cfc0e-4248-11ee-be56-0242ac120002';

export function generateKeys(): Promise<KeyPair> {
  return Promise.resolve(RSA.generateKeys(4096));
}

/**
 * isCustomKeystore is a cached check of existence of a hardware keystore.
 */
export const isHardwareKeystoreExists = isCustomSecureKeystore();

export async function getJWT(
  header: object,
  payLoad: object,
  individualId: string,
  privateKey: string,
) {
  try {
    const header64 = encodeB64(JSON.stringify(header));
    const payLoad64 = encodeB64(JSON.stringify(payLoad));
    const preHash = header64 + '.' + payLoad64;
    const signature64 = await createSignature(
      privateKey,
      preHash,
      individualId,
    );
    return header64 + '.' + payLoad64 + '.' + signature64;
  } catch (e) {
    console.log('Exception Occurred While Constructing JWT ', e);
    throw e;
  }
}

export async function createSignature(
  privateKey: string,
  preHash: string,
  individualId: string,
) {
  let signature64;

  if (!isHardwareKeystoreExists) {
    const key = forge.pki.privateKeyFromPem(privateKey);
    const md = forge.md.sha256.create();
    md.update(preHash, 'utf8');

    const signature = key.sign(md);
    return encodeB64(signature);
  } else {
    try {
      signature64 = await SecureKeystore.sign(individualId, preHash);
    } catch (error) {
      console.error('Error in creating signature:', error);
      if (error.toString().includes(BIOMETRIC_CANCELLED)) {
        throw new BiometricCancellationError(error.toString());
      }
      throw error;
    }

    return replaceCharactersInB64(signature64);
  }
}

function replaceCharactersInB64(encodedB64: string) {
  return encodedB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function encodeB64(str: string) {
  const encodedB64 = forge.util.encode64(str);
  return replaceCharactersInB64(encodedB64);
}

/**
 * DO NOT USE DIRECTLY and/or REPEATEDLY in application lifeycle.
 *
 * This can make a call to the Android native layer hence taking up more time,
 *  use the isCustomKeystore constant in the app lifeycle instead.
 */
function isCustomSecureKeystore() {
  return !isIOS() ? SecureKeystore.deviceSupportsHardware() : false;
}

export interface WalletBindingResponse {
  walletBindingId: string;
  keyId: string;
  thumbprint: string;
  expireDateTime: string;
}

export async function encryptJson(
  encryptionKey: string,
  data: string,
): Promise<string> {
  try {
    // Disable Encryption in debug mode & for iPhones
    if ((DEBUG_MODE_ENABLED && __DEV__) || isIOS()) {
      return JSON.stringify(data);
    }
    if (!isHardwareKeystoreExists) {
      return CryptoJS.AES.encrypt(data, encryptionKey).toString();
    }
    return await SecureKeystore.encryptData(ENCRYPTION_ID, data);
  } catch (error) {
    console.error('error while encrypting:', error);
    if (error.toString().includes(BIOMETRIC_CANCELLED)) {
      throw new BiometricCancellationError(error.toString());
    }
    throw error;
  }
}

export async function decryptJson(
  encryptionKey: string,
  encryptedData: string,
): Promise<string> {
  try {
    if (encryptedData === null || encryptedData === undefined) {
      // to avoid crash in case of null or undefined
      return '';
    }
    // Disable Encryption in debug mode
    if ((DEBUG_MODE_ENABLED && __DEV__) || isIOS()) {
      return JSON.parse(encryptedData);
    }

    if (!isHardwareKeystoreExists) {
      return CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(
        CryptoJS.enc.Utf8,
      );
    }

    return await SecureKeystore.decryptData(ENCRYPTION_ID, encryptedData);
  } catch (e) {
    console.error('error decryptJson:', e);

    if (e.toString().includes(BIOMETRIC_CANCELLED)) {
      throw new BiometricCancellationError(e.toString());
    }
    throw e;
  }
}
