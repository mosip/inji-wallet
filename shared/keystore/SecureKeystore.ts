import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import Storage from '../storage';

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

export async function saveThumbprint(id: string, thumbprint) {
  const key: string = getBindingCertificateConstant(id);
  await Storage.setItem(key, thumbprint);
}

export async function getThumbprint(id: string) {
  const key: string = getBindingCertificateConstant(id);
  return await Storage.getItem(key);
}
