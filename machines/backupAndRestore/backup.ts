import {EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../shared/GlobalContext';
import {
  IOS_SIGNIN_FAILED,
  LAST_BACKUP_DETAILS,
  MY_VCS_STORE_KEY,
  NETWORK_REQUEST_FAILED,
  TECHNICAL_ERROR,
  UPLOAD_MAX_RETRY,
  isIOS,
} from '../../shared/constants';
import {
  cleanupLocalBackups,
  compressAndRemoveFile,
  writeToBackupFile,
} from '../../shared/fileStorage';
import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {isMinimumLimitForBackupReached} from '../../shared/storage';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {
  getEndEventData,
  getImpressionEventData,
  getStartEventData,
  sendEndEvent,
  sendImpressionEvent,
  sendStartEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {BackupDetails} from '../../types/backup-and-restore/backup';
import {StoreEvents} from '../store';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    dataFromStorage: {},
    fileName: '',
    lastBackupDetails: null as null | BackupDetails,
    errorReason: '' as string,
    isAutoBackUp: true as boolean,
    isLoading: true as boolean,
    showBackupInProgress: false as boolean,
  },
  {
    events: {
      DATA_BACKUP: (isAutoBackUp: boolean) => ({isAutoBackUp}),
      DISMISS: () => ({}),
      DISMISS_SHOW_BACKUP_IN_PROGRESS: () => ({}),
      LAST_BACKUP_DETAILS: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({response}),
      STORE_ERROR: (error: Error, requester?: string) => ({error, requester}),
      FILE_NAME: (filename: string) => ({filename}),
    },
  },
);

export const BackupEvents = model.events;

