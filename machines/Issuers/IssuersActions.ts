import {ErrorMessage, Issuers_Key_Ref} from '../../shared/openId4VCI/Utils';
import {
  MY_VCS_STORE_KEY,
  NETWORK_REQUEST_FAILED,
  REQUEST_TIMEOUT,
} from '../../shared/constants';
import {assign, send} from 'xstate';
import {StoreEvents} from '../store';
import {BackupEvents} from '../backupAndRestore/backup';
import {getVCMetadata, VCMetadata} from '../../shared/VCMetadata';
import {isHardwareKeystoreExists} from '../../shared/cryptoutil/cryptoUtil';
import {ActivityLogEvents} from '../activityLog';
import {
  getEndEventData,
  getImpressionEventData,
  sendEndEvent,
  sendImpressionEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {KeyPair} from 'react-native-rsa-native';

export const IssuersActions = (model: any) => {
  return {
    setIsVerified: assign({
      vcMetadata: (context: any) =>
        new VCMetadata({
          ...context.vcMetadata,
          isVerified: true,
        }),
    }),
    resetIsVerified: assign({
      vcMetadata: (context: any) =>
        new VCMetadata({
          ...context.vcMetadata,
          isVerified: false,
        }),
    }),
    setIssuers: model.assign({
      issuers: (_: any, event: any) => event.data,
    }),
    setNoInternet: model.assign({
      errorMessage: () => ErrorMessage.NO_INTERNET,
    }),
    setLoadingReasonAsDisplayIssuers: model.assign({
      loadingReason: 'displayIssuers',
    }),
    setLoadingReasonAsDownloadingCredentials: model.assign({
      loadingReason: 'downloadingCredentials',
    }),
    setLoadingReasonAsSettingUp: model.assign({
      loadingReason: 'settingUp',
    }),
    resetLoadingReason: model.assign({
      loadingReason: null,
    }),
    setSelectedCredentialType: model.assign({
      selectedCredentialType: (_: any, event: any) => event.credType,
    }),
    setSupportedCredentialTypes: model.assign({
      supportedCredentialTypes: (_: any, event: any) => event.data,
    }),
    resetSelectedCredentialType: model.assign({
      selectedCredentialType: {},
    }),
    setFetchWellknownError: model.assign({
      errorMessage: (_: any, event: any) => {
        const error = event.data.message;
        if (error.includes(NETWORK_REQUEST_FAILED)) {
          return ErrorMessage.NO_INTERNET;
        }
        return ErrorMessage.TECHNICAL_DIFFICULTIES;
      },
    }),
    setCredentialTypeListDownloadFailureError: model.assign({
      errorMessage: (_: any, event: any) => {
        const error = event.data.message;
        if (error.includes(NETWORK_REQUEST_FAILED)) {
          return ErrorMessage.NO_INTERNET;
        }
        return ErrorMessage.CREDENTIAL_TYPE_DOWNLOAD_FAILURE;
      },
    }),

    setError: model.assign({
      errorMessage: (_: any, event: any) => {
        console.error('Error occurred ', event.data.message);
        const error = event.data.message;
        if (error.includes(NETWORK_REQUEST_FAILED)) {
          return ErrorMessage.NO_INTERNET;
        }
        if (error.includes(REQUEST_TIMEOUT)) {
          return ErrorMessage.REQUEST_TIMEDOUT;
        }
        return ErrorMessage.GENERIC;
      },
    }),
    setOIDCConfigError: model.assign({
      errorMessage: (_: any, event: any) => event.data.toString(),
    }),
    resetError: model.assign({
      errorMessage: '',
    }),

    loadKeyPair: assign({
      publicKey: (_, event: any) => event.response?.publicKey,
      privateKey: (context: any, event: any) =>
        event.response?.privateKey
          ? event.response.privateKey
          : context.privateKey,
    }),
    getKeyPairFromStore: send(StoreEvents.GET(Issuers_Key_Ref), {
      to: (context: any) => context.serviceRefs.store,
    }),
    sendBackupEvent: send(BackupEvents.DATA_BACKUP(true), {
      to: (context: any) => context.serviceRefs.backup,
    }),
    storeKeyPair: send(
      (context: any) => {
        return StoreEvents.SET(Issuers_Key_Ref, {
          publicKey: context.publicKey,
          privateKey: context.privateKey,
        });
      },
      {
        to: context => context.serviceRefs.store,
      },
    ),
    storeVerifiableCredentialMeta: send(
      context => StoreEvents.PREPEND(MY_VCS_STORE_KEY, getVCMetadata(context)),
      {
        to: (context: any) => context.serviceRefs.store,
      },
    ),

    setMetadataInCredentialData: (context: any) => {
      context.credentialWrapper = {
        ...context.credentialWrapper,
        vcMetadata: context.vcMetadata,
      };
    },

    setVCMetadata: assign({
      vcMetadata: context => {
        return getVCMetadata(context);
      },
    }),

    storeVerifiableCredentialData: send(
      (context: any) => {
        const vcMeatadata = getVCMetadata(context);
        return StoreEvents.SET(vcMeatadata.getVcKey(), {
          ...context.credentialWrapper,
          vcMetadata: vcMeatadata,
        });
      },
      {
        to: (context: any) => context.serviceRefs.store,
      },
    ),

    storeVcMetaContext: send(
      context => {
        return {
          type: 'VC_ADDED',
          vcMetadata: getVCMetadata(context),
        };
      },
      {
        to: (context: any) => context.serviceRefs.vcMeta,
      },
    ),

    storeVcsContext: send(
      (context: any) => {
        return {
          type: 'VC_DOWNLOADED',
          vcMetadata: getVCMetadata(context),
          vc: context.credentialWrapper,
        };
      },
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),

    setSelectedIssuers: model.assign({
      selectedIssuer: (context: any, event: any) =>
        context.issuers.find(issuer => issuer.credential_issuer === event.id),
    }),

    updateIssuerFromWellknown: model.assign({
      selectedIssuer: (context: any, event: any) => ({
        ...context.selectedIssuer,
        credential_audience: event.data.credential_issuer,
        credential_endpoint: event.data.credential_endpoint,
        credential_configurations_supported:
          event.data.credential_configurations_supported,
        authorization_servers: event.data.authorization_servers,
      }),
    }),
    setSelectedIssuerId: model.assign({
      selectedIssuerId: (_: any, event: any) => event.id,
    }),
    setTokenResponse: model.assign({
      tokenResponse: (_: any, event: any) => event.data,
    }),
    setVerifiableCredential: model.assign({
      verifiableCredential: (_: any, event: any) => {
        return event.data.verifiableCredential;
      },
    }),
    setCredentialWrapper: model.assign({
      credentialWrapper: (_: any, event: any) => {
        return event.data;
      },
    }),
    setPublicKey: assign({
      publicKey: (_, event: any) => {
        if (!isHardwareKeystoreExists) {
          return (event.data as KeyPair).public;
        }
        return event.data as string;
      },
    }),

    setPrivateKey: assign({
      privateKey: (_, event: any) => (event.data as KeyPair).private,
    }),

    logDownloaded: send(
      context => {
        const vcMetadata = getVCMetadata(context);
        return ActivityLogEvents.LOG_ACTIVITY(
          {
            _vcKey: vcMetadata.getVcKey(),
            type: 'VC_DOWNLOADED',
            id: vcMetadata.displayId,
            idType:
              context.credentialWrapper.verifiableCredential.credentialTypes,
            timestamp: Date.now(),
            deviceName: '',
            issuer: context.selectedIssuerId,
          },
          context.selectedCredentialType,
        );
      },
      {
        to: (context: any) => context.serviceRefs.activityLog,
      },
    ),
    sendSuccessEndEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.vcDownload,
          TelemetryConstants.EndEventStatus.success,
        ),
      );
    },

    sendErrorEndEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.vcDownload,
          TelemetryConstants.EndEventStatus.failure,
        ),
      );
    },
    sendImpressionEvent: () => {
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.vcDownload,
          TelemetryConstants.Screens.issuerList,
        ),
      );
    },

    updateVerificationErrorMessage: assign({
      verificationErrorMessage: (_, event: any) =>
        (event.data as Error).message,
    }),

    resetVerificationErrorMessage: model.assign({
      verificationErrorMessage: () => '',
    }),

    sendDownloadingFailedToVcMeta: send(
      (_: any) => ({
        type: 'VC_DOWNLOADING_FAILED',
      }),
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),
  };
};
