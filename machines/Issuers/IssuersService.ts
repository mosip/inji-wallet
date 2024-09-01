import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {CACHED_API} from '../../shared/api';
import NetInfo from '@react-native-community/netinfo';
import {
  constructAuthorizationConfiguration,
  constructProofJWT,
  getKeyTypeFromWellknown,
  hasKeyPair,
  updateCredentialInformation,
  vcDownloadTimeout,
  selectCredentialRequestKey
} from '../../shared/openId4VCI/Utils';
import {authorize} from 'react-native-app-auth';
import {
  fetchKeyPair,
  generateKeyPair,
} from '../../shared/cryptoutil/cryptoUtil';
import {NativeModules} from 'react-native';
import {
  VerificationErrorType,
  verifyCredential,
} from '../../shared/vcjs/verifyCredential';
import {
  getImpressionEventData,
  sendImpressionEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {isMosipVC} from '../../shared/Utils';
import {VciClient} from '../../shared/vciClient/VciClient';

export const IssuersService = () => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },
    downloadIssuersList: async () => {
      return await CACHED_API.fetchIssuers();
    },
    checkInternet: async () => await NetInfo.fetch(),
    downloadIssuerWellknown: async (context: any) => {
      const wellknownResponse = await CACHED_API.fetchIssuerWellknownConfig(
        context.selectedIssuerId,
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
          `No credential type found for issuer ${context.selectedIssuer.credential_issuer}`,
        );

      return credentialTypes;
    },
    downloadCredential: async (context: any) => {
      const downloadTimeout = await vcDownloadTimeout();
      const accessToken: string = context.tokenResponse?.accessToken;
      const issuerMeta: Object = {
        credentialAudience: context.selectedIssuer.credential_audience,
        credentialEndpoint: context.selectedIssuer.credential_endpoint,
        downloadTimeoutInMilliSeconds: downloadTimeout,
        credentialType: context.selectedCredentialType?.credential_definition
          ?.type ?? ['VerifiableCredential'],
        credentialFormat: context.selectedCredentialType.format,
      };
      const proofJWT = await constructProofJWT(
        context.publicKey,
        context.privateKey,
        accessToken,
        context.selectedIssuer,
        context.keyType
      );
      let credential = await VciClient.downloadCredential(
        issuerMeta,
        proofJWT,
        accessToken,
      );

      console.info(`VC download via ${context.selectedIssuerId} is successful`);
      return updateCredentialInformation(context, credential);
    },
    invokeAuthorization: async (context: any) => {
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.vcDownload,
          context.selectedIssuer.credential_issuer +
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
     
    generateKeyPair: async (context:any) => {
      const keypair=await generateKeyPair(context.keyType);
      console.log(keypair)
     return keypair
    },

    getKeyPair: async (context:any) => {
      console.log("keyset",context.keyType)
      if (await hasKeyPair(context.keyType)) {
        return await fetchKeyPair(context.keyType);
      }
      console.log("exiting getkeypair")
    },

    getSelectedKey: async (context:any) => {
      console.log("hola",context.keyType)
      return context.keyType;
    },

    verifyCredential: async (context: any) => {
      //this issuer specific check has to be removed once vc validation is done.
      if (isMosipVC(context.vcMetadata.issuer)) {
        const verificationResult = await verifyCredential(
          context.verifiableCredential?.credential,
        );
        if (!verificationResult.isVerified) {
          throw new Error(verificationResult.errorMessage);
        }
      } else {
        return {
          isVerified: true,
          errorMessage: VerificationErrorType.NO_ERROR,
        };
      }
    },
  };
};

