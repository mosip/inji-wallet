import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  BackupEvents,
  selectIsBackingUpSuccess,
  selectIsBackingUpFailure,
  selectIsBackupInprogress,
  selectBackupErrorReason,
  lastBackupDetails,
  selectIsLoading,
  selectShowBackupInProgress,
} from '../../machines/backupAndRestore/backup';
import {GlobalContext} from '../../shared/GlobalContext';

export function useBackupScreen() {
  const {appService} = useContext(GlobalContext);
  const backupService = appService.children.get('backup');

  return {
    lastBackupDetails: useSelector(backupService, lastBackupDetails),
    isLoading: useSelector(backupService, selectIsLoading),
    backupErrorReason: useSelector(backupService, selectBackupErrorReason),
    isBackingUpSuccess: useSelector(backupService, selectIsBackingUpSuccess),
    isBackingUpFailure: useSelector(backupService, selectIsBackingUpFailure),
    isBackupInProgress: useSelector(backupService, selectIsBackupInprogress),
    showBackupInProgress: useSelector(
      backupService!,
      selectShowBackupInProgress,
    ),
    DATA_BACKUP: (isAutoBackup: boolean) => {
      backupService.send(BackupEvents.DATA_BACKUP(isAutoBackup));
    },

    LAST_BACKUP_DETAILS: () => {
      backupService?.send(BackupEvents.LAST_BACKUP_DETAILS());
    },
    DISMISS: () => {
      backupService.send(BackupEvents.DISMISS());
    },
    DISMISS_SHOW_BACKUP_IN_PROGRESS: () => {
      backupService?.send(BackupEvents.DISMISS_SHOW_BACKUP_IN_PROGRESS());
    },
  };
}
