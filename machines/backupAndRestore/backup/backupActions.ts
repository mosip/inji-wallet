import {send} from 'xstate';
import {
  IOS_SIGNIN_FAILED,
  MY_VCS_STORE_KEY,
  NETWORK_REQUEST_FAILED,
  TECHNICAL_ERROR,
} from '../../../shared/constants';
import {cleanupLocalBackups} from '../../../shared/fileStorage';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';
import {
  getEndEventData,
  getErrorEventData,
  getImpressionEventData,
  getStartEventData,
  sendEndEvent,
  sendErrorEvent,
  sendImpressionEvent,
  sendStartEvent,
} from '../../../shared/telemetry/TelemetryUtils';
import {StoreEvents} from '../../store';

export const backupActions = model => {
  return {
    unsetIsLoadingBackupDetails: model.assign({
      isLoadingBackupDetails: false,
    }),
    setIsLoadingBackupDetails: model.assign({
      isLoadingBackupDetails: true,
    }),
    setDataFromStorage: model.assign({
      dataFromStorage: (_context: any, event: any) => {
        return event.response;
      },
    }),

    setIsAutoBackup: model.assign({
      isAutoBackUp: (_context: any, event: any) => {
        return event.isAutoBackUp;
      },
    }),

    setShowBackupInProgress: model.assign({
      showBackupInProgress: (context: any, _event: any) => {
        return !context.isAutoBackUp;
      },
    }),

    unsetShowBackupInProgress: model.assign({
      showBackupInProgress: false,
    }),

    setFileName: model.assign({
      fileName: (_context: any, event: any) => {
        return event.filename;
      },
    }),

    loadVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
      to: (context: any, _event: any) => context.serviceRefs.store,
    }),

    setBackUpNotPossible: model.assign({
      errorReason: 'noDataForBackup',
    }),

    setErrorReasonAsStorageLimitReached: model.assign({
      errorReason: 'storageLimitReached',
    }),

    extractLastBackupDetails: model.assign((context: any, event: any) => {
      const {backupDetails} = event.data;
      return {
        ...context,
        lastBackupDetails: backupDetails,
      };
    }),

    setLastBackupDetails: model.assign((context: any, event: any) => {
      const lastBackupDetails =
        event.type === 'STORE_RESPONSE' ? event.response : event.data;
      return {
        ...context,
        lastBackupDetails: lastBackupDetails,
      };
    }),
    unsetLastBackupDetails: model.assign((context: any, _event: any) => {
      return {
        ...context,
        lastBackupDetails: null,
      };
    }),

    fetchAllDataFromDB: send(StoreEvents.EXPORT(), {
      to: (context: any, _event: any) => {
        return context.serviceRefs.store;
      },
    }),

    setBackupErrorReasonAsNoInternet: model.assign({
      errorReason: () => 'networkError',
    }),

    setBackupErrorReason: model.assign({
      errorReason: (_context, event) => {
        const reasons = {
          [TECHNICAL_ERROR]: 'technicalError',
          [NETWORK_REQUEST_FAILED]: 'networkError',
          [IOS_SIGNIN_FAILED]: 'iCloudSignInError',
        };
        return reasons[event.data?.error] || reasons[TECHNICAL_ERROR];
      },
    }),

    sendFetchLastBackupDetailsStartEvent: () => {
      sendStartEvent(getStartEventData(TelemetryConstants.FlowType.dataBackup));
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.fetchLastBackupDetails,
          TelemetryConstants.Screens.dataBackupScreen,
        ),
      );
    },

    sendFetchLastBackupDetailsErrorEvent: (_context, event) => {
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.fetchLastBackupDetails,
          TelemetryConstants.ErrorId.failure,
          JSON.stringify(event.data),
        ),
      );
    },

    sendFetchLastBackupDetailsSuccessEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.fetchLastBackupDetails,
          TelemetryConstants.EndEventStatus.success,
        ),
      );
    },

    sendFetchLastBackupDetailsFailureEvent: (_context, event) => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.fetchLastBackupDetails,
          TelemetryConstants.EndEventStatus.failure,
          {comment: JSON.stringify(event.data)},
        ),
      );
    },

    sendFetchLastBackupDetailsCancelEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.fetchLastBackupDetails,
          TelemetryConstants.EndEventStatus.cancel,
        ),
      );
    },

    sendDataBackupStartEvent: () => {
      sendStartEvent(getStartEventData(TelemetryConstants.FlowType.dataBackup));
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.dataBackup,
          TelemetryConstants.Screens.dataBackupScreen,
        ),
      );
    },

    sendDataBackupSuccessEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.dataBackup,
          TelemetryConstants.EndEventStatus.success,
        ),
      );
    },
    cleanupFiles: () => {
      cleanupLocalBackups();
    },

    sendDataBackupFailureEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.dataBackup,
          TelemetryConstants.EndEventStatus.failure,
        ),
      );
    },
  };
};
