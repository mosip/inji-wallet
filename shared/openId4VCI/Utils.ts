import {createSignature, encodeB64} from '../cryptoutil/cryptoUtil';
import jwtDecode from 'jwt-decode';
import jose from 'node-jose';
import {isIOS} from '../constants';
import pem2jwk from 'simple-pem2jwk';
import {
  displayType,
  Issuers_Key_Ref,
  issuerType,
} from '../../machines/issuersMachine';
import getAllConfigurations from '../commonprops/commonProps';
import {CredentialWrapper} from '../../types/VC/EsignetMosipVC/vc';
import {VCMetadata} from '../VCMetadata';
import i18next from 'i18next';

export const OpenId4VCIProtocol = 'OpenId4VCIProtocol';

export const getIdentifier = (context, credential) => {
  const credId = credential.credential.id.split('/');
  return (
    context.selectedIssuer.credential_issuer +
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

export const updateCredentialInformation = (context, credential) => {
  let credentialWrapper: CredentialWrapper = {};
  credentialWrapper.verifiableCredential = credential;
  credentialWrapper.identifier = getIdentifier(context, credential);
  credentialWrapper.generatedOn = new Date();
  credentialWrapper.verifiableCredential.issuerLogo =
    getDisplayObjectForCurrentLanguage(context.selectedIssuer.display)?.logo;
  return credentialWrapper;
};

export const getDisplayObjectForCurrentLanguage = (
  display: [displayType],
): displayType => {
  const currentLanguage = i18next.language;
  let displayType = display.filter(obj => obj.language == currentLanguage)[0];
  if (!displayType) {
    displayType = display.filter(obj => obj.language == 'en')[0];
  }
  return displayType;
};

export const getVCMetadata = context => {
  const [issuer, protocol, requestId] =
    context.credentialWrapper?.identifier.split(':');
  return VCMetadata.fromVC({
    requestId: requestId ? requestId : null,
    issuer: issuer,
    protocol: protocol,
    id: context.verifiableCredential?.credential.credentialSubject.UIN
      ? context.verifiableCredential?.credential.credentialSubject.UIN
      : context.verifiableCredential?.credential.credentialSubject.VID,
  });
};

export const constructAuthorizationConfiguration = (
  selectedIssuer: issuerType,
) => {
  return {
    clientId: selectedIssuer.client_id,
    scopes: selectedIssuer.scopes_supported,
    additionalHeaders: selectedIssuer.additional_headers,
    wellKnownEndpoint: selectedIssuer['.well-known'],
    redirectUrl: selectedIssuer.redirect_uri,
    serviceConfiguration: {
      authorizationEndpoint: selectedIssuer.authorization_endpoint,
      tokenEndpoint: selectedIssuer.token_endpoint,
    },
  };
};

export const getJWK = async publicKey => {
  try {
    let publicKeyJWKString;
    let publicKeyJWK;
    if (isIOS()) {
      publicKeyJWKString = await jose.JWK.asKey(publicKey, 'pem');
      publicKeyJWK = publicKeyJWKString.toJSON();
    } else {
      publicKeyJWK = await pem2jwk(publicKey);
    }
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
        iss: context.selectedIssuer.client_id,
        nonce: decodedToken.c_nonce,
        aud: context.selectedIssuer.credential_audience,
        iat: Math.floor(new Date().getTime() / 1000),
        exp: Math.floor(new Date().getTime() / 1000) + 18000,
      }),
    );
    const preHash = header64 + '.' + payload64;
    const signature64 = await createSignature(
      context.privateKey,
      preHash,
      Issuers_Key_Ref,
    );
    return header64 + '.' + payload64 + '.' + signature64;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const vcDownloadTimeout = async (): Promise<number> => {
  const response = await getAllConfigurations();

  return Number(response['openId4VCIDownloadVCTimeout']) || 30000;
};

// OIDCErrors is a collection of external errors from the OpenID library or the issuer
export enum OIDCErrors {
  OIDC_FLOW_CANCELLED_ANDROID = 'User cancelled flow',
  OIDC_FLOW_CANCELLED_IOS = 'org.openid.appauth.general error -3',

  INVALID_TOKEN_SPECIFIED = 'Invalid token specified',
  OIDC_CONFIG_ERROR_PREFIX = 'Config error',
}
// ErrorMessage is the type of error message shown in the UI
export enum ErrorMessage {
  NO_INTERNET = 'noInternetConnection',
  GENERIC = 'generic',
  REQUEST_TIMEDOUT = 'requestTimedOut',
}
