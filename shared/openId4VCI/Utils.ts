import jwtDecode from 'jwt-decode';
import jose from 'node-jose';
import {isIOS} from '../constants';
import {displayType, issuerType} from '../../machines/Issuers/IssuersMachine';
import getAllConfigurations, {CACHED_API} from '../api';
import base64url from 'base64url';
import i18next from 'i18next';
import {getJWT, replaceCharactersInB64} from '../cryptoutil/cryptoUtil';
import i18n from '../../i18n';
import {
  CredentialTypes,
  CredentialWrapper,
  VerifiableCredential,
} from '../../machines/VerifiableCredential/VCMetaMachine/vc';
import {
  BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS,
  DETAIL_VIEW_ADD_ON_FIELDS,
  getIdType,
} from '../../components/VC/common/VCUtils';
import {getVerifiableCredential} from '../../machines/VerifiableCredential/VCItemMachine/VCItemSelectors';
import {vcVerificationBannerDetails} from '../../components/BannerNotificationContainer';
import {getErrorEventData, sendErrorEvent} from '../telemetry/TelemetryUtils';
import {TelemetryConstants} from '../telemetry/TelemetryConstants';
import {NativeModules} from 'react-native';
import {KeyTypes} from '../cryptoutil/KeyTypes';
import {VCFormat} from '../VCFormat';
import {UnsupportedVcFormat} from '../error/UnsupportedVCFormat';
import {VCMetadata} from '../VCMetadata';

export const Protocols = {
  OpenId4VCI: 'OpenId4VCI',
  OTP: 'OTP',
};

export const Issuers = {
  MosipOtp: '',
  Mosip: 'Mosip',
};

export function getVcVerificationDetails(
  statusType,
  vcMetadata: VCMetadata,
  verifiableCredential,
  wellknown: Object,
): vcVerificationBannerDetails {
  const idType = getIdType(
    wellknown,
    getVerifiableCredential(verifiableCredential).credentialConfigurationId,
  );
  return {
    statusType: statusType,
    vcType: idType,
    vcNumber: vcMetadata.displayId,
  };
}

export const ACTIVATION_NEEDED = [Issuers.Mosip, Issuers.MosipOtp];

export const isActivationNeeded = (issuer: string) => {
  return ACTIVATION_NEEDED.indexOf(issuer) !== -1;
};

export const Issuers_Key_Ref = 'OpenId4VCI_KeyPair';

export const getIdentifier = (context, credential: VerifiableCredential) => {
  const credentialIdentifier = credential.credential.id;
  if (credentialIdentifier === undefined) {
    return (
      context.selectedIssuer.credential_issuer +
      ':' +
      context.selectedIssuer.protocol +
      ':' +
      CredentialIdForMsoMdoc(credential)
    );
  } else {
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
  }
};

export const updateCredentialInformation = (
  context,
  credential: VerifiableCredential,
): CredentialWrapper => {
  return {
    verifiableCredential: {
      ...credential,
      wellKnown: context.selectedIssuer['wellknown_endpoint'],
      credentialConfigurationId: context.selectedCredentialType.id,
      issuerLogo: getDisplayObjectForCurrentLanguage(
        context.selectedIssuer.display,
      )?.logo,
    },
    format: context.selectedCredentialType.format,
    identifier: getIdentifier(context, credential),
    generatedOn: new Date(),
    vcMetadata:
      {...context.vcMetadata, format: context.selectedCredentialType.format} ||
      {},
  };
};

export const getDisplayObjectForCurrentLanguage = (
  display: [displayType],
): displayType => {
  const currentLanguage = i18next.language;
  const languageKey = Object.keys(display[0]).includes('language')
    ? 'language'
    : 'locale';
  let displayType = display.filter(
    obj => obj[languageKey] == currentLanguage,
  )[0];
  if (!displayType) {
    displayType = display.filter(obj => obj[languageKey] === 'en')[0];
  }
  return displayType;
};

