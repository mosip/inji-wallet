import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {RestoreEvents} from '../../machines/backupAndRestore/restore/restoreMachine';

import {
  selectIsBackUpRestoring,
  selectIsBackUpRestoreFailure,
  selectIsBackUpRestoreSuccess,
  selectErrorReason,
  selectShowRestoreInProgress,
} from '../../machines/backupAndRestore/restore/restoreSelector';
import {GlobalContext} from '../../shared/GlobalContext';

export function useBackupRestoreScreen() {
  const {appService} = useContext(GlobalContext);
  const backupRestoreService = appService.children.get('restore')!!;

  return {
    isBackUpRestoring: useSelector(
      backupRestoreService,
      selectIsBackUpRestoring,
    ),
    restoreErrorReason: useSelector(backupRestoreService, selectErrorReason),
    isBackUpRestoreSuccess: useSelector(
      backupRestoreService,
      selectIsBackUpRestoreSuccess,
    ),
    isBackUpRestoreFailure: useSelector(
      backupRestoreService,
      selectIsBackUpRestoreFailure,
    ),
    DOWNLOAD_UNSYNCED_BACKUP_FILES: () =>
      backupRestoreService.send(RestoreEvents.DOWNLOAD_UNSYNCED_BACKUP_FILES()),
    showRestoreInProgress: useSelector(
      backupRestoreService!,
      selectShowRestoreInProgress,
    ),
    BACKUP_RESTORE: () => {
      backupRestoreService.send(RestoreEvents.BACKUP_RESTORE());
    },
    DISMISS: () => {
      backupRestoreService.send(RestoreEvents.DISMISS());
    },
    DISMISS_SHOW_RESTORE_IN_PROGRESS: () => {
      backupRestoreService.send(
        RestoreEvents.DISMISS_SHOW_RESTORE_IN_PROGRESS(),
      );
    },
  };
}
