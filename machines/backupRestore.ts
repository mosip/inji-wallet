import {EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../shared/GlobalContext';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
  },
  {
    events: {
      BACKUP_RESTORE: () => ({}),
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
        },
        on: {},
      },
    },
  },
  {
    actions: {},

    services: {},

    guards: {},
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
type State = StateFrom<typeof backupRestoreMachine>;
