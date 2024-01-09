import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  BackupEvents,
  selectIsBackingUp,
  selectIsBackupPref,
  selectIsBackupViaPassword,
  selectIsBackupViaPhoneNumber,
  selectIsCancellingDownload,
  selectIsRequestOtp,
} from '../../machines/backup';
import {GlobalContext} from '../../shared/GlobalContext';

export function useBackupScreen() {
  const {appService} = useContext(GlobalContext);
  const backupService = appService.children.get('backup');

  return {
    isBackupPref: useSelector(backupService, selectIsBackupPref),
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
    SET_PASSWORD: (password: string) => {
      backupService.send(BackupEvents.SET_PASSWORD(password));
    },
    PHONE_NUMBER: () => {
      backupService.send(BackupEvents.PHONE_NUMBER());
    },
    SET_PHONE_NUMBER: (phoneNumber: string) => {
      backupService.send(BackupEvents.SET_PHONE_NUMBER(phoneNumber));
    },
    SEND_OTP: () => {
      backupService.send(BackupEvents.SEND_OTP());
    },
    INPUT_OTP: (otp: string) => backupService.send(BackupEvents.INPUT_OTP(otp)),
  };
}
