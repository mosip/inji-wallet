import {assign, send} from 'xstate';
import {CommunicationDetails} from '../../../shared/Utils';
import {StoreEvents} from '../../store';
import {VCMetadata} from '../../../shared/VCMetadata';
import {MIMOTO_BASE_URL, MY_VCS_STORE_KEY} from '../../../shared/constants';
import {KeyPair} from 'react-native-rsa-native';
import i18n from '../../../i18n';
import {getHomeMachineService} from '../../../screens/Home/HomeScreenController';
import {DownloadProps} from '../../../shared/api';
import {isHardwareKeystoreExists} from '../../../shared/cryptoutil/cryptoUtil';
import {getBindingCertificateConstant} from '../../../shared/keystore/SecureKeystore';
import {getIdType} from '../../../shared/openId4VCI/Utils';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';
import {
  sendStartEvent,
  getStartEventData,
  sendInteractEvent,
  getInteractEventData,
  sendEndEvent,
  getEndEventData,
  sendErrorEvent,
  getErrorEventData,
} from '../../../shared/telemetry/TelemetryUtils';

import {ActivityLogEvents} from '../../activityLog';
import {BackupEvents} from '../../backupAndRestore/backup';
import {VcMetaEvents} from '../VCMetaMachine/VCMetaMachine';
import {WalletBindingResponse} from '../VCMetaMachine/vc';