export const backupMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backup.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'backup',
    initial: 'init',
    on: {
      DATA_BACKUP: {
        actions: ['setIsAutoBackup'],
        target: 'backingUp',
      },
      LAST_BACKUP_DETAILS: [
        {
          cond: 'isIOS',
          target: 'fetchLastBackupDetails.checkCloud',
        },
        {target: 'fetchLastBackupDetails.checkStore'},
      ],
    },
    states: {
      init: {},
      fetchLastBackupDetails: {
        entry: ['unsetLastBackupDetails', 'setIsLoading'],
        initial: 'checkStore',
        states: {
          checkStore: {
            entry: 'getLastBackupDetailsFromStore',
            on: {
              STORE_RESPONSE: [
                {
                  cond: 'isDataAvailableInStorage',
                  actions: ['setLastBackupDetails', 'unsetIsLoading'],
                  target: '#backup.init',
                },
                {target: 'checkCloud'},
              ],
              STORE_ERROR: {
                target: 'checkCloud',
              },
            },
          },
          checkCloud: {
            invoke: {
              src: 'getLastBackupDetailsFromCloud',
              onDone: {
                actions: ['unsetIsLoading', 'setLastBackupDetails'],
                target: '#backup.init',
              },
              onError: {
                actions: 'unsetIsLoading',
                target: '#backup.init',
              },
            },
          },
        },
      },
      backingUp: {
        entry: 'setShowBackupInProgress',
        initial: 'checkDataAvailabilityForBackup',
        states: {
          idle: {},
          checkDataAvailabilityForBackup: {
            entry: ['sendDataBackupStartEvent', 'loadVcs'],
            on: {
              STORE_RESPONSE: [
                {
                  cond: 'isVCFound',
                  target: 'checkStorageAvailability',
                },
                {
                  cond: 'checkIfAutoBackup',
                  actions: 'setBackUpNotPossible',
                  target: 'silentFailure',
                },
                {
                  actions: 'setBackUpNotPossible',
                  target: 'failure',
                },
              ],
            },
          },
          checkStorageAvailability: {
            invoke: {
              src: 'checkStorageAvailability',
              onDone: [
                {
                  cond: 'isMinimumStorageRequiredForBackupAvailable',
                  target: 'fetchDataFromDB',
                },
                {
                  cond: 'checkIfAutoBackup',
                  actions: 'setErrorReasonAsStorageLimitReached',
                  target: 'silentFailure',
                },
                {
                  actions: 'setErrorReasonAsStorageLimitReached',
                  target: 'failure',
                },
              ],
              onError: [
                {
                  cond: 'checkIfAutoBackup',
                  actions: ['setBackUpNotPossible'],
                  target: 'silentFailure',
                },
                {
                  actions: ['setBackUpNotPossible'],
                  target: 'failure',
                },
              ],
            },
          },
          fetchDataFromDB: {
            entry: ['fetchAllDataFromDB'],
            on: {
              STORE_RESPONSE: {
                actions: 'setDataFromStorage',
                target: 'writeDataToFile',
              },
              STORE_ERROR: [
                {
                  cond: 'checkIfAutoBackup',
                  actions: ['setBackupErrorReason'],
                  target: 'silentFailure',
                },
                {
                  actions: ['setBackupErrorReason'],
                  target: 'failure',
                },
              ],
            },
          },
          writeDataToFile: {
            invoke: {
              src: 'writeDataToFile',
            },
            on: {
              FILE_NAME: {
                actions: 'setFileName',
                target: 'zipBackupFile',
              },
            },
          },
          zipBackupFile: {
            invoke: {
              src: 'zipBackupFile',
              onDone: {
                target: 'uploadBackupFile',
              },
              onError: [
                {
                  cond: 'checkIfAutoBackup',
                  target: 'silentFailure',
                },
                {
                  target: 'failure',
                },
              ],
            },
          },
          uploadBackupFile: {
            invoke: {
              src: 'uploadBackupFile',
              onDone: {
                actions: ['extractLastBackupDetails', 'storeLastBackupDetails'],
              },
              onError: [
                {
                  cond: 'checkIfAutoBackup',
                  actions: ['setBackupErrorReason'],
                  target: 'silentFailure',
                },
                {
                  actions: ['setBackupErrorReason'],
                  target: 'failure',
                },
              ],
            },
            on: {
              STORE_RESPONSE: [
                {
                  cond: 'checkIfAutoBackup',
                  target: 'silentSuccess',
                },
                {
                  target: 'success',
                },
              ],
            },
          },
          success: {
            entry: [
              'unsetShowBackupInProgress',
              'sendDataBackupSuccessEvent',
              'cleanupFiles',
            ],
          },
          silentSuccess: {
            entry: ['sendDataBackupSuccessEvent', 'cleanupFiles'],
          },
          failure: {
            entry: [
              'unsetShowBackupInProgress',
              'sendDataBackupFailureEvent',
              'cleanupFiles',
            ],
          },
          silentFailure: {
            entry: ['sendDataBackupFailureEvent', 'cleanupFiles'],
          },
        },
        on: {
          DISMISS: {
            target: 'init',
          },
          DISMISS_SHOW_BACKUP_IN_PROGRESS: {
            actions: 'unsetShowBackupInProgress',
          },
        },
      },
    },
  },
  {
    actions: {
      unsetIsLoading: model.assign({
        isLoading: false,
      }),
      setIsLoading: model.assign({
        isLoading: true,
      }),
      setDataFromStorage: model.assign({
        dataFromStorage: (_context, event) => {
          return event.response;
        },
      }),

      setIsAutoBackup: model.assign({
        isAutoBackUp: (_context, event) => {
          return event.isAutoBackUp;
        },
      }),

      setShowBackupInProgress: model.assign({
        showBackupInProgress: (context, _event) => {
          return !context.isAutoBackUp;
        },
      }),

      unsetShowBackupInProgress: model.assign({
        showBackupInProgress: false,
      }),

      setFileName: model.assign({
        fileName: (_context, event) => {
          return event.filename;
        },
      }),

      loadVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
        to: context => context.serviceRefs.store,
      }),

      setBackUpNotPossible: model.assign({
        errorReason: 'noDataForBackup',
      }),

      setErrorReasonAsStorageLimitReached: model.assign({
        errorReason: 'storageLimitReached',
      }),

      extractLastBackupDetails: model.assign((context, event) => {
        const {backupDetails} = event.data;
        return {
          ...context,
          lastBackupDetails: backupDetails,
        };
      }),

      setLastBackupDetails: model.assign((context, event) => {
        const lastBackupDetails =
          event.type === 'STORE_RESPONSE' ? event.response : event.data;
        return {
          ...context,
          lastBackupDetails: lastBackupDetails,
        };
      }),
      unsetLastBackupDetails: model.assign((context, event) => {
        return {
          ...context,
          lastBackupDetails: null,
        };
      }),

      storeLastBackupDetails: send(
        context => {
          const {lastBackupDetails} = context;
          return StoreEvents.SET(LAST_BACKUP_DETAILS, lastBackupDetails);
        },
        {
          to: context => context.serviceRefs.store,
        },
      ),

      getLastBackupDetailsFromStore: send(
        StoreEvents.GET(LAST_BACKUP_DETAILS),
        {
          to: context => {
            return context.serviceRefs.store;
          },
        },
      ),

      fetchAllDataFromDB: send(StoreEvents.EXPORT(), {
        to: context => {
          return context.serviceRefs.store;
        },
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

      sendDataBackupStartEvent: () => {
        sendStartEvent(
          getStartEventData(TelemetryConstants.FlowType.dataBackup),
        );
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
    },

    services: {
      getLastBackupDetailsFromCloud: () => async () =>
        await Cloud.lastBackupDetails(),

      checkStorageAvailability: () => async () => {
        try {
          console.log('Checking storage availability...');
          const isAvailable = await isMinimumLimitForBackupReached();
          console.log('Storage availability:', isAvailable);
          return isAvailable;
        } catch (error) {
          console.log('Error in checkStorageAvailability:', error);
          throw error;
        }
      },

      writeDataToFile: context => async callack => {
        const fileName = await writeToBackupFile(context.dataFromStorage);
        callack(model.events.FILE_NAME(fileName));
      },

      zipBackupFile: context => async () => {
        const result = await compressAndRemoveFile(context.fileName);
        return result;
      },
      uploadBackupFile: context => async () => {
        const result = await Cloud.uploadBackupFileToDrive(
          context.fileName,
          UPLOAD_MAX_RETRY,
        );
        return result;
      },
    },

    guards: {
      isMinimumStorageRequiredForBackupAvailable: (_context, event) => {
        return Boolean(!event.data);
      },
      checkIfAutoBackup: context => {
        return context.isAutoBackUp;
      },
      isVCFound: (_context, event) => {
        return !!(event.response && (event.response as object[]).length > 0);
      },
      isIOS: () => isIOS() || false,
      isDataAvailableInStorage: (_context, event) => {
        return event.response != null;
      },
    },
  },
);

export function createBackupMachine(serviceRefs: AppServices) {
  return backupMachine.withContext({
    ...backupMachine.context,
    serviceRefs,
  });
}
export function selectIsBackupInprogress(state: State) {
  return (
    state.matches('backingUp') &&
    !state.matches('backingUp.success') &&
    !state.matches('backingUp.silentSuccess') &&
    !state.matches('backingUp.failure') &&
    !state.matches('backingUp.silentFailure')
  );
}
export function selectIsLoading(state: State) {
  return state.context.isLoading;
}
export function selectIsBackingUpSuccess(state: State) {
  return state.matches('backingUp.success');
}
export function selectIsBackingUpFailure(state: State) {
  return state.matches('backingUp.failure');
}
export function lastBackupDetails(state: State) {
  return state.context.lastBackupDetails;
}
export function selectBackupErrorReason(state: State) {
  return state.context.errorReason;
}
export function selectShowBackupInProgress(state: State) {
  return state.context.showBackupInProgress;
}
type State = StateFrom<typeof backupMachine>;
