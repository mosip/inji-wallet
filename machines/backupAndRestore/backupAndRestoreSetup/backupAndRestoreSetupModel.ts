import {createModel} from 'xstate/lib/model';
import {ProfileInfo} from '../../../shared/CloudBackupAndRestoreUtils';
import {AppServices} from '../../../shared/GlobalContext';

const backupAndRestoreSetupEvent = {
  HANDLE_BACKUP_AND_RESTORE: () => ({}),
  PROCEED: () => ({}),
  GO_BACK: () => ({}),
  TRY_AGAIN: () => ({}),
  RECONFIGURE_ACCOUNT: () => ({}),
  OPEN_SETTINGS: () => ({}),
  DISMISS: () => ({}),
  STORE_RESPONSE: (response: unknown) => ({response}),
};
export const backupAndRestoreSetupModel = createModel(
  {
    isLoading: false as boolean,
    profileInfo: undefined as ProfileInfo | undefined,
    errorMessage: '' as string,
    serviceRefs: {} as AppServices,
    shouldTriggerAutoBackup: false as boolean,
    isCloudSignedIn: false as boolean,
  },
  {
    events: backupAndRestoreSetupEvent,
  },
);
