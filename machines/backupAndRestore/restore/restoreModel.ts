import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';

const restoreEvents = {
  BACKUP_RESTORE: () => ({}),
  DOWNLOAD_UNSYNCED_BACKUP_FILES: () => ({}),
  DISMISS: () => ({}),
  DISMISS_SHOW_RESTORE_IN_PROGRESS: () => ({}),
  STORE_RESPONSE: (response: unknown) => ({response}),
  STORE_ERROR: (error: Error, requester?: string) => ({error, requester}),
  DATA_FROM_FILE: (dataFromBackupFile: {}) => ({dataFromBackupFile}),
};

export const restoreModel = createModel(
  {
    serviceRefs: {} as AppServices,
    fileName: '',
    dataFromBackupFile: {},
    errorReason: '' as string,
    showRestoreInProgress: false as boolean,
  },
  {
    events: restoreEvents,
  },
);
