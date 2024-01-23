import {EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../shared/GlobalContext';
import {
  isMinimumLimitForBackupRestorationReached,
  writeToBackupFile,
} from '../shared/storage';
import fileStorage, {
  getBackupFilePath,
  unZipAndRemoveFile,
} from '../shared/fileStorage';
import {StoreEvents} from './store';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    fileName: '',
    dataFromBackupFile: {},
  },
  {
    events: {
      BACKUP_RESTORE: () => ({}),
      EXTRACT_DATA: () => ({}),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({response}),
      STORE_ERROR: (error: Error, requester?: string) => ({error, requester}),
      DATA_FROM_FILE: (dataFromBackupFile: {}) => ({dataFromBackupFile}),
      OK: () => ({}),
    },
  },
);

export const BackupRestoreEvents = model.events;

export const backupRestoreMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backupRestore.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'backupRestore',
    initial: 'init',
    states: {
      init: {
        on: {
          BACKUP_RESTORE: [
            {
              target: 'restoreBackup',
            },
          ],
        },
      },
      restoreBackup: {
        initial: 'idle',
        states: {
          idle: {},
          checkStorageAvailibility: {
            invoke: {
              src: 'checkStorageAvailability',
              onDone: [
                {
                  cond: 'isMinimumStorageRequiredForBackupRestorationReached',
                  target: 'failure',
                },
                {
                  actions: ['setBackedUpFileName'],
                  target: 'unzipBackupFile',
                },
              ],
            },
          },
          unzipBackupFile: {
            invoke: {
              src: 'unzipBackupFile',
              onDone: {
                target: 'readBackupFile',
              },
              onError: {
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
                target: 'success',
              },
              STORE_ERROR: {
                target: 'failure',
              },
            },
          },
          success: {},
          failure: {},
        },
        on: {
          OK: {
            target: '.idle',
          },
          DISMISS: {
            target: 'init',
          },
          EXTRACT_DATA: {
            target: '.checkStorageAvailibility',
          },
        },
      },
    },
  },
  {
    actions: {
      setBackedUpFileName: model.assign({
        fileName: 'backup_1705993427049',
      }),

      loadDataToMemory: send(
        context => {
          return StoreEvents.RESTORE_BACKUP(context.dataFromBackupFile);
        },
        {to: context => context.serviceRefs.store},
      ),

      setDataFromBackupFile: model.assign({
        dataFromBackupFile: (_context, event) => {
          return event.dataFromBackupFile;
        },
      }),
    },

    services: {
      checkStorageAvailability: () => async () => {
        return Promise.resolve(isMinimumLimitForBackupRestorationReached());
      },
      unzipBackupFile: context => async () => {
        const result = await unZipAndRemoveFile(context.fileName);
        return result;
      },

      readBackupFile: context => async callack => {
        const dataFromBackupFile = await fileStorage.readFile(
          getBackupFilePath(context.fileName),
        );
        callack(model.events.DATA_FROM_FILE(dataFromBackupFile));
      },
    },

    guards: {
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
export function selectIsBackUpRestoring(state: State) {
  return state.matches('restoreBackup');
}
export function selectIsBackUpRestoreSuccess(state: State) {
  return state.matches('restoreBackup.success');
}
export function selectIsBackUpRestoreFailure(state: State) {
  return state.matches('restoreBackup.failure');
}
type State = StateFrom<typeof backupRestoreMachine>;
