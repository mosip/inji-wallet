import {NativeModules} from 'react-native';
import Cloud from '../../../shared/CloudBackupAndRestoreUtils';
import getAllConfigurations, {
  API_URLS,
  CACHED_API,
  DownloadProps,
} from '../../../shared/api';
import {
  fetchKeyPair,
  generateKeyPair,
} from '../../../shared/cryptoutil/cryptoUtil';
import {CredentialDownloadResponse, request} from '../../../shared/request';
import {WalletBindingResponse} from '../VCMetaMachine/vc';
import {verifyCredential} from '../../../shared/vcjs/verifyCredential';
import {getVerifiableCredential} from './VCItemSelectors';
import {getSelectedCredentialTypeDetails} from '../../../shared/openId4VCI/Utils';
import {getCredentialTypes} from '../../../components/VC/common/VCUtils';
import {isIOS} from '../../../shared/constants';

const {RNSecureKeystoreModule} = NativeModules;
export const VCItemServices = model => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },

    loadDownloadLimitConfig: async context => {
      var resp = await getAllConfigurations();
      const maxLimit: number = resp.vcDownloadMaxRetry;
      const vcDownloadPoolInterval: number = resp.vcDownloadPoolInterval;

      const downloadProps: DownloadProps = {
        maxDownloadLimit: maxLimit,
        downloadInterval: vcDownloadPoolInterval,
      };
      return downloadProps;
    },

    checkDownloadExpiryLimit: async context => {
      if (context.downloadCounter > context.maxDownloadCount) {
        throw new Error(
          'Download limit expired for request id: ' +
            context.vcMetadata.requestId,
        );
      }
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
            individualId: context.vcMetadata.displayId,
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
    fetchKeyPair: async context => {
      const keyType = context.vcMetadata?.downloadKeyType;
      return await fetchKeyPair(keyType);
    },
    generateKeypairAndStore: async context => {
      const keyType = context.vcMetadata?.downloadKeyType;
      const keypair = await generateKeyPair(keyType);
      if ((keyType != 'ES256' && keyType != 'RS256') || isIOS())
        await RNSecureKeystoreModule.storeGenericKey(
          keypair.publicKey as string,
          keypair.privateKey as string,
          keyType,
        );
      return keypair;
    },
    requestBindingOTP: async context => {
      const response = await request(
        API_URLS.bindingOtp.method,
        API_URLS.bindingOtp.buildURL(),
        {
          requestTime: String(new Date().toISOString()),
          request: {
            individualId: context.vcMetadata.displayId,
            otpChannels: ['EMAIL', 'PHONE'],
          },
        },
      );
      if (response.response == null) {
        throw new Error('Could not process request');
      }
      return response;
    },
    fetchIssuerWellknown: async context => {
      const wellknownResponse = await CACHED_API.fetchIssuerWellknownConfig(
        context.vcMetadata.issuer,
        true,
      );
      const wellknownOfCredential = getSelectedCredentialTypeDetails(
        wellknownResponse,
        getCredentialTypes(context.verifiableCredential),
      );
      return wellknownOfCredential;
    },
    checkStatus: context => (callback, onReceive) => {
      const pollInterval = setInterval(
        () => callback(model.events.POLL()),
        context.downloadInterval,
      );

      onReceive(async event => {
        if (event.type === 'POLL_STATUS') {
          try {
            const response = await request(
              API_URLS.credentialStatus.method,
              API_URLS.credentialStatus.buildURL(context.vcMetadata.requestId),
            );
            switch (response.response?.statusCode) {
              case 'NEW':
                break;
              case 'ISSUED':
              case 'printing':
                callback(model.events.DOWNLOAD_READY());
                break;
              case 'FAILED':
              default:
                callback(model.events.FAILED());
                clearInterval(pollInterval);
                break;
            }
          } catch (error) {
            callback(model.events.FAILED());
            clearInterval(pollInterval);
          }
        }
      });

      return () => clearInterval(pollInterval);
    },

    downloadCredential: context => (callback, onReceive) => {
      const pollInterval = setInterval(
        () => callback(model.events.POLL()),
        context.downloadInterval,
      );

      onReceive(async event => {
        if (event.type === 'POLL_DOWNLOAD') {
          const response: CredentialDownloadResponse = await request(
            API_URLS.credentialDownload.method,
            API_URLS.credentialDownload.buildURL(),
            {
              individualId: context.vcMetadata.displayId,
              requestId: context.vcMetadata.requestId,
            },
          );

          callback(
            model.events.CREDENTIAL_DOWNLOADED({
              credential: response.credential,
              verifiableCredential: response.verifiableCredential,
              generatedOn: new Date(),
              idType: context.vcMetadata.idType,
              requestId: context.vcMetadata.requestId,
              lastVerifiedOn: null,
              walletBindingResponse: null,
              credentialRegistry: '',
            }),
          );
        }
      });

      return () => clearInterval(pollInterval);
    },

    verifyCredential: async context => {
      if (context.verifiableCredential) {
        const verificationResult = await verifyCredential(
          getVerifiableCredential(context.verifiableCredential),
        );
        if (!verificationResult.isVerified) {
          throw new Error(verificationResult.errorMessage);
        }
      }
    },
  };
};
