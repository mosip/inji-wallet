import {ENABLE_OPENID_FOR_VC} from 'react-native-dotenv';
import {createSignature, encodeB64} from '../cryptoutil/cryptoUtil';
import jwtDecode from 'jwt-decode';
import jose from 'node-jose';

export const OpenId4VCIProtocol = 'OpenId4VCI';
export const isVCFromOpenId4VCI = (vcKey: string) => {
  return vcKey?.indexOf('@') !== -1;
};

export const isOpenId4VCIEnabled = () => {
  //return ENABLE_OPENID_FOR_VC === 'true';
  return true;
};

export const getIdentifier = (context, credential) => {
  const credId = credential.credential.id.split('/');
  return (
    context.selectedIssuer.id +
    ':' +
    context.selectedIssuer.protocol +
    ':' +
    credId[credId.length - 1]
  );
};

export const getBody = async context => {
  const proofJWT = await getJWT(context);
  return {
    format: 'ldp_vc',
    credential_definition: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'MOSIPVerifiableCredential'],
    },
    proof: {
      proof_type: 'jwt',
      jwt: proofJWT,
    },
  };
};

export const getJWK = async publicKey => {
  try {
    const publicKeyJWKString = await jose.JWK.asKey(publicKey, 'pem');
    const publicKeyJWK = publicKeyJWKString.toJSON();
    return {
      ...publicKeyJWK,
      alg: 'RS256',
      use: 'sig',
    };
  } catch (e) {
    console.log(
      'Exception occured while constructing JWK from PEM : ' +
        publicKey +
        '  Exception is ',
      e,
    );
  }
};
export const getJWT = async context => {
  try {
    const header64 = encodeB64(
      JSON.stringify({
        alg: 'RS256',
        jwk: await getJWK(context.publicKey),
        typ: 'openid4vci-proof+jwt',
      }),
    );
    const decodedToken = jwtDecode(context.tokenResponse.accessToken);
    const payload64 = encodeB64(
      JSON.stringify({
        iss: context.selectedIssuer.clientId,
        nonce: decodedToken.c_nonce,
        aud: 'https://esignet.dev1.mosip.net/v1/esignet',
        iat: Math.floor(new Date().getTime() / 1000),
        exp: Math.floor(new Date().getTime() / 1000) + 18000,
      }),
    );
    const preHash = header64 + '.' + payload64;
    const signature64 = await createSignature(context.privateKey, preHash, '');
    return header64 + '.' + payload64 + '.' + signature64;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
