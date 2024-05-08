import SecureKeystore from '@mosip/secure-keystore';
import Cloud from '../../../shared/CloudBackupAndRestoreUtils';
import {VCMetadata} from '../../../shared/VCMetadata';
import getAllConfigurations, {
  API_URLS,
  DownloadProps,
} from '../../../shared/api';
import {
  generateKeys,
  isHardwareKeystoreExists,
} from '../../../shared/cryptoutil/cryptoUtil';
import {
  getBindingCertificateConstant,
  savePrivateKey,
} from '../../../shared/keystore/SecureKeystore';
import {CredentialDownloadResponse, request} from '../../../shared/request';
import {WalletBindingResponse} from '../VCMetaMachine/vc';
import {verifyCredential} from '../../../shared/vcjs/verifyCredential';
import {getMosipIdentifier} from '../../../shared/commonUtil';

export const VCItemServices = model => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },

    updatePrivateKey: async context => {
      const hasSetPrivateKey: boolean = await savePrivateKey(
        context.walletBindingResponse.walletBindingId,
        context.privateKey,
      );
      if (!hasSetPrivateKey) {
        throw new Error('Could not store private key in keystore.');
      }
      return '';
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
            individualId: VCMetadata.fromVC(context.vcMetadata).id,
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
      const certificate = response.response.certificate;
      await savePrivateKey(
        getBindingCertificateConstant(VCMetadata.fromVC(context.vcMetadata).id),
        certificate,
      );

      const walletResponse: WalletBindingResponse = {
        walletBindingId: response.response.encryptedWalletBindingId,
        keyId: response.response.keyId,
        thumbprint: response.response.thumbprint,
        expireDateTime: response.response.expireDateTime,
      };
      return walletResponse;
    },

    generateKeyPair: async context => {
      if (!isHardwareKeystoreExists) {
        return await generateKeys();
      }
      const isBiometricsEnabled = SecureKeystore.hasBiometricsEnabled();
      return SecureKeystore.generateKeyPair(
        VCMetadata.fromVC(context.vcMetadata).id,
        isBiometricsEnabled,
        0,
      );
    },
    requestBindingOTP: async context => {
      const vc = VCMetadata.fromVC(context.vcMetadata).isFromOpenId4VCI()
        ? context.verifiableCredential.credential
        : context.verifiableCredential;
      const response = await request(
        API_URLS.bindingOtp.method,
        API_URLS.bindingOtp.buildURL(),
        {
          requestTime: String(new Date().toISOString()),
          request: {
            individualId: VCMetadata.fromVC(context.vcMetadata).id,
            otpChannels: ['EMAIL', 'PHONE'],
          },
        },
      );
      if (response.response == null) {
        throw new Error('Could not process request');
      }
      return response;
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
              individualId: context.vcMetadata.id,
              requestId: context.vcMetadata.requestId,
            },
          );

          callback(
            model.events.CREDENTIAL_DOWNLOADED({
              credential: response.credential,
              verifiableCredential: response.verifiableCredential,
              generatedOn: new Date(),
              id: context.vcMetadata.id,
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
          context.verifiableCredential,
        );
        if (!verificationResult.isVerified) {
          throw new Error(verificationResult.errorMessage);
        }
      }
    },
  };
};
