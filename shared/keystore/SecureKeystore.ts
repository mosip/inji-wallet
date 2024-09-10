

const bindingCertificate = '-bindingCertificate';

export async function getPrivateKey(id: string) {
  var result = await RNSecureKeyStore.get(id);
  return result;
}

export function getBindingCertificateConstant(id: string) {
  return id + bindingCertificate;
}
