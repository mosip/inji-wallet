import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

const bindingCertificate = '-bindingCertificate';

export async function savePrivateKey(id: string, privateKey: string) {
  return await RNSecureKeyStore.set(id, privateKey, {
    accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
  });
}

export async function getPrivateKey(id: string) {
  return await RNSecureKeyStore.get(id);
}

export function getBindingCertificateConstant(id: string) {
  return id + bindingCertificate;
}
