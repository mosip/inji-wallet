import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';

const bindingCertificate = '-bindingCertificate';

export async function savePrivateKey(id: string, privateKey: string) {
  var result = await RNSecureKeyStore.set(id, privateKey, {
    accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
  });
  return result;
}

export async function getPrivateKey(id: string) {
  var result = await RNSecureKeyStore.get(id);
  return result;
}

export function getBindingCertificateConstant(id: string) {
  return id + bindingCertificate;
}
