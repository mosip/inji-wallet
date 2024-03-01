import React from 'react';
import {useBackupScreen} from '../screens/backupAndRestore/BackupController';
import {BannerNotification} from './BannerNotification';
import {useTranslation} from 'react-i18next';
import {useBackupRestoreScreen} from '../screens/Settings/BackupRestoreController';
import {
  BANNER_TYPE_SUCCESS,
  BANNER_TYPE_ERROR,
  BANNER_TYPE_INFO,
} from '../shared/constants';

export const BackupAndRestoreBannerNotification: React.FC = () => {
  const backUpController = useBackupScreen();
  const restoreController = useBackupRestoreScreen();

  const {t} = useTranslation('BackupAndRestoreBanner');

  function backupFailure() {
    const translation = t(
      `backupFailure.${backUpController.backupErrorReason}`,
    );

    return (
      <BannerNotification
        type={BANNER_TYPE_ERROR}
        message={translation}
        onClosePress={backUpController.DISMISS}
        key={`backupFailure-${backUpController.backupErrorReason}Popup`}
        testId={`backupFailure-${backUpController.backupErrorReason}Popup`}
      />
    );
  }

  function restoreFailure() {
    const translation = t(
      `restoreFailure.${restoreController.restoreErrorReason}`,
    );

    return (
      <BannerNotification
        type={BANNER_TYPE_ERROR}
        key={`restoreFailure-${restoreController.restoreErrorReason}Popup`}
        message={translation}
        onClosePress={restoreController.DISMISS}
        testId={`restoreFailure-${restoreController.restoreErrorReason}Popup`}
      />
    );
  }

  return (
    <>
      {backUpController.showBackupInProgress && (
        <BannerNotification
          type={BANNER_TYPE_INFO}
          message={t('backupInProgress')}
          onClosePress={backUpController.DISMISS_SHOW_BACKUP_IN_PROGRESS}
          key={'dataBackupInProgress'}
          testId={'dataBackupInProgress'}
        />
      )}

      {backUpController.isBackingUpSuccess && (
        <BannerNotification
          type={BANNER_TYPE_SUCCESS}
          message={t('backupSuccessful')}
          onClosePress={backUpController.DISMISS}
          key={'dataBackupSuccessPopup'}
          testId={'dataBackupSuccessPopup'}
        />
      )}

      {backUpController.isBackingUpFailure && backupFailure()}

      {restoreController.showRestoreInProgress && (
        <BannerNotification
          type={BANNER_TYPE_INFO}
          message={t('restoreInProgress')}
          onClosePress={restoreController.DISMISS_SHOW_RESTORE_IN_PROGRESS}
          key={'restoreInProgress'}
          testId={'restoreInProgress'}
        />
      )}

      {restoreController.isBackUpRestoreSuccess && (
        <BannerNotification
          type={BANNER_TYPE_SUCCESS}
          message={t('restoreSuccessful')}
          onClosePress={restoreController.DISMISS}
          key={'restoreBackupSuccessPopup'}
          testId={'restoreBackupSuccessPopup'}
        />
      )}
      {restoreController.isBackUpRestoreFailure && restoreFailure()}
    </>
  );
};
