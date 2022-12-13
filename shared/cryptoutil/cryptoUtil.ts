import { KeyPair, RSA } from 'react-native-rsa-native';
import forge from 'node-forge';

export function generateKeys(): Promise<KeyPair> {
  return Promise.resolve(RSA.generateKeys(4096));
}

export async function getJwt(privateKey: string, payload: JSON) {
  const key = forge.pki.privateKeyFromPem(privateKey);
  const md = forge.md.sha256.create();
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const strHeader = JSON.stringify(header);
  const strPayload = JSON.stringify(payload);
  const header64 = encodeB64(strHeader);
  const payload64 = encodeB64(strPayload);
  const preHash = header64 + '.' + payload64;
  md.update(preHash, 'utf8');
  const signature = key.sign(md);
  const signature64 = encodeB64(signature);
  var token: string = header64 + '.' + payload64 + '.' + signature64;
  return token;
}

function encodeB64(str: string) {
  const encodedB64 = forge.util.encode64(str);
  return encodedB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