export const constructAuthorizationConfiguration = (
  selectedIssuer: issuerType,
  supportedScope: string,
) => {
  return {
    issuer: selectedIssuer.credential_issuer,
    clientId: selectedIssuer.client_id,
    scopes: [supportedScope],
    redirectUrl: selectedIssuer.redirect_uri,
    additionalParameters: {ui_locales: i18n.language},
    serviceConfiguration: {
      authorizationEndpoint:
        selectedIssuer.authorization_servers[0] + '/authorize',
      tokenEndpoint: selectedIssuer.token_endpoint,
    },
  };
};

export const getCredentialIssuersWellKnownConfig = async (
  issuer: string | undefined,
  defaultFields: string[],
  credentialConfigurationId: string,
  format: string,
) => {
  let fields: string[] = defaultFields;
  let matchingWellknownDetails: any;
  const wellknownResponse = await CACHED_API.fetchIssuerWellknownConfig(
    issuer!,
  );
  try {
    if (wellknownResponse) {
      matchingWellknownDetails = getMatchingCredentialIssuerMetadata(
        wellknownResponse,
        credentialConfigurationId,
      );
      if (
        matchingWellknownDetails.order != null &&
        matchingWellknownDetails.order.length > 0
      ) {
        fields = matchingWellknownDetails.order;
      } else {
        if (format === VCFormat.mso_mdoc) {
          fields = [];
          Object.keys(matchingWellknownDetails.claims).forEach(namespace => {
            Object.keys(matchingWellknownDetails.claims[namespace]).forEach(
              claim => {
                fields.concat(`${namespace}~${claim}`);
              },
            );
          });
        } else if (format === VCFormat.ldp_vc) {
          fields = Object.keys(
            matchingWellknownDetails.credential_definition.credentialSubject,
          );
        } else {
          console.error(`Unsupported credential format - ${format} found`);
          throw new UnsupportedVcFormat(format);
        }
      }
    }
  } catch (error) {
    console.error(
      `Error occurred while parsing well-known response of credential type - ${credentialConfigurationId} so returning default fields only. Error is `,
      error.toString(),
    );
    return {
      matchingCredentialIssuerMetadata: matchingWellknownDetails,
      fields: fields,
    };
  }
  return {
    matchingCredentialIssuerMetadata: matchingWellknownDetails,
    wellknownResponse,
    fields: fields,
  };
};

export const getDetailedViewFields = async (
  issuer: string,
  credentialConfigurationId: string,
  defaultFields: string[],
  format: string,
) => {
  let response = await getCredentialIssuersWellKnownConfig(
    issuer,
    defaultFields,
    credentialConfigurationId,
    format,
  );

  let updatedFieldsList = response.fields.concat(DETAIL_VIEW_ADD_ON_FIELDS);

  updatedFieldsList = removeBottomSectionFields(updatedFieldsList);

  return {
    matchingCredentialIssuerMetadata: response.matchingCredentialIssuerMetadata,
    fields: updatedFieldsList,
    wellknownResponse: response.wellknownResponse,
  };
};

export const removeBottomSectionFields = fields => {
  return fields.filter(
    fieldName =>
      !BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS.includes(fieldName) &&
      fieldName !== 'address',
  );
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
  REQUEST_TIMEDOUT = 'technicalDifficulty',
  BIOMETRIC_CANCELLED = 'biometricCancelled',
  TECHNICAL_DIFFICULTIES = 'technicalDifficulty',
  CREDENTIAL_TYPE_DOWNLOAD_FAILURE = 'credentialTypeListDownloadFailure',
}

export function CredentialIdForMsoMdoc(credential: VerifiableCredential) {
  return credential.credential['issuerSigned']['nameSpaces'][
    'org.iso.18013.5.1'
  ].find(element => element.elementIdentifier === 'document_number')
    .elementValue;
}

export async function constructProofJWT(
  publicKey: string,
  privateKey: string,
  accessToken: string,
  selectedIssuer: issuerType,
  keyType: string,
): Promise<string> {
  const jwtHeader = {
    alg: keyType != KeyTypes.ED25519 ? keyType : 'Ed25519',
    jwk: await getJWK(publicKey, keyType),
    typ: 'openid4vci-proof+jwt',
  };
  const decodedToken = jwtDecode(accessToken);
  const jwtPayload = {
    iss: selectedIssuer.client_id,
    nonce: decodedToken.c_nonce,
    aud: selectedIssuer.credential_audience,
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000) + 18000,
  };

  return await getJWT(
    jwtHeader,
    jwtPayload,
    Issuers_Key_Ref,
    privateKey,
    keyType,
  );
}

