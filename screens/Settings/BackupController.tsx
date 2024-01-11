import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  BackupEvents,
  selectIsBackingUp,
  selectIsBackupPref,
  selectIsBackupViaPassword,
  selectIsBackupViaPhoneNumber,
  selectIsCancellingDownload,
  selectIsEnableBackup,
  selectIsRequestOtp,
} from '../../machines/backup';
import {GlobalContext} from '../../shared/GlobalContext';

export function useBackupScreen() {
  const {appService} = useContext(GlobalContext);
  const backupService = appService.children.get('backup');

  return {
    isBackupPref: useSelector(backupService, selectIsBackupPref),
    isBackupEnabled: useSelector(backupService, selectIsEnableBackup),
    isBackupViaPassword: useSelector(backupService, selectIsBackupViaPassword),
    isBackupViaPhoneNumber: useSelector(
      backupService,
      selectIsBackupViaPhoneNumber,
    ),
    isRequestOtp: useSelector(backupService, selectIsRequestOtp),
    isDownloadCancelled: useSelector(backupService, selectIsCancellingDownload),
    isBackingUp: useSelector(backupService, selectIsBackingUp),
    DATA_BACKUP: () => {
      backupService.send(BackupEvents.DATA_BACKUP());
    },
    YES: () => {
      backupService.send(BackupEvents.YES());
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
