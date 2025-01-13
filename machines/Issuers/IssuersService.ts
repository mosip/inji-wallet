import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {CACHED_API} from '../../shared/api';
import NetInfo from '@react-native-community/netinfo';
import {
  constructAuthorizationConfiguration,
  constructIssuerMetaData,
  constructProofJWT,
  hasKeyPair,
  updateCredentialInformation,
  vcDownloadTimeout,
} from '../../shared/openId4VCI/Utils';
import {authorize} from 'react-native-app-auth';
import {
  fetchKeyPair,
  generateKeyPair,
} from '../../shared/cryptoutil/cryptoUtil';
import {NativeModules} from 'react-native';
import {
  VerificationErrorMessage,
  VerificationErrorType,
  verifyCredential,
} from '../../shared/vcjs/verifyCredential';
import {
  getImpressionEventData,
  sendImpressionEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {VciClient} from '../../shared/vciClient/VciClient';
import {isMockVC} from '../../shared/Utils';
import {VCFormat} from '../../shared/VCFormat';

export const IssuersService = () => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },
    downloadIssuersList: async () => {
      let issuers = await CACHED_API.fetchIssuers();
      console.log('Issuers>>>>>>>>>>>>>', issuers);
      return issuers;
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
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', credentialTypes);
      return credentialTypes;
    },
    downloadCredential: async (context: any) => {
      console.log('Starting downloadCredential function...');

      const downloadTimeout = await vcDownloadTimeout();
      console.log('downloadTimeout>>>>>>>>>>>>>', downloadTimeout);
      const accessToken: string = context.tokenResponse?.accessToken;
      console.log('downloadTimeout>>>>>>>>>>>>>', accessToken);

      const proofJWT = await constructProofJWT(
        context.publicKey,
        context.privateKey,
        accessToken,
        context.selectedIssuer,
        context.keyType,
      );
      console.log('downloadTimeout>>>>>>>>>>>>>', proofJWT);

      let credential = await VciClient.downloadCredential(
        constructIssuerMetaData(
          context.selectedIssuer,
          context.selectedCredentialType,
          downloadTimeout,
        ),
        proofJWT,
        accessToken,
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>accesstoken>>>>>>>>>>:',
          credential,
        ),
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>accesstoken>>>>>>>>>>>>>>>>',
          accessToken,
        ),
      );
      console.log('credentialmaincheck', JSON.stringify(credential, null, 2));
      console.info(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
      );
      console.info(`VC download via ${context.selectedIssuerId} is successful`);
      // if (credential.credential.credentialSubject.name) {
      //   credential.credential.credentialSubject.fullName =
      //     credential.credential.credentialSubject.name;
      // }
      console.log(
        'credential.credential.id>>>>>>>>>>',
        JSON.stringify(credential, null, 2),
      );
      // if (credential.credential.id) {
      //   credential.credential.id = credential.credential.id
      //     .split(':')
      //     .reverse()[0];
      // }
      return await updateCredentialInformation(context, credential);
    },
    invokeAuthorization: async (context: any) => {
      console.log(
        'invokeAuthorization called with context:>>>>>>>>>>>>>>>>>>>>>',
        context,
      );

      console.log('Selected Issuer:', context.selectedIssuer);

      console.log(
        'Credential Issuer URL:',
        context.selectedIssuer?.credential_issuer,
      );
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.vcDownload,
          context.selectedIssuer.credential_issuer +
            TelemetryConstants.Screens.webViewPage,
        ),
      );
      console.log('FlowType:', TelemetryConstants.FlowType.vcDownload);
      console.log('Issuer:', context.selectedIssuer.credential_issuer);
      console.log('Screen:', TelemetryConstants.Screens.webViewPage);
      console.log('Selected Issuer:', context.selectedIssuer);
      console.log(
        'Selected Credential Scope:',
        context.selectedCredentialType.scope,
      );
      let accessToken = await authorize(
        constructAuthorizationConfiguration(
          context.selectedIssuer,
          context.selectedCredentialType.scope,
        ),
      );
      console.log('access token >>>>>>>>>>>>>>', accessToken);
      return accessToken;
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
      //TODO: Remove bypassing verification of mock VCs once mock VCs are verifiable
      if (
        context.selectedCredentialType.format === VCFormat.mso_mdoc ||
        !isMockVC(context.selectedIssuerId)
      ) {
        const verificationResult = await verifyCredential(
          context.verifiableCredential?.credential,
          context.selectedCredentialType.format,
        );
        if (!verificationResult.isVerified) {
          throw new Error(verificationResult.verificationErrorCode);
        }
      } else {
        return {
          isVerified: true,
          verificationMessage: VerificationErrorMessage.NO_ERROR,
          verificationErrorCode: VerificationErrorType.NO_ERROR,
        };
      }
    },
  };
};
