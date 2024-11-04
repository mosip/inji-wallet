import {assign, send} from 'xstate';
import {CommunicationDetails} from '../../../shared/Utils';
import {StoreEvents} from '../../store';
import {VCMetadata} from '../../../shared/VCMetadata';
import {MIMOTO_BASE_URL, MY_VCS_STORE_KEY} from '../../../shared/constants';
import i18n from '../../../i18n';
import {getHomeMachineService} from '../../../screens/Home/HomeScreenController';
import {DownloadProps} from '../../../shared/api';
import {isHardwareKeystoreExists} from '../../../shared/cryptoutil/cryptoUtil';
import {getBindingCertificateConstant} from '../../../shared/keystore/SecureKeystore';
import {getVcVerificationDetails} from '../../../shared/openId4VCI/Utils';
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
import {BannerStatusType} from '../../../components/BannerNotification';

export const VCItemActions = model => {
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

    setVerificationStatus: assign({
      verificationStatus: (context: any, event) => {
        const statusType =
          event.response.statusType === BannerStatusType.IN_PROGRESS
            ? BannerStatusType.IN_PROGRESS
            : event.response.vcMetadata.isVerified
            ? BannerStatusType.SUCCESS
            : BannerStatusType.ERROR;

        return getVcVerificationDetails(
          statusType,
          context.vcMetadata,
          context.verifiableCredential,
          context.wellknownResponse,
        );
      },
    }),

    resetVerificationStatus: assign({
      verificationStatus: (context: any) => {
        return context.verificationStatus?.statusType ===
          BannerStatusType.IN_PROGRESS
          ? context.verificationStatus
          : null;
      },
      showVerificationStatusBanner: () => false,
    }),

    showVerificationBannerStatus: assign({
      showVerificationStatusBanner: () => true,
    }),

    sendVerificationStatusToVcMeta: send(
      (context: any) => ({
        type: 'SET_VERIFICATION_STATUS',
        verificationStatus: context.verificationStatus,
      }),
      {to: context => context.serviceRefs.vcMeta},
    ),

    removeVerificationStatusFromVcMeta: send(
      (context: any) => ({
        type: 'RESET_VERIFICATION_STATUS',
        verificationStatus: context.verificationStatus,
      }),
      {to: context => context.serviceRefs.vcMeta},
    ),

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

    sendDownloadingFailedToVcMeta: send(
      (_: any) => ({
        type: 'VC_DOWNLOADING_FAILED',
      }),
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),

    setContext: model.assign((context, event) => {
      const vcMetadata = VCMetadata.fromVC(context.vcMetadata);
      if (!vcMetadata.id) {
        const verifiableCredentialId = event.response.verifiableCredential.id;
        const credId = verifiableCredentialId.startsWith('did')
          ? verifiableCredentialId.split(':')
          : verifiableCredentialId.split('/');
        vcMetadata.id = `${credId[credId.length - 1]} - ${vcMetadata.issuer}`;
      }
      return {
        ...context,
        ...event.response,
        vcMetadata: vcMetadata,
      };
    }),
    storeContext: send(
      (context: any) => {
        const {
          serviceRefs,
          isMachineInKebabPopupState,
          verificationStatus,
          showVerificationStatusBanner,
          ...data
        } = context;
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

    updateWellknownResponse: assign({
      wellknownResponse: (_, event) => event.data,
    }),

    storeVcInContext: send(
      //todo : separate handling done for openid4vci , handle commonly from vc machine
      (context: any) => {
        const {serviceRefs, wellknownResponse, ...data} = context;
        return {
          type: 'VC_DOWNLOADED',
          vc: data,
          vcMetadata: context.vcMetadata,
        };
      },
      {
        to: context => context.serviceRefs.vcMeta,
      },
    ),

    updateVcMetadata: send(
      (context: any) => VcMetaEvents.VC_METADATA_UPDATED(context.vcMetadata),
      {
        to: (context: any) => context.serviceRefs.vcMeta,
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
          {"Activation key":context.vcMetadata?.downloadKeyType}
        ),
      ),

    setPublicKey: assign({
      publicKey: (_context, event) => {
        if (!isHardwareKeystoreExists) {
          return event.data.publicKey as string;
        }
        return event.data.publicKey as string;
      },
    }),

    setPrivateKey: assign({
      privateKey: (_context, event) => event.data.privateKey as string,
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
      OTP: (_, event) => {
        return event.OTP;
      },
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
          id: context.vcMetadata.displayId,
          issuer: context.vcMetadata.issuer!!,
          credentialConfigurationId:
            context.verifiableCredential.credentialConfigurationId,
          timestamp: Date.now(),
          deviceName: '',
        });
      },
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),
    logRemovedVc: send(
      (context: any, _) => {
        const vcMetadata = VCMetadata.fromVC(context.vcMetadata);
        return ActivityLogEvents.LOG_ACTIVITY({
          credentialConfigurationId:
            context.verifiableCredential.credentialConfigurationId,
          issuer: vcMetadata.issuer!!,
          id: vcMetadata.displayId,
          _vcKey: vcMetadata.getVcKey(),
          type: 'VC_REMOVED',
          timestamp: Date.now(),
          deviceName: '',
        });
      },
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),
    logWalletBindingSuccess: send(
      (context: any) => {
        const vcMetadata = VCMetadata.fromVC(context.vcMetadata);
        return ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: vcMetadata.getVcKey(),
          type: 'WALLET_BINDING_SUCCESSFULL',
          credentialConfigurationId:
            context.verifiableCredential.credentialConfigurationId,
          issuer: vcMetadata.issuer!!,
          id: vcMetadata.displayId,
          timestamp: Date.now(),
          deviceName: '',
        });
      },
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),

    logWalletBindingFailure: send(
      (context: any) => {
        const vcMetadata = VCMetadata.fromVC(context.vcMetadata);
        return ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: vcMetadata.getVcKey(),
          type: 'WALLET_BINDING_FAILURE',
          id: vcMetadata.displayId,
          credentialConfigurationId:
            context.verifiableCredential.credentialConfigurationId,
          issuer: vcMetadata.issuer!!,
          timestamp: Date.now(),
          deviceName: '',
        });
      },
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),
  };
};
