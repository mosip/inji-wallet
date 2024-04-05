import {
  ErrorMessage,
  getIdType,
  Issuers_Key_Ref,
  updateVCmetadataOfCredentialWrapper,
} from '../../shared/openId4VCI/Utils';
import {
  MY_VCS_STORE_KEY,
  NETWORK_REQUEST_FAILED,
  REQUEST_TIMEOUT,
} from '../../shared/constants';
import {assign, send} from 'xstate';
import {StoreEvents} from '../store';
import {BackupEvents} from '../backupAndRestore/backup';
import {getVCMetadata} from '../../shared/VCMetadata';
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

export const IssuersActions = model => {
  return {
    setIssuers: model.assign({
      issuers: (_, event) => event.data,
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
      selectedCredentialType: (_, event) => event.credType,
    }),
    setCredentialTypes: model.assign({
      credentialTypes: (_, event) => event.data.supportedCredentials,
    }),
    setError: model.assign({
      errorMessage: (_, event) => {
        console.error('Error occured ', event.data.message);
        const error = event.data.message;
        switch (error) {
          case NETWORK_REQUEST_FAILED:
            return ErrorMessage.NO_INTERNET;
          case REQUEST_TIMEOUT:
            return ErrorMessage.REQUEST_TIMEDOUT;
          default:
            return ErrorMessage.GENERIC;
        }
      },
    }),
    setOIDCConfigError: model.assign({
      errorMessage: (_, event) => event.data.toString(),
    }),
    resetError: model.assign({
      errorMessage: '',
    }),

    loadKeyPair: assign({
      publicKey: (_, event) => event.response?.publicKey,
      privateKey: (context, event) =>
        event.response?.privateKey
          ? event.response.privateKey
          : context.privateKey,
    }),
    getKeyPairFromStore: send(StoreEvents.GET(Issuers_Key_Ref), {
      to: context => context.serviceRefs.store,
    }),
    sendBackupEvent: send(BackupEvents.DATA_BACKUP(true), {
      to: context => context.serviceRefs.backup,
    }),
    storeKeyPair: send(
      context => {
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
        to: context => context.serviceRefs.store,
      },
    ),

    setMetadataInCredentialData: (context, event) => {
      const updatedCredentialWrapper = updateVCmetadataOfCredentialWrapper(
        context,
        context.credentialWrapper,
      );
      return updatedCredentialWrapper;
    },

    setVCMetadata: assign({
      vcMetadata: (context, event) => {
        const metadata = getVCMetadata(context);
        return metadata;
      },
    }),

    storeVerifiableCredentialData: send(
      context =>
        StoreEvents.SET(getVCMetadata(context).getVcKey(), {
          ...context.credentialWrapper,
          vcMetadata: getVCMetadata(context),
        }),
      {
        to: context => context.serviceRefs.store,
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
        to: context => context.serviceRefs.vcMeta,
      },
    ),

    storeVcsContext: send(
      context => {
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
      selectedIssuer: (_, event) => event.data,
    }),
    setSelectedIssuerId: model.assign({
      selectedIssuerId: (_, event) => event.id,
    }),
    setTokenResponse: model.assign({
      tokenResponse: (_, event) => event.data,
    }),
    setVerifiableCredential: model.assign({
      verifiableCredential: (_, event) => {
        return event.data.verifiableCredential;
      },
    }),
    setCredentialWrapper: model.assign({
      credentialWrapper: (_, event) => {
        return event.data;
      },
    }),
    setPublicKey: assign({
      publicKey: (_, event) => {
        if (!isHardwareKeystoreExists) {
          return (event.data as KeyPair).public;
        }
        return event.data as string;
      },
    }),

    setPrivateKey: assign({
      privateKey: (_, event) => (event.data as KeyPair).private,
    }),

    logDownloaded: send(
      context => {
        return ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: getVCMetadata(context).getVcKey(),
          type: 'VC_DOWNLOADED',
          id: getVCMetadata(context).id,
          idType: getIdType(getVCMetadata(context).issuer),
          timestamp: Date.now(),
          deviceName: '',
          vcLabel: getVCMetadata(context).id,
        });
      },
      {
        to: context => context.serviceRefs.activityLog,
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
      verificationErrorMessage: (context, event) =>
        (event.data as Error).message,
    }),

    resetVerificationErrorMessage: model.assign({
      verificationErrorMessage: () => '',
    }),
  };
};
