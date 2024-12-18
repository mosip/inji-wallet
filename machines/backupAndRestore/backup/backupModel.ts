import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';
import {BackupDetails} from '../../../types/backup-and-restore/backup';

const BackupEvents = {
  DATA_BACKUP: (isAutoBackUp: boolean) => ({isAutoBackUp}),
  DISMISS: () => ({}),
  TRY_AGAIN: () => ({}),
  DISMISS_SHOW_BACKUP_IN_PROGRESS: () => ({}),
  LAST_BACKUP_DETAILS: () => ({}),
  STORE_RESPONSE: (response: unknown) => ({response}),
  STORE_ERROR: (error: Error, requester?: string) => ({error, requester}),
  FILE_NAME: (filename: string) => ({filename}),
};

export const backupModel = createModel(
  {
    serviceRefs: {} as AppServices,
    dataFromStorage: {},
    fileName: '',
    lastBackupDetails: null as null | BackupDetails,
    errorReason: '' as string,
    isAutoBackUp: true as boolean,
    isLoadingBackupDetails: true as boolean,
    showBackupInProgress: false as boolean,
  },
  {
    events: BackupEvents,
  },
);
