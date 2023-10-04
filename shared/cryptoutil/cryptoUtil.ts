import {KeyPair, RSA} from 'react-native-rsa-native';
import forge from 'node-forge';
import getAllConfigurations from '../commonprops/commonProps';
import {DEBUG_MODE_ENABLED, isIOS} from '../constants';
import SecureKeystore from 'react-native-secure-keystore';
import Storage from '../storage';
import CryptoJS from 'crypto-js';

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

export async function getJwt(
  privateKey: string,
  individualId: string,
  thumbprint: string,
) {
  try {
    var iat = Math.floor(new Date().getTime() / 1000);
    var exp = Math.floor(new Date().getTime() / 1000) + 18000;

    var config = await getAllConfigurations();

    const header = {
      alg: 'RS256',
      //'kid': keyId,
      'x5t#S256': thumbprint,
    };

    const payloadJSON = JSON.stringify({
      iss: config.issuer,
      sub: individualId,
      aud: config.audience,
      iat: iat,
      exp: exp,
    });

    var payload = JSON.parse(payloadJSON);
    const strHeader = JSON.stringify(header);
    const strPayload = JSON.stringify(payload);
    const header64 = encodeB64(strHeader);
    const payload64 = encodeB64(strPayload);
    const preHash = header64 + '.' + payload64;

    const signature64 = await createSignature(
      privateKey,
      preHash,
      individualId,
    );

    return header64 + '.' + payload64 + '.' + signature64;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function createSignature(
  privateKey: string,
  preHash: string,
  individualId: string,
) {
  let signature64;

  if (!isCustomSecureKeystore()) {
    const key = forge.pki.privateKeyFromPem(privateKey);
    const md = forge.md.sha256.create();
    md.update(preHash, 'utf8');

    const signature = key.sign(md);
    return encodeB64(signature);
  } else {
    try {
      signature64 = await SecureKeystore.sign(individualId, preHash);
    } catch (e) {
      console.error('Error in creating signature:', e);
      throw e;
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

export function isCustomSecureKeystore() {
  return !isIOS() ? SecureKeystore.deviceSupportsHardware() : false;
}

export interface WalletBindingResponse {
  walletBindingId: string;
  keyId: string;
  thumbprint: string;
  expireDateTime: string;
}

export async function clear() {
  try {
    console.log('clearing entire storage');
    if (isCustomSecureKeystore()) {
      SecureKeystore.clearKeys();
    }
    await Storage.clear();
  } catch (e) {
    console.error('error clear:', e);
    throw e;
  }
}

export async function encryptJson(
  encryptionKey: string,
  data: string,
): Promise<string> {
  // Disable Encryption in debug mode
  if (DEBUG_MODE_ENABLED && __DEV__) {
    return JSON.stringify(data);
  }

  if (!isCustomSecureKeystore()) {
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
  }
  return await SecureKeystore.encryptData(ENCRYPTION_ID, data);
}

export async function decryptJson(
  encryptionKey: string,
  encryptedData: string,
): Promise<string> {
  try {
    // Disable Encryption in debug mode
    if (DEBUG_MODE_ENABLED && __DEV__) {
      return JSON.parse(encryptedData);
    }

    if (!isCustomSecureKeystore()) {
      return CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(
        CryptoJS.enc.Utf8,
      );
    }
    return await SecureKeystore.decryptData(ENCRYPTION_ID, encryptedData);
  } catch (e) {
    console.error('error decryptJson:', e);
    throw e;
  }
}
