import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {API_URLS, CACHED_API} from '../../shared/api';
import NetInfo from '@react-native-community/netinfo';
import {
  constructAuthorizationConfiguration,
  constructIssuerMetaData,
  constructProofJWT,
  hasKeyPair,
  OIDCErrors,
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
import {request} from '../../shared/request';
import {WalletBindingResponse} from '../VerifiableCredential/VCMetaMachine/vc';

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
        return verificationResult;
      } else {
        return {
          isVerified: true,
          verificationMessage: VerificationErrorMessage.NO_ERROR,
          verificationErrorCode: VerificationErrorType.NO_ERROR,
        };
      }
    },

    requestBindingOTP: async (context: any) => {
      const response = await request(
        API_URLS.bindingOtp.method,
        API_URLS.bindingOtp.buildURL(),
        {
          requestTime: String(new Date().toISOString()),
          request: {
            individualId:
              context.verifiableCredential.credential.credentialSubject.dni,
            otpChannels: ['EMAIL', 'PHONE'],
          },
        },
      );
      if (response.response == null) {
        throw new Error('Could not process request');
      }
      return response;
    },

    fetchKeyPair: async context => {
      const keyType = context.vcMetadata?.downloadKeyType;
      return await fetchKeyPair(keyType);
    },

    addWalletBindingId: async context => {
      const response = await request(
        API_URLS.walletBinding.method,
        API_URLS.walletBinding.buildURL(),
        {
          requestTime: String(new Date().toISOString()),
          request: {
            authFactorType: 'WLA',
            format: 'jwt',
            individualId:
              context.verifiableCredential.credential.credentialSubject.dni,
            transactionId: context.bindingTransactionId,
            publicKey: context.publicKey,
            challengeList: [
              {
                authFactorType: 'OTP',
                challenge: context.OTP,
                format: 'alpha-numeric',
              },
            ],
          },
        },
      );

      const walletResponse: WalletBindingResponse = {
        walletBindingId: response.response.encryptedWalletBindingId,
        keyId: response.response.keyId,
        thumbprint: response.response.thumbprint,
        expireDateTime: response.response.expireDateTime,
      };
      return walletResponse;
    },
  };
};
