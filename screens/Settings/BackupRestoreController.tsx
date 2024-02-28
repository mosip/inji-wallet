import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  BackupRestoreEvents,
  selectIsBackUpRestoring,
  selectIsBackUpRestoreFailure,
  selectIsBackUpRestoreSuccess,
  selectErrorReason,
  selectShowRestoreInProgress,
} from '../../machines/backupAndRestore/backupRestore';
import {GlobalContext} from '../../shared/GlobalContext';

export function useBackupRestoreScreen() {
  const {appService} = useContext(GlobalContext);
  const backupRestoreService = appService.children.get('backupRestore');

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
      backupRestoreService?.send(
        BackupRestoreEvents.DOWNLOAD_UNSYNCED_BACKUP_FILES(),
      ),
    showRestoreInProgress: useSelector(
      backupRestoreService!,
      selectShowRestoreInProgress,
    ),
    BACKUP_RESTORE: () => {
      backupRestoreService.send(BackupRestoreEvents.BACKUP_RESTORE());
    },
    DISMISS: () => {
      backupRestoreService.send(BackupRestoreEvents.DISMISS());
    },
    DISMISS_SHOW_RESTORE_IN_PROGRESS: () => {
      backupRestoreService?.send(
        BackupRestoreEvents.DISMISS_SHOW_RESTORE_IN_PROGRESS(),
      );
    },
  };
}
