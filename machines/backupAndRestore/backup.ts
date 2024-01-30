import {EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../shared/GlobalContext';
import {bytesToMB} from '../../shared/commonUtil';
import {
  LAST_BACKUP_DETAILS,
  MY_VCS_STORE_KEY,
  NETWORK_REQUEST_FAILED,
  TECHNICAL_ERROR,
  UPLOAD_MAX_RETRY,
} from '../../shared/constants';
import fileStorage, {
  backupDirectoryPath,
  compressAndRemoveFile,
  writeToBackupFile,
} from '../../shared/fileStorage';
import Cloud from '../../shared/googleCloudUtils';
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
  },
  {
    events: {
      DATA_BACKUP: () => ({}),
      OK: () => ({}),
      FETCH_DATA: () => ({}),
      DISMISS: () => ({}),
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
    entry: 'getLastBackupDetails',
    on: {
      DATA_BACKUP: [
        {
          target: 'backingUp',
        },
      ],
      STORE_RESPONSE: {
        actions: 'setLastBackupDetails',
      },
    },
    states: {
      init: {
        on: {
          DATA_BACKUP: [
            {
              target: 'backingUp',
            },
          ],
        },
      },
      backingUp: {
        initial: 'checkDataAvailabilityForBackup',
        states: {
          idle: {},
          checkDataAvailabilityForBackup: {
            entry: 'loadVcs',
            on: {
              STORE_RESPONSE: [
                {
                  cond: 'isVCFound',
                  target: 'checkStorageAvailability',
                },
                {
                  target: 'failure',
                },
              ],
            },
          },
          checkStorageAvailability: {
            entry: ['sendDataBackupStartEvent'],
            invoke: {
              src: 'checkStorageAvailability',
              onDone: [
                {
                  cond: 'isMinimumStorageRequiredForBackupReached',
                  target: 'failure',
                },
                {
                  target: 'fetchDataFromDB',
                },
              ],
              onError: {actions: ['setBackUpNotPossible'], target: 'failure'},
            },
          },
          fetchDataFromDB: {
            entry: ['fetchAllDataFromDB'],
            on: {
              STORE_RESPONSE: {
                actions: 'setDataFromStorage',
                target: 'writeDataToFile',
              },
              STORE_ERROR: {
                actions: ['setBackUpNotPossible'],
                target: 'failure',
              },
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
              onError: {
                target: 'failure',
              },
            },
          },
          uploadBackupFile: {
            invoke: {
              src: 'uploadBackupFile',
              onDone: {
                actions: ['extractLastBackupDetails', 'storeLastBackupDetails'],
              },
              onError: {
                actions: ['setBackupErrorReason'],
                target: 'failure',
              },
            },
            on: {
              STORE_RESPONSE: {
                target: 'success',
              },
            },
          },
          success: {
            entry: 'sendDataBackupSuccessEvent',
          },
          failure: {
            entry: [
              'sendDataBackupFailureEvent',
              (ctx, event) => console.log('failure state ', event),
            ],
          },
        },
        on: {
          FETCH_DATA: {
            target: '.checkStorageAvailability',
          },
          OK: {
            target: '.idle',
          },
          DISMISS: {
            target: 'init',
          },
        },
      },
    },
  },
  {
    actions: {
      setDataFromStorage: model.assign({
        dataFromStorage: (_context, event) => {
          return event.response;
        },
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

      extractLastBackupDetails: model.assign((context, event) => {
        const {backupDetails} = event.data;
        return {
          ...context,
          lastBackupDetails: backupDetails,
        };
      }),

      setLastBackupDetails: model.assign((context, event) => {
        return {
          ...context,
          lastBackupDetails: event.response,
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

      getLastBackupDetails: send(StoreEvents.GET(LAST_BACKUP_DETAILS), {
        to: context => {
          return context.serviceRefs.store;
        },
      }),

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
          };
          return reasons[event.data.error] || reasons[TECHNICAL_ERROR];
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
      isMinimumStorageRequiredForBackupReached: (_context, event) => {
        console.log('is min reach ', Boolean(event.data));
        return Boolean(event.data);
      },
      isVCFound: (_context, event) => {
        return event.response && event.response.length > 0;
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
    !state.matches('backingUp.failure')
  );
}
export function selectIsBackingUp(state: State) {
  return state.matches('backingUp');
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
type State = StateFrom<typeof backupMachine>;
