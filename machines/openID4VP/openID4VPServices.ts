import {CACHED_API} from '../../shared/api';
import {fetchKeyPair} from '../../shared/cryptoutil/cryptoUtil';
import {getJWK, hasKeyPair} from '../../shared/openId4VCI/Utils';
import base64url from 'base64url';
import {
  constructProofJWT,
  isClientValidationRequired,
  OpenID4VP,
  OpenID4VP_Domain,
  OpenID4VP_Proof_Sign_Algo_Suite,
} from '../../shared/openID4VP/OpenID4VP';
import {KeyTypes} from '../../shared/cryptoutil/KeyTypes';

export const openID4VPServices = () => {
  return {
    fetchTrustedVerifiers: async () => {
      return await CACHED_API.fetchTrustedVerifiersList();
    },

    shouldValidateClient: async () => {
      return await isClientValidationRequired();
    },

    getAuthenticationResponse: (context: any) => async () => {
      OpenID4VP.initialize();
      const serviceRes = await OpenID4VP.authenticateVerifier(
        context.encodedAuthorizationRequest,
        context.trustedVerifiers,
      );
      return serviceRes;
    },

    getKeyPair: async (context: any) => {
      if (!!(await hasKeyPair(context.keyType))) {
        return await fetchKeyPair(context.keyType);
      }
    },

    getSelectedKey: async (context: any) => {
      return await fetchKeyPair(context.keyType);
    },

    sendVP: (context: any) => async () => {
      const vpToken = await OpenID4VP.constructVerifiablePresentationToken(
        context.selectedVCs,
      );

      const proofJWT = await constructProofJWT(
        context.publicKey,
        context.privateKey,
        JSON.parse(vpToken),
        context.keyType,
      );

      const vpResponseMetadata = {
        jws: proofJWT,
        signatureAlgorithm: OpenID4VP_Proof_Sign_Algo_Suite,
        publicKey:
          'did:jwk:' +
          base64url(
            JSON.stringify(await getJWK(context.publicKey, KeyTypes.ED25519)),
          ),
        domain: OpenID4VP_Domain,
      };
      return await OpenID4VP.shareVerifiablePresentation(vpResponseMetadata);
    },
  };
};
