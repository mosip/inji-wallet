import { KeyPair, RSA } from 'react-native-rsa-native';

export function generateKeys(): Promise<KeyPair> {
  return Promise.resolve(RSA.generateKeys(4096));
}
