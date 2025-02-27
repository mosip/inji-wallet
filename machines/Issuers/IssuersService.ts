import NetInfo from '@react-native-community/netinfo';
import {NativeModules} from 'react-native';
import {authorize} from 'react-native-app-auth';
import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {API, CACHED_API} from '../../shared/api';
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
    getAuthFlowType: async (context: any) => {
      if (context.selectedIssuer?.grants) {
        console.log('grants ::', context.selectedIssuer.grants);
        return context.selectedIssuer.grants;
      } else {
        return [];
      }
    },
    downloadIssuerWellknown: async (context: any) => {
      console.log('selectedIssuer ::', context.selectedIssuer);
      const wellknownResponse = await CACHED_API.fetchIssuerWellknownConfig(
        context.selectedIssuer.id,
        context.selectedIssuer.credential_issuer_host
          ? context.selectedIssuer.credential_issuer_host
          : context.selectedIssuer.credential_issuer,
      );
      return wellknownResponse;
    },
    downloadCredentialTypes: async (context: any) => {
      const credentialTypes = [];
      const selectedIssuer = context.selectedIssuer;

      const keys =
        selectedIssuer.credential_configuration_ids ??
        Object.keys(selectedIssuer.credential_configurations_supported);

      for (const key of keys) {
        if (selectedIssuer.credential_configurations_supported[key]) {
          credentialTypes.push({
            id: key,
            ...selectedIssuer.credential_configurations_supported[key],
          });
        }
      }

      if (credentialTypes.length === 0) {
        throw new Error(
          `No credential type found for issuer ${selectedIssuer.issuer_id}`,
        );
      }

      return credentialTypes;
    },
    fetchAuthorizationEndpoint: async (context: any) => {
      /**
       * Incase of multiple entries of authorization_servers, each element is iterated and metadata check is made for support with wallet.
       * For now, its been kept as getting first entry and checking for matching grant_types_supported
       */
      const wellknownResponse = context.selectedIssuerWellknownResponse;
      const authorizationServers =
        wellknownResponse['authorization_servers'] || [];
      console.log('authorizationServers ::', authorizationServers);
      const credentialIssuer = wellknownResponse['credential_issuer'];
      const SUPPORTED_GRANT_TYPES = ['authorization_code'];

      // List of servers to check (authorization servers first, then credential issuer)
      const serversToCheck = [...authorizationServers, credentialIssuer].filter(
        Boolean,
      );

      for (const server of serversToCheck) {
        try {
          console.log('server ::', server);
          const authorizationServersMetadata =
            await CACHED_API.fetchIssuerAuthorizationServerMetadata(server);

          if (
            (
              authorizationServersMetadata['grant_types_supported'] || [
                'authorization_code',
                'implicit',
              ]
            ).some(grant => SUPPORTED_GRANT_TYPES.includes(grant))
          ) {
            console.log(
              'authorizationServersMetadata ::',
              authorizationServersMetadata['authorization_endpoint'],
            );
            return authorizationServersMetadata['authorization_endpoint'];
          }
        } catch (error) {
          console.log('error ::', error);
        }
      }
      throw new Error(
        OIDCErrors.AUTHORIZATION_ENDPOINT_DISCOVERY.GRANT_TYPE_NOT_SUPPORTED,
      );
    },

    fetchAccessTokenWithPreAuthCode: async (context: any) => {
      const preAuthCode =
        context.selectedIssuer.grants[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ]['pre-authorized_code'];
      console.log(
        'tokenEndpoint new ::',
        context.selectedIssuer.token_endpoint,
      );
      const grant_type = 'urn:ietf:params:oauth:grant-type:pre-authorized_code';
      const tokenResponse = await API.fetchAccessTokenWithPreAuthCode(
        grant_type,
        preAuthCode,
        context.selectedIssuer.token_endpoint,
      );
      console.log('tokenResponse ::', tokenResponse);
      return tokenResponse;
    },

    downloadCredential: async (context: any) => {
      const downloadTimeout = await vcDownloadTimeout();
      const accessToken: string =
        context.tokenResponse?.access_token ||
        context.tokenResponse?.accessToken;
      console.log('accessToken ::', accessToken);
      const proofJWT = await constructProofJWT(
        context.publicKey,
        context.privateKey,
        accessToken,
        context.selectedIssuer,
        context.keyType,
      );
      let credential = await API.fetchCredentialRequest(
        accessToken,
        context.selectedCredentialType.id,
        proofJWT,
        context.selectedIssuer.credential_endpoint,
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
      if (
        !context.selectedIssuer.grants?.[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ]
      ) {
        console.log('selectedIssuer ::', context.selectedIssuer.token_endpoint);
        return await authorize(
          constructAuthorizationConfiguration(
            context.selectedIssuer,
            context.selectedCredentialType.scope,
          ),
        );
      } else return [];
    },

    getKeyOrderList: async () => {
      const {RNSecureKeystoreModule} = NativeModules;
      const keyOrder = JSON.parse(
        (await RNSecureKeystoreModule.getData('keyPreference'))[1],
      );
      console.log('keyOrder ::', keyOrder);
      return keyOrder;
    },

    generateKeyPair: async (context: any) => {
      const keypair = await generateKeyPair(context.keyType);
      return keypair;
    },

    getKeyPair: async (context: any) => {
      console.log('keyType ::', context.keyType);
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
