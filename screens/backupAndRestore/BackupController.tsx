import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  BackupEvents,
  selectIsBackingUp,
  selectIsBackingUpSuccess,
  selectIsBackingUpFailure,
  selectIsBackupInprogress,
  selectBackupErrorReason,
  lastBackupDetails,
  selectIsLoading,
  selectIsFetchingLastBackupDetails,
  selectIsCheckingDataAvailabilityForBackup,
} from '../../machines/backupAndRestore/backup';
import {GlobalContext} from '../../shared/GlobalContext';

export function useBackupScreen() {
  const {appService} = useContext(GlobalContext);
  const backupService = appService.children.get('backup');

  return {
    lastBackupDetails: useSelector(backupService, lastBackupDetails),
    isLoading: useSelector(backupService, selectIsLoading),
    backupErrorReason: useSelector(backupService, selectBackupErrorReason),
    isBackingUp: useSelector(backupService, selectIsBackingUp),
    isFetchingLastBackupDetails: useSelector(
      backupService,
      selectIsFetchingLastBackupDetails,
    ),
    isBackingUpSuccess: useSelector(backupService, selectIsBackingUpSuccess),
    isBackingUpFailure: useSelector(backupService, selectIsBackingUpFailure),
    isBackupInProgress: useSelector(backupService, selectIsBackupInprogress),
    DATA_BACKUP: (isAutoBackup: boolean) => {
      backupService.send(BackupEvents.DATA_BACKUP(isAutoBackup));
    },
    isCheckingDataForBackup: useSelector(
      backupService,
      selectIsCheckingDataAvailabilityForBackup,
    ),
    LAST_BACKUP_DETAILS: () => {
      backupService?.send(BackupEvents.LAST_BACKUP_DETAILS());
    },
    OK: () => {
      backupService.send(BackupEvents.OK());
    },
    DISMISS: () => {
      backupService.send(BackupEvents.DISMISS());
    },
    FETCH_DATA: () => {
      backupService.send(BackupEvents.FETCH_DATA());
    },
    PASSWORD: () => {
      backupService.send(BackupEvents.PASSWORD());
    },
    SET_BASE_ENC_KEY: (key: string) => {
      backupService.send(BackupEvents.SET_BASE_ENC_KEY(key));
    },
    PHONE_NUMBER: () => {
      backupService.send(BackupEvents.PHONE_NUMBER());
    },
    SEND_OTP: () => {
      backupService.send(BackupEvents.SEND_OTP());
    },
    INPUT_OTP: (otp: string) => backupService.send(BackupEvents.INPUT_OTP(otp)),
  };
}
