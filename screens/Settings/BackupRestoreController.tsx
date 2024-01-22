import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  BackupRestoreEvents,
  selectIsBackUpRestoring,
} from '../../machines/backupRestore';
import {GlobalContext} from '../../shared/GlobalContext';

export function useBackupRestoreScreen() {
  const {appService} = useContext(GlobalContext);
  const backupRestoreService = appService.children.get('backupRestore');

  return {
    isBackUpRestoring: useSelector(
      backupRestoreService,
      selectIsBackUpRestoring,
    ),
    BACKUP_RESTORE: () => {
      backupRestoreService.send(BackupRestoreEvents.BACKUP_RESTORE());
    },
  };
}
