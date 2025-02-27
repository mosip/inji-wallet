import NetInfo from '@react-native-community/netinfo';
import {NativeModules} from 'react-native';
import {authorize} from 'react-native-app-auth';
import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {CACHED_API} from '../../shared/api';
import {
  fetchKeyPair,
  generateKeyPair,
} from '../../shared/cryptoutil/cryptoUtil';
import {
  constructAuthorizationConfiguration,
  constructIssuerMetaData,
  constructProofJWT,
  hasKeyPair,
  OIDCErrors,
  updateCredentialInformation,
  vcDownloadTimeout,
  verifyCredentialData,
} from '../../shared/openId4VCI/Utils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {
  getImpressionEventData,
  sendImpressionEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {VciClient} from '../../shared/vciClient/VciClient';

export const IssuersService = () => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },
    downloadIssuersList: async () => {
      return await CACHED_API.fetchIssuers();
    },
    downloadCredentialOfferData: async (context: any) => {
      return await CACHED_API.fetchCredentialOfferData(
        context.credentialOfferURI,
      );
    },
    checkInternet: async () => await NetInfo.fetch(),
    downloadIssuerWellknown: async (context: any) => {
      const wellknownResponse = await CACHED_API.fetchIssuerWellknownConfig(
        context.credentialOfferData
          ? context.credentialOfferData.credential_issuer
          : context.selectedIssuer.issuer_id,
        context.credentialOfferData
          ? context.selectedIssuer.credential_issuer
          : context.selectedIssuer.credential_issuer_host,
      );
      return wellknownResponse;
    },
    downloadCredentialTypes: async (context: any) => {
      const credentialTypes = [];
      for (const key in context.selectedIssuer
        .credential_configurations_supported) {
        credentialTypes.push({
          id: key,
          ...context.selectedIssuer.credential_configurations_supported[key],
        });
      }
      if (credentialTypes.length == 0)
        throw new Error(
          `No credential type found for issuer ${context.selectedIssuer.issuer_id}`,
        );

      return credentialTypes;
    },
    fetchAuthorizationEndpoint: async (context: any) => {
      /**
       * Incase of multiple entries of authorization_servers, each element is iterated and metadata check is made for support with wallet.
       * For now, its been kept as getting first entry and checking for matching grant_types_supported
       */
      const authorizationServer =
        context.selectedIssuerWellknownResponse['authorization_servers'][0];
      const authorizationServerMetadata =
        await CACHED_API.fetchIssuerAuthorizationServerMetadata(
          authorizationServer,
        );
      const SUPPORTED_GRANT_TYPES = ['authorization_code'];
      if (
        (
          authorizationServerMetadata['grant_types_supported'] as Array<string>
        ).filter(grantType => SUPPORTED_GRANT_TYPES.includes(grantType))
          .length === 0
      ) {
        throw new Error(
          OIDCErrors.AUTHORIZATION_ENDPOINT_DISCOVERY.GRANT_TYPE_NOT_SUPPORTED,
        );
      }

      return authorizationServerMetadata['authorization_endpoint'];
    },
    downloadCredential: async (context: any) => {
      const downloadTimeout = await vcDownloadTimeout();
      const accessToken: string = context.tokenResponse?.accessToken;
      const proofJWT = await constructProofJWT(
        context.publicKey,
        context.privateKey,
        accessToken,
        context.selectedIssuer,
        context.keyType,
      );
      let credential = await VciClient.downloadCredential(
        constructIssuerMetaData(
          context.selectedIssuer,
          context.selectedCredentialType,
          downloadTimeout,
        ),
        proofJWT,
        accessToken,
      );

      console.info(`VC download via ${context.selectedIssuerId} is successful`);
      return await updateCredentialInformation(context, credential);
    },
    invokeAuthorization: async (context: any) => {
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.vcDownload,
          context.selectedIssuer.issuer_id +
            TelemetryConstants.Screens.webViewPage,
        ),
      );
      return await authorize(
        constructAuthorizationConfiguration(
          context.selectedIssuer,
          context.selectedCredentialType.scope,
        ),
      );
    },

    getKeyOrderList: async () => {
      const {RNSecureKeystoreModule} = NativeModules;
      const keyOrder = JSON.parse(
        (await RNSecureKeystoreModule.getData('keyPreference'))[1],
      );
      return keyOrder;
    },

    generateKeyPair: async (context: any) => {
      const keypair = await generateKeyPair(context.keyType);
      return keypair;
    },

    getKeyPair: async (context: any) => {
      if (context.keyType === '') {
        throw new Error('key type not found');
      } else if (!!(await hasKeyPair(context.keyType))) {
        return await fetchKeyPair(context.keyType);
      }
    },

    getSelectedKey: async (context: any) => {
      return context.keyType;
    },

    verifyCredential: async (context: any) => {
      const verificationResult = await verifyCredentialData(
        context.verifiableCredential?.credential,
        context.selectedCredentialType.format,
        context.selectedIssuerId,
      );
      if (!verificationResult.isVerified) {
        throw new Error(verificationResult.verificationErrorCode);
      }
      return verificationResult;
    },
  };
};
