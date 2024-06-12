import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {API_URLS, CACHED_API} from '../../shared/api';
import NetInfo from '@react-native-community/netinfo';
import {request} from '../../shared/request';
import {
  constructAuthorizationConfiguration,
  getBody,
  Issuers,
  Issuers_Key_Ref,
  updateCredentialInformation,
  vcDownloadTimeout,
} from '../../shared/openId4VCI/Utils';
import {authorize} from 'react-native-app-auth';
import {
  generateKeys,
  isHardwareKeystoreExists,
} from '../../shared/cryptoutil/cryptoUtil';
import SecureKeystore from '@mosip/secure-keystore';
import {getVCMetadata, VCMetadata} from '../../shared/VCMetadata';
import {verifyCredential} from '../../shared/vcjs/verifyCredential';
import {
  getImpressionEventData,
  sendImpressionEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';

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
      if (context.selectedIssuer['.well-known']) {
        await CACHED_API.fetchIssuerWellknownConfig(
          context.selectedIssuerId,
          context.selectedIssuer['.well-known'],
        );
      }
      return issuersConfig;
    },
    downloadCredentialTypes: async (context: any) => {
      const response = await request(
        API_URLS.credentialTypes.method,
        API_URLS.credentialTypes.buildURL(context.selectedIssuerId),
      );
      return response?.response;
    },
    downloadCredential: async (context: any) => {
      const body = await getBody(context);
      const downloadTimeout = await vcDownloadTimeout();
      let credential = await request(
        'POST',
        context.selectedIssuer.credential_endpoint,
        body,
        '',
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + context.tokenResponse?.accessToken,
        },
        downloadTimeout,
      );
      console.info(`VC download via ${context.selectedIssuerId} is succesfull`);
      if (credential.credential.credentialSubject.name) {
        credential.credential.credentialSubject.fullName =
          credential.credential.credentialSubject.name;
      }
      if (credential.credential.id) {
        credential.credential.id = credential.credential.id
          .split(':')
          .reverse()[0];
      }
      credential = updateCredentialInformation(context, credential);
      return credential;
    },
    invokeAuthorization: async (context: any) => {
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.vcDownload,
          context.selectedIssuer.credential_issuer +
            TelemetryConstants.Screens.webViewPage,
        ),
      );
      let supportedScopes: [string];
      if (Object.keys(context.selectedCredentialType).length === 0) {
        supportedScopes = context.selectedIssuer.scopes_supported;
      } else {
        supportedScopes = [context.selectedCredentialType['scope']];
      }
      return await authorize(
        constructAuthorizationConfiguration(
          context.selectedIssuer,
          supportedScopes,
        ),
      );
    },
    generateKeyPair: async () => {
      if (!isHardwareKeystoreExists) {
        return await generateKeys();
      }
      const isBiometricsEnabled = SecureKeystore.hasBiometricsEnabled();
      return SecureKeystore.generateKeyPair(
        Issuers_Key_Ref,
        isBiometricsEnabled,
        0,
      );
    },
    verifyCredential: async (context: any) => {
      //this issuer specific check has to be removed once vc validation is done.
      if (
        VCMetadata.fromVcMetadataString(getVCMetadata(context)).issuer ===
        Issuers.Sunbird
      ) {
        return true;
      }
      const verificationResult = await verifyCredential(
        context.verifiableCredential?.credential,
      );
      if (!verificationResult.isVerified) {
        throw new Error(verificationResult.errorMessage);
      }
    },
  };
};