export const VCItemActions = model => {
  return {
    setCommunicationDetails: model.assign({
      communicationDetails: (_context, event) => {
        const communicationDetails: CommunicationDetails = {
          phoneNumber: event.data.response.maskedMobile,
          emailId: event.data.response.maskedEmail,
        };
        return communicationDetails;
      },
    }),
    requestVcContext: send(
      (context: any) => ({
        type: 'GET_VC_ITEM',
        vcMetadata: context.vcMetadata,
      }),
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),
    setContext: model.assign((context, event) => {
      return {
        ...context,
        ...event.response,
        vcMetadata: context.vcMetadata,
      };
    }),
    storeContext: send(
      (context: any) => {
        const {serviceRefs, isMachineInKebabPopupState, ...data} = context;
        data.credentialRegistry = MIMOTO_BASE_URL;
        return StoreEvents.SET(
          VCMetadata.fromVC(context.vcMetadata).getVcKey(),
          data,
        );
      },
      {
        to: context => context.serviceRefs.store,
      },
    ),
    setVcMetadata: assign({
      vcMetadata: (_, event) => event.vcMetadata,
    }),
    storeVcInContext: send(
      //todo : separate handling done for openid4vci , handle commonly from vc machine
      (context: any) => {
        const {serviceRefs, ...verifiableCredential} = context;
        return {
          type: 'VC_DOWNLOADED',
          vc: verifiableCredential,
          vcMetadata: context.vcMetadata,
        };
      },
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),
    removeVcMetaDataFromStorage: send(
      (context: any) => {
        return StoreEvents.REMOVE_VC_METADATA(
          MY_VCS_STORE_KEY,
          context.vcMetadata.getVcKey(),
        );
      },
      {
        to: context => context.serviceRefs.store,
      },
    ),
    removeVcMetaDataFromVcMachineContext: send(
      (context: any) => {
        return {
          type: 'REMOVE_VC_FROM_CONTEXT',
          vcMetadata: context.vcMetadata,
        };
      },
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),
    sendDownloadLimitExpire: send(
      (context: any, event) => {
        return {
          type: 'DOWNLOAD_LIMIT_EXPIRED',
          vcMetadata: context.vcMetadata,
        };
      },
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),

    sendVerificationError: send(
      (context: any, _event) => {
        return {
          type: 'VERIFY_VC_FAILED',
          errorMessage: context.error,
          vcMetadata: context.vcMetadata,
        };
      },
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),
    refreshAllVcs: send(
      () => ({
        type: 'REFRESH_MY_VCS',
      }),
      {
        to: (context: any) => context.serviceRefs.vcMeta,
      },
    ),

    setPinCard: assign({
      vcMetadata: (context: any) =>
        new VCMetadata({
          ...context.vcMetadata,
          isPinned: !context.vcMetadata.isPinned,
        }),
    }),

    resetIsMachineInKebabPopupState: assign({
      isMachineInKebabPopupState: () => false,
    }),

    sendBackupEvent: send(BackupEvents.DATA_BACKUP(true), {
      to: (context: any) => context.serviceRefs.backup,
    }),
    //todo: revisit on this for naming and impl
    sendVcUpdated: send(
      (context: any) => VcMetaEvents.VC_METADATA_UPDATED(context.vcMetadata),
      {
        to: (context: any) => context.serviceRefs.vcMeta,
      },
    ),
    setErrorAsWalletBindingError: assign({
      error: () =>
        i18n.t('errors.genericError', {
          ns: 'common',
        }),
    }),
    setErrorAsVerificationError: assign({
      //todo handle error message from different actions
      error: (_context, event) => (event.data as Error).message,
    }),
    unSetError: assign({
      error: () => '',
    }),
    unSetBindingTransactionId: assign({bindingTransactionId: () => ''}),
    sendWalletBindingSuccess: send(
      context => {
        return {
          type: 'WALLET_BINDING_SUCCESS',
        };
      },
      {
        to: (context: any) => context.serviceRefs.vcMeta,
      },
    ),
    setWalletBindingResponse: assign({
      walletBindingResponse: (_context, event) =>
        event.data as WalletBindingResponse,
    }),
    incrementDownloadCounter: model.assign({
      downloadCounter: ({downloadCounter}) => downloadCounter + 1,
    }),

    setMaxDownloadCount: model.assign({
      maxDownloadCount: (_context, event) =>
        Number((event.data as DownloadProps).maxDownloadLimit),
    }),

    setDownloadInterval: model.assign({
      downloadInterval: (_context, event) =>
        Number((event.data as DownloadProps).downloadInterval),
    }),
    sendActivationStartEvent: context => {
      sendStartEvent(
        getStartEventData(
          context.isMachineInKebabPopupState
            ? TelemetryConstants.FlowType.vcActivationFromKebab
            : TelemetryConstants.FlowType.vcActivation,
        ),
      );
      sendInteractEvent(
        getInteractEventData(
          context.isMachineInKebabPopupState
            ? TelemetryConstants.FlowType.vcActivationFromKebab
            : TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.InteractEventSubtype.click,
          'Activate Button',
        ),
      );
    },

    sendUserCancelledActivationFailedEndEvent: context => {
      const [errorId, errorMessage] = [
        TelemetryConstants.ErrorId.userCancel,
        TelemetryConstants.ErrorMessage.activationCancelled,
      ];
      sendEndEvent(
        getEndEventData(
          context.isMachineInKebabPopupState
            ? TelemetryConstants.FlowType.vcActivationFromKebab
            : TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.EndEventStatus.failure,
          {
            errorId: errorId,
            errorMessage: errorMessage,
          },
        ),
      );
    },

    sendWalletBindingErrorEvent: (context, event) => {
      if (context.error) {
        const error = JSON.parse(JSON.stringify(event.data)).name
          ? JSON.parse(JSON.stringify(event.data)).name + '-' + context.error
          : context.error;
        sendErrorEvent(
          getErrorEventData(
            TelemetryConstants.FlowType.vcActivation,
            TelemetryConstants.ErrorId.activationFailed,
            error,
          ),
        );
      }
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.EndEventStatus.failure,
        ),
      );
    },

    sendActivationSuccessEvent: context =>
      sendEndEvent(
        getEndEventData(
          context.isMachineInKebabPopupState
            ? TelemetryConstants.FlowType.vcActivationFromKebab
            : TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.EndEventStatus.success,
        ),
      ),

    setPublicKey: assign({
      publicKey: (_context, event) => {
        if (!isHardwareKeystoreExists) {
          return (event.data as KeyPair).public;
        }
        return event.data as string;
      },
    }),

    setPrivateKey: assign({
      privateKey: (_context, event) => (event.data as KeyPair).private,
    }),
    resetPrivateKey: assign({
      privateKey: () => '',
    }),
    setThumbprintForWalletBindingId: send(
      (context: any) => {
        const {walletBindingResponse} = context;
        const walletBindingIdKey = getBindingCertificateConstant(
          walletBindingResponse.walletBindingId,
        );
        return StoreEvents.SET(
          walletBindingIdKey,
          walletBindingResponse.thumbprint,
        );
      },
      {
        to: context => context.serviceRefs.store,
      },
    ),
    setOTP: model.assign({
      OTP: (_, event) => event.OTP,
    }),

    unSetOTP: model.assign({OTP: () => ''}),
    removeVcItem: send(
      (context: any) => {
        return StoreEvents.REMOVE(
          MY_VCS_STORE_KEY,
          VCMetadata.fromVC(context.vcMetadata).getVcKey(),
        );
      },
      {to: context => context.serviceRefs.store},
    ),

    setVcKey: model.assign({
      vcMetadata: (_, event) => event.vcMetadata,
    }),
    removeVcFromInProgressDownloads: send(
      (context: any) => {
        return {
          type: 'REMOVE_VC_FROM_IN_PROGRESS_DOWNLOADS',
          vcMetadata: context.vcMetadata,
        };
      },
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),

    addVcToInProgressDownloads: send(
      (context: any) => {
        return {
          type: 'ADD_VC_TO_IN_PROGRESS_DOWNLOADS',
          requestId: context.vcMetadata.requestId,
        };
      },
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),
    sendTelemetryEvents: () => {
      sendEndEvent({
        type: TelemetryConstants.FlowType.vcDownload,
        status: TelemetryConstants.EndEventStatus.success,
      });
    },
    closeViewVcModal: send('DISMISS_MODAL', {
      to: () => getHomeMachineService(),
    }),
    logDownloaded: send(
      (context: any) => {
        const {serviceRefs, ...data} = context;
        return ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: context.vcMetadata.getVcKey(),
          type: 'VC_DOWNLOADED',
          id: context.vcMetadata.id,
          idType: getIdType(context.vcMetadata.issuer),
          timestamp: Date.now(),
          deviceName: '',
          vcLabel: data.id,
        });
      },
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),
    logRemovedVc: send(
      (context: any, _) =>
        ActivityLogEvents.LOG_ACTIVITY({
          idType: getIdType(context.vcMetadata.issuer),
          id: context.vcMetadata.id,
          _vcKey: VCMetadata.fromVC(context.vcMetadata).getVcKey(),
          type: 'VC_REMOVED',
          timestamp: Date.now(),
          deviceName: '',
          vcLabel: VCMetadata.fromVC(context.vcMetadata).id,
        }),
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),
    logWalletBindingSuccess: send(
      (context: any) =>
        ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: VCMetadata.fromVC(context.vcMetadata).getVcKey(),
          type: 'WALLET_BINDING_SUCCESSFULL',
          idType: getIdType(context.vcMetadata.issuer),
          id: context.vcMetadata.id,
          timestamp: Date.now(),
          deviceName: '',
          vcLabel: VCMetadata.fromVC(context.vcMetadata).id,
        }),
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),

    logWalletBindingFailure: send(
      (context: any) =>
        ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: VCMetadata.fromVC(context.vcMetadata).getVcKey(),
          type: 'WALLET_BINDING_FAILURE',
          id: context.vcMetadata.id,
          idType: getIdType(context.vcMetadata.issuer),
          timestamp: Date.now(),
          deviceName: '',
          vcLabel: VCMetadata.fromVC(context.vcMetadata).id,
        }),
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),
  };
};
