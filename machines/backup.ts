import {EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../shared/GlobalContext';
import {StoreEvents} from './store';
import {
  isMinimumLimitForBackupReached,
  writeToBackupFile,
} from '../shared/storage';
import {
  compressAndRemoveFile,
  uploadBackupFileToDrive,
} from '../shared/fileStorage';
import {
  getEndEventData,
  getImpressionEventData,
  getStartEventData,
  sendEndEvent,
  sendImpressionEvent,
  sendStartEvent,
} from '../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../shared/telemetry/TelemetryConstants';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    dataFromStorage: {},
    fileName: '',
  },
  {
    events: {
      DATA_BACKUP: () => ({}),
      OK: () => ({}),
      FETCH_DATA: () => ({}),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({response}),
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
        initial: 'checkStorageAvailability',
        states: {
          idle: {},
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
            },
          },
          fetchDataFromDB: {
            entry: ['fetchAllDataFromDB'],
            on: {
              STORE_RESPONSE: {
                actions: 'setDataFromStorage',
                target: 'writeDataToFile',
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
                target: 'success',
              },
              onError: {
                actions: [
                  (context, event) =>
                    console.log(
                      'error happened while uploading backup file ',
                      event,
                    ),
                ],
                target: 'failure',
              },
            },
          },
          success: {
            entry: 'sendDataBackupSuccessEvent',
          },
          failure: {
            entry: 'sendDataBackupFailureEvent',
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

      fetchAllDataFromDB: send(StoreEvents.EXPORT(), {
        to: context => context.serviceRefs.store,
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
        return Promise.resolve(isMinimumLimitForBackupReached());
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
        const result = await uploadBackupFileToDrive(context.fileName);
        return result;
      },
    },

    guards: {
      isMinimumStorageRequiredForBackupReached: (_context, event) =>
        Boolean(event.data),
    },
  },
);

export function createBackupMachine(serviceRefs: AppServices) {
  return backupMachine.withContext({
    ...backupMachine.context,
    serviceRefs,
  });
}
export function selectIsBackingUp(state: State) {
  return state.matches('backingUp');
}
export function selectIsBackingUpSuccess(state: State) {
  return state.matches('backingUp.success');
}
export function selectIsBackingUpSFailure(state: State) {
  return state.matches('backingUp.failure');
}
type State = StateFrom<typeof backupMachine>;
