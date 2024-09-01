import {request} from '../../shared/request';
import getAllConfigurations, {API_URLS} from '../../shared/api';
import {ESIGNET_BASE_URL} from '../../shared/constants';
import {
  isHardwareKeystoreExists,
  getJWT,
  fetchKeyPair,
} from '../../shared/cryptoutil/cryptoUtil';
import {getPrivateKey} from '../../shared/keystore/SecureKeystore';

export const QrLoginServices = {
  linkTransaction: async context => {
    const response = await request(
      API_URLS.linkTransaction.method,
      API_URLS.linkTransaction.buildURL(),
      {
        requestTime: String(new Date().toISOString()),
        request: {
          linkCode: context.linkCode,
        },
      },
      ESIGNET_BASE_URL,
    );
    return response.response;
  },

  sendAuthenticate: async context => {
    let privateKey;
    const individualId = context.selectedVc.vcMetadata.displayId;
    const alias = context.selectedVc.vcMetadata.downloadKeyType;
    if (!isHardwareKeystoreExists) {
      privateKey = await getPrivateKey(
        context.selectedVc.walletBindingResponse?.walletBindingId,
      );
    }
    console.log(alias)
    const keyPair=await fetchKeyPair(alias)
    privateKey=keyPair[1]
    var config = await getAllConfigurations();
    const jwtHeader = {
      alg: alias,
      'x5t#S256': context.thumbprint,
    };

    const jwtPayload = {
      iss: config.issuer,
      sub: individualId,
      aud: config.audience,
      iat: Math.floor(new Date().getTime() / 1000),
      exp: Math.floor(new Date().getTime() / 1000) + 18000,
    };

    const jwt = await getJWT(jwtHeader, jwtPayload, alias, privateKey,alias);

    const response = await request(
      API_URLS.authenticate.method,
      API_URLS.authenticate.buildURL(),
      {
        requestTime: String(new Date().toISOString()),
        request: {
          linkedTransactionId: context.linkTransactionId,
          individualId: individualId,
          challengeList: [
            {
              authFactorType: 'WLA',
              challenge: jwt,
              format: 'jwt',
            },
          ],
        },
      },
      ESIGNET_BASE_URL,
    );
    return response.response;
  },

  sendConsent: async context => {
    let privateKey;
    const alias = context.selectedVc.vcMetadata.downloadKeyType;
    if (!isHardwareKeystoreExists) {
      privateKey = await getPrivateKey(
        context.selectedVc.walletBindingResponse?.walletBindingId,
      );
    }
    const keyPair=await fetchKeyPair(alias)
    privateKey=keyPair[1]

    const header = {
      alg: alias,
      'x5t#S256': context.thumbprint,
    };
    const payload = {
      accepted_claims: context.essentialClaims
        .concat(context.selectedVoluntaryClaims)
        .sort(),
      permitted_authorized_scopes: context.authorizeScopes,
    };

    const JWT = await getJWT(header, payload, alias, privateKey,alias);
    const jwtComponents = JWT.split('.');
    const detachedSignature = jwtComponents[0] + '.' + jwtComponents[2];

    const resp = await request(
      API_URLS.sendConsent.method,
      API_URLS.sendConsent.buildURL(),
      {
        requestTime: String(new Date().toISOString()),
        request: {
          linkedTransactionId: context.linkedTransactionId,
          acceptedClaims: context.essentialClaims
            .concat(context.selectedVoluntaryClaims)
            .sort(),
          permittedAuthorizeScopes: context.authorizeScopes,
          signature: detachedSignature,
        },
      },
      ESIGNET_BASE_URL,
    );
  },
};
