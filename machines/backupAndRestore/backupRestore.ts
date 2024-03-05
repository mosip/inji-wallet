import {EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../shared/GlobalContext';
import fileStorage, {
  cleanupLocalBackups,
  getBackupFilePath,
  unZipAndRemoveFile,
} from '../../shared/fileStorage';
import Storage from '../../shared/storage';
import {StoreEvents} from '../store';
import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {
  sendStartEvent,
  getStartEventData,
  sendImpressionEvent,
  getImpressionEventData,
  sendEndEvent,
  getEndEventData,
} from '../../shared/telemetry/TelemetryUtils';
import {VcEvents} from '../VCItemMachine/vc';
import {NETWORK_REQUEST_FAILED, TECHNICAL_ERROR} from '../../shared/constants';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    fileName: '',
    dataFromBackupFile: {},
    errorReason: '' as string,
    showRestoreInProgress: false as boolean,
  },
  {
    events: {
      BACKUP_RESTORE: () => ({}),
      DOWNLOAD_UNSYNCED_BACKUP_FILES: () => ({}),
      DISMISS: () => ({}),
      DISMISS_SHOW_RESTORE_IN_PROGRESS: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({response}),
      STORE_ERROR: (error: Error, requester?: string) => ({error, requester}),
      DATA_FROM_FILE: (dataFromBackupFile: {}) => ({dataFromBackupFile}),
    },
  },
);

export const BackupRestoreEvents = model.events;

export const backupRestoreMachine = model.createMachine(
  {
    /** @xstate-layout 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 */
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backupRestore.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'backupRestore',
    initial: 'init',
    on: {
      BACKUP_RESTORE: [
        {
          target: 'restoreBackup',
        },
      ],
      DOWNLOAD_UNSYNCED_BACKUP_FILES: {
        actions: 'downloadUnsyncedBackupFiles',
      },
    },
    states: {
      init: {},
      restoreBackup: {
        initial: 'checkStorageAvailability',
        entry: 'setShowRestoreInProgress',
        states: {
          idle: {},
          checkStorageAvailability: {
            entry: ['sendDataRestoreStartEvent'],
            invoke: {
              src: 'checkStorageAvailability',
              onDone: [
                {
                  cond: 'isMinimumStorageRequiredForBackupRestorationReached',
                  actions: 'setRestoreTechnicalError',
                  target: ['failure'],
                },
                {
                  target: 'downloadBackupFileFromCloud',
                },
              ],
            },
          },
          downloadBackupFileFromCloud: {
            invoke: {
              src: 'downloadLatestBackup',
              onDone: {
                actions: 'setBackupFileName',
                target: 'unzipBackupFile',
              },
              onError: {
                actions: ['setRestoreErrorReason'],
                target: 'failure',
              },
            },
          },
          unzipBackupFile: {
            invoke: {
              src: 'unzipBackupFile',
              onDone: {
                target: 'readBackupFile',
              },
              onError: {
                actions: ['setRestoreErrorReason'],
                target: 'failure',
              },
            },
          },
          readBackupFile: {
            invoke: {
              src: 'readBackupFile',
            },
            on: {
              DATA_FROM_FILE: {
                actions: ['setDataFromBackupFile'],
                target: 'loadDataToMemory',
              },
            },
          },
          loadDataToMemory: {
            entry: 'loadDataToMemory',
            on: {
              STORE_RESPONSE: {
                actions: 'refreshVCs',
                target: 'success',
              },
              STORE_ERROR: {
                actions: 'setRestoreTechnicalError',
                target: 'failure',
              },
            },
          },
          success: {
            entry: [
              'unsetShowRestoreInProgress',
              'sendDataRestoreSuccessEvent',
              'cleanupFiles',
            ],
          },
          failure: {
            entry: [
              'unsetShowRestoreInProgress',
              'sendDataRestoreFailureEvent',
              'cleanupFiles',
            ],
          },
        },
        on: {
          DISMISS: {
            target: 'init',
          },
          DISMISS_SHOW_RESTORE_IN_PROGRESS: {
            actions: 'unsetShowRestoreInProgress',
          },
        },
      },
    },
  },
  {
    actions: {
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
        fileName: (_context, event) => event.data,
      }),

      setRestoreErrorReason: model.assign({
        errorReason: (_context, event) => {
          const reasons = {
            [Cloud.NO_BACKUP_FILE]: 'noBackupFile',
            [NETWORK_REQUEST_FAILED]: 'networkError',
            [TECHNICAL_ERROR]: 'technicalError',
          };
          return reasons[event.data.error] || reasons[TECHNICAL_ERROR];
        },
      }),

      loadDataToMemory: send(
        context => {
          return StoreEvents.RESTORE_BACKUP(context.dataFromBackupFile);
        },
        {to: context => context.serviceRefs.store},
      ),
      refreshVCs: send(VcEvents.REFRESH_MY_VCS, {
        to: context => context.serviceRefs.vc,
      }),

      setDataFromBackupFile: model.assign({
        dataFromBackupFile: (_context, event) => {
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

      sendDataRestoreFailureEvent: () => {
        sendEndEvent(
          getEndEventData(
            TelemetryConstants.FlowType.dataRestore,
            TelemetryConstants.EndEventStatus.failure,
          ),
        );
      },
    },

    services: {
      checkStorageAvailability: () => async () => {
        return await Storage.isMinimumLimitReached('minStorageRequired');
      },

      downloadLatestBackup: () => async () => {
        const backupFileName = await Cloud.downloadLatestBackup();
        if (backupFileName === null) {
          return new Error('unable to download backup file');
        }
        return backupFileName;
      },

      unzipBackupFile: context => async () => {
        return await unZipAndRemoveFile(context.fileName);
      },
      readBackupFile: context => async callback => {
        // trim extension
        context.fileName = context.fileName.endsWith('.injibackup')
          ? context.fileName.split('.injibackup')[0]
          : context.fileName;
        const dataFromBackupFile = await fileStorage.readFile(
          getBackupFilePath(context.fileName),
        );
        callback(model.events.DATA_FROM_FILE(dataFromBackupFile));
      },
    },

    guards: {
      isBackupFile: (_, event) => event.data.endsWith('.injibackup'),
      isMinimumStorageRequiredForBackupRestorationReached: (_context, event) =>
        Boolean(event.data),
    },
  },
);

export function createBackupRestoreMachine(serviceRefs: AppServices) {
  return backupRestoreMachine.withContext({
    ...backupRestoreMachine.context,
    serviceRefs,
  });
}
export function selectErrorReason(state: State) {
  return state.context.errorReason;
}
export function selectIsBackUpRestoring(state: State) {
  return (
    state.matches('restoreBackup') &&
    !state.matches('restoreBackup.success') &&
    !state.matches('restoreBackup.failure')
  );
}
export function selectIsBackUpRestoreSuccess(state: State) {
  return state.matches('restoreBackup.success');
}
export function selectIsBackUpRestoreFailure(state: State) {
  return state.matches('restoreBackup.failure');
}
export function selectShowRestoreInProgress(state: State) {
  return state.context.showRestoreInProgress;
}
type State = StateFrom<typeof backupRestoreMachine>;

function getFileNameFromZIPfile(fileName: string): string {
  if (fileName.endsWith('.zip')) {
    return fileName.split('.zip')[0] + '.injibackup';
  }
  return fileName + '.injiBackup';
}
