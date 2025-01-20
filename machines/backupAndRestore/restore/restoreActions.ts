import {send} from 'xstate';
import Cloud from '../../../shared/CloudBackupAndRestoreUtils';
import {
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
import {VcMetaEvents} from '../../VerifiableCredential/VCMetaMachine/VCMetaMachine';
import {StoreEvents} from '../../store';

export const restoreActions = model => {
  return {
    downloadUnsyncedBackupFiles: () => Cloud.downloadUnSyncedBackupFiles(),

    setShowRestoreInProgress: model.assign({
      showRestoreInProgress: true,
    }),

    unsetShowRestoreInProgress: model.assign({
      showRestoreInProgress: false,
    }),

    setRestoreTechnicalError: model.assign({
      errorReason: 'technicalError',
    }),
    setBackupFileName: model.assign({
      fileName: (_context: any, event: any) => event.data,
    }),

    setRestoreErrorReason: model.assign({
      errorReason: (_context: any, event: any) => {
        const reasons = {
          [Cloud.NO_BACKUP_FILE]: 'noBackupFile',
          [NETWORK_REQUEST_FAILED]: 'networkError',
          [TECHNICAL_ERROR]: 'technicalError',
        };
        return reasons[event.data.error] || reasons[TECHNICAL_ERROR];
      },
    }),

    setRestoreErrorReasonAsNetworkError: model.assign({
      errorReason: 'networkError',
    }),

    loadDataToMemory: send(
      (context: any, _event: any) => {
        return StoreEvents.RESTORE_BACKUP(context.dataFromBackupFile);
      },
      {to: context => context.serviceRefs.store},
    ),
    refreshVCs: send(VcMetaEvents.REFRESH_MY_VCS, {
      to: (context: any, _event: any) => context.serviceRefs.vcMeta,
    }),

    setDataFromBackupFile: model.assign({
      dataFromBackupFile: (_context: any, event: any) => {
        return event.dataFromBackupFile;
      },
    }),
    cleanupFiles: () => cleanupLocalBackups(),

    sendDataRestoreStartEvent: () => {
      sendStartEvent(
        getStartEventData(TelemetryConstants.FlowType.dataRestore),
      );
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.dataRestore,
          TelemetryConstants.Screens.dataRestoreScreen,
        ),
      );
    },

    sendDataRestoreSuccessEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.dataRestore,
          TelemetryConstants.EndEventStatus.success,
        ),
      );
    },

    sendDataRestoreErrorEvent: (_context, event) => {
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.dataRestore,
          TelemetryConstants.ErrorId.failure,
          JSON.stringify(event.data),
        ),
      );
    },

    sendDataRestoreFailureEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.dataRestore,
          TelemetryConstants.EndEventStatus.failure,
        ),
      );
    },
  };
};
