import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {CACHED_API} from '../../shared/api';
import NetInfo from '@react-native-community/netinfo';
import {
  constructAuthorizationConfiguration,
  constructProofJWT,
  getCredentialType,
  Issuers_Key_Ref,
  updateCredentialInformation,
  vcDownloadTimeout,
} from '../../shared/openId4VCI/Utils';
import {authorize} from 'react-native-app-auth';
import {
  generateKeys,
  isHardwareKeystoreExists,
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

const {RNSecureKeystoreModule} = NativeModules;
export const IssuersService = () => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },
    downloadIssuersList: async () => {
      return await CACHED_API.fetchIssuers();
    },
    checkInternet: async () => await NetInfo.fetch(),
    downloadIssuerConfig: async (context: any) => {
      let issuersConfig = await CACHED_API.fetchIssuerConfig(
        context.selectedIssuerId,
      );
      const wellknownResponse = await CACHED_API.fetchIssuerWellknownConfig(
        context.selectedIssuerId,
        issuersConfig['.well-known'],
      );
      issuersConfig.credential_endpoint =
        wellknownResponse?.credential_endpoint;
      issuersConfig.credential_audience = wellknownResponse?.credential_issuer;
      issuersConfig.credentialTypes = wellknownResponse?.credentials_supported;
      return issuersConfig;
    },
    downloadCredentialTypes: async (context: any) => {
      return context.selectedIssuer.credentialTypes;
    },
    downloadCredential: async (context: any) => {
      const downloadTimeout = await vcDownloadTimeout();
      const accessToken: string = context.tokenResponse?.accessToken;
      const issuerMeta: Object = {
        credentialAudience: context.selectedIssuer.credential_audience,
        credentialEndpoint: context.selectedIssuer.credential_endpoint,
        downloadTimeoutInMilliSeconds: downloadTimeout,
        credentialType: getCredentialType(
          context.selectedCredentialType?.credential_definition.type,
        ),
        credentialFormat: 'ldp_vc',
      };
      const proofJWT = await constructProofJWT(
        context.publicKey,
        context.privateKey,
        accessToken,
        context.selectedIssuer,
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
    generateKeyPair: async () => {
      if (!isHardwareKeystoreExists) {
        return await generateKeys();
      }
      const isBiometricsEnabled = RNSecureKeystoreModule.hasBiometricsEnabled();
      return RNSecureKeystoreModule.generateKeyPair(
        Issuers_Key_Ref,
        isBiometricsEnabled,
        0,
      );
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
