import { KeyPair, RSA } from 'react-native-rsa-native';
import forge from 'node-forge';
import getAllConfigurations from '../commonprops/commonProps';
import SecureKeystore from '../../.yalc/react-native-secure-keystore';
import { isIOS } from '../constants';

export function generateKeys(): Promise<KeyPair> {
  return Promise.resolve(RSA.generateKeys(4096));
}

export async function getJwt(
  privateKey: string,
  individualId: string,
  thumbprint: string
) {
  try {
    var iat = Math.floor(new Date().getTime() / 1000);
    var exp = Math.floor(new Date().getTime() / 1000) + 18000;

    var config = await getAllConfigurations();

    const header = {
      'alg': 'RS256',
      //'kid': keyId,
      'x5t#S256': thumbprint,
    };
    var payloadJSON =
      '{"iss": "' +
      config.issuer +
      '", "aud": "' +
      config.audience +
      '", "sub": "' +
      individualId +
      '", "iat": ' +
      iat +
      ', "exp": ' +
      exp +
      '}';
    var payload = JSON.parse(payloadJSON);
    const strHeader = JSON.stringify(header);
    const strPayload = JSON.stringify(payload);
    const header64 = encodeB64(strHeader);
    const payload64 = encodeB64(strPayload);
    const preHash = header64 + '.' + payload64;

    const signature64 = await createSignature(
      privateKey,
      preHash,
      individualId
    );

    return header64 + '.' + payload64 + '.' + signature64;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function createSignature(
  privateKey: string,
  preHash: string,
  individualId: string
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
      console.error('Error in creating signature:' + JSON.stringify(e));
      throw e;
    }

    return replaceCharactersInB64(signature64);
  }
}

function replaceCharactersInB64(encodedB64) {
  return encodedB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeB64(str: string) {
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