export const getJWK = async (publicKey, keyType) => {
  try {
    let publicKeyJWK;
    switch (keyType) {
      case KeyTypes.RS256:
        publicKeyJWK = await getJWKRSA(publicKey);
        break;
      case KeyTypes.ES256:
        publicKeyJWK = await getJWKECR1(publicKey);
        break;
      case KeyTypes.ES256K:
        publicKeyJWK = await getJWKECK1(publicKey);
        break;
      case KeyTypes.ED25519:
        publicKeyJWK = await getJWKED(publicKey);
        break;
      default:
        throw Error;
    }
    return {
      ...publicKeyJWK,
      alg: 'Ed25519',
      use: 'sig',
    };
  } catch (e) {
    console.error(
      'Exception occurred while constructing JWK from PEM : ' +
        publicKey +
        '  Exception is ',
      e,
    );
  }
};
async function getJWKRSA(publicKey): Promise<any> {
  const publicKeyJWKString = await jose.JWK.asKey(publicKey, 'pem');
  return publicKeyJWKString.toJSON();
}
async function getJWKECR1(publicKey): Promise<any> {
  if (isIOS()) return JSON.parse(publicKey);
  const publicKeyJWKString = await jose.JWK.asKey(publicKey, 'pem');
  return publicKeyJWKString.toJSON();
}
function getJWKECK1(publicKey): any {
  const x = base64url(Buffer.from(publicKey.slice(1, 33))); // Skip the first byte (0x04) in the uncompressed public key
  const y = base64url(Buffer.from(publicKey.slice(33)));
  const jwk = {
    kty: 'EC',
    crv: 'secp256k1',
    x: x,
    y: y,
  };
  return jwk;
}
function getJWKED(publicKey): any {
  const x = replaceCharactersInB64(publicKey);
  const jwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    x: x,
  };
  return jwk;
}
export async function hasKeyPair(keyType: any): Promise<boolean> {
  const {RNSecureKeystoreModule} = NativeModules;
  try {
    return await RNSecureKeystoreModule.hasAlias(keyType);
  } catch (e) {
    console.error('key not found');
    return false;
  }
}

export function selectCredentialRequestKey(
  keyTypes: string[],
  keyOrder: object,
) {
  for (const index in keyOrder) {
    if (keyTypes.includes(keyOrder[index])) return keyOrder[index];
  }
  return '';
}

export const constructIssuerMetaData = (
  selectedIssuer: issuerType,
  selectedCredentialType: CredentialTypes,
  downloadTimeout: Number,
): Object => {
  const issuerMeta: Object = {
    credentialAudience: selectedIssuer.credential_audience,
    credentialEndpoint: selectedIssuer.credential_endpoint,
    downloadTimeoutInMilliSeconds: downloadTimeout,
    credentialFormat: selectedCredentialType.format,
  };
  if (selectedCredentialType.format === VCFormat.ldp_vc) {
    issuerMeta['credentialType'] = selectedCredentialType?.credential_definition
      ?.type ?? ['VerifiableCredential'];
  } else if (selectedCredentialType.format === VCFormat.mso_mdoc) {
    issuerMeta['doctype'] = selectedCredentialType.doctype;
    issuerMeta['claims'] = selectedCredentialType.claims;
  }
  return issuerMeta;
};

export function getMatchingCredentialIssuerMetadata(
  wellknown: any,
  credentialConfigurationId: string,
): any {
  for (const credentialTypeKey in wellknown.credential_configurations_supported) {
    if (credentialTypeKey === credentialConfigurationId) {
      return wellknown.credential_configurations_supported[credentialTypeKey];
    }
  }
  console.error(
    'Selected credential type is not available in wellknown config supported credentials list',
  );
  sendErrorEvent(
    getErrorEventData(
      TelemetryConstants.FlowType.wellknownConfig,
      TelemetryConstants.ErrorId.mismatch,
      TelemetryConstants.ErrorMessage.wellknownConfigMismatch,
    ),
  );
  throw new Error(
    `Selected credential type - ${credentialConfigurationId} is not available in wellknown config supported credentials list`,
  );
}


