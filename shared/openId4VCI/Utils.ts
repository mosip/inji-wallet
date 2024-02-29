import jwtDecode from 'jwt-decode';
import jose from 'node-jose';
import {isIOS} from '../constants';
import pem2jwk from 'simple-pem2jwk';
import {displayType, issuerType} from '../../machines/issuersMachine';
import getAllConfigurations from '../commonprops/commonProps';

import {VCMetadata} from '../VCMetadata';
import i18next from 'i18next';
import {getJWT} from '../cryptoutil/cryptoUtil';
import {CACHED_API} from '../api';
import i18n from '../../i18n';
import {VerifiableCredential} from '../../types/VC/ExistingMosipVC/vc';
import {CredentialWrapper} from '../../types/VC/EsignetMosipVC/vc';

export const Protocols = {
  OpenId4VCI: 'OpenId4VCI',
  OTP: 'OTP',
};

export const Issuers = {
  Mosip: '',
  Sunbird: 'Sunbird',
  ESignet: 'ESignet',
};

export const ID_TYPE = {
  MOSIPVerifiableCredential: i18n.t('VcDetails:nationalCard'),
  InsuranceCredential: i18n.t('VcDetails:insuranceCard'),
  OpenG2PBeneficiaryVerifiableCredential: i18n.t('VcDetails:beneficiaryCard'),
  OpenG2PRegistryVerifiableCredential: i18n.t('VcDetails:socialRegistryCard'),
};

export const getIDType = (verifiableCredential: VerifiableCredential) => {
  return ID_TYPE[verifiableCredential.type[1]];
};

export const ACTIVATION_NEEDED = [Issuers.ESignet, Issuers.Mosip];

export const isActivationNeeded = (issuer: string) => {
  return ACTIVATION_NEEDED.indexOf(issuer) !== -1;
};

export const Issuers_Key_Ref = 'OpenId4VCI_KeyPair';

export const getIdentifier = (context, credential) => {
  const credentialIdentifier = credential.credential.id;
  const credId = credentialIdentifier.startsWith('did')
    ? credentialIdentifier.split(':')
    : credentialIdentifier.split('/');
  return (
    context.selectedIssuer.credential_issuer +
    ':' +
    context.selectedIssuer.protocol +
    ':' +
    credId[credId.length - 1]
  );
};

export const getBody = async context => {
  const header = {
    alg: 'RS256',
    jwk: await getJWK(context.publicKey),
    typ: 'openid4vci-proof+jwt',
  };
  const decodedToken = jwtDecode(context.tokenResponse.accessToken);
  const payload = {
    iss: context.selectedIssuer.client_id,
    nonce: decodedToken.c_nonce,
    aud: context.selectedIssuer.credential_audience,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 18000,
  };

  const proofJWT = await getJWT(
    header,
    payload,
    Issuers_Key_Ref,
    context.privateKey,
  );
  return {
    format: 'ldp_vc',
    credential_definition: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: context.selectedIssuer?.credential_type
        ? context.selectedIssuer.credential_type
        : ['VerifiableCredential', 'MOSIPVerifiableCredential'],
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
  credentialWrapper.verifiableCredential.wellKnown =
    context.selectedIssuer['.well-known'];
  // credentialWrapper.verifiableCredential.wellKnown =
  //   'https://esignet.collab.mosip.net/.well-known/openid-credential-issuer';
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
    timestamp: context.timestamp ?? '',
  });
};

export const constructAuthorizationConfiguration = (
  selectedIssuer: issuerType,
) => {
  return {
    clientId: selectedIssuer.client_id,
    scopes: selectedIssuer.scopes_supported,
    additionalHeaders: selectedIssuer.additional_headers,
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

export const getCredentialIssuersWellKnownConfig = async (
  issuer: string,
  wellknown: string,
  defaultFields: string[],
) => {
  let fields: string[] = defaultFields;
  let response = null;
  if (wellknown) {
    response = await CACHED_API.fetchIssuerWellknownConfig(issuer, wellknown);
    if (!response) {
      fields = [];
    } else if (response?.credentials_supported[0].order) {
      fields = response?.credentials_supported[0].order;
    } else {
      fields = Object.keys(
        response?.credentials_supported[0].credential_definition
          .credentialSubject,
      );
      console.log('fields => ', fields);
    }
  }
  return {
    wellknown: response,
    fields: fields,
  };
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
  BIOMETRIC_CANCELLED = 'biometricCancelled',
}
