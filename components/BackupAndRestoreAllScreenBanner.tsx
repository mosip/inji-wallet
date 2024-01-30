import React from 'react';
import {useBackupScreen} from '../screens/backupAndRestore/BackupController';
import {BannerNotification} from './BannerNotification';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {useBackupRestoreScreen} from '../screens/Settings/BackupRestoreController';

export const BackupAndRestoreAllScreenBanner: React.FC = () => {
  const backUpController = useBackupScreen();
  const restoreController = useBackupRestoreScreen();

  const {t} = useTranslation('BackupAndRestoreBanner');

  function backupFailure() {
    const translation = t(
      `backupFailure.${backUpController.backupErrorReason}`,
    );

    return (
      <BannerNotification
        message={translation}
        onClosePress={backUpController.DISMISS}
        testId={`backupFailure-${backUpController.backupErrorReason}`}
        customStyle={Theme.Styles.dataBackupFailure}
      />
    );
  }

  function restoreFailure() {
    const translation = t(
      `restoreFailure.${
        restoreController.restoreErrorReason || 'technicalError'
      }`,
    );

    return (
      <BannerNotification
        message={translation}
        onClosePress={restoreController.DISMISS}
        testId={`restoreFailure-${backUpController.backupErrorReason}`}
        customStyle={Theme.Styles.dataBackupFailure}
      />
    );
  }

  return (
    <>
      {backUpController.isBackingUpSuccess && (
        <BannerNotification
          message={t('backupSuccessful')}
          onClosePress={backUpController.DISMISS}
          testId={'dataBackupSuccess'}
          customStyle={Theme.Styles.dataBackupSuccess}
        />
      )}

      {backUpController.isBackingUpFailure && backupFailure()}

      {restoreController.isBackUpRestoreSuccess && (
        <BannerNotification
          message={t('restoreSuccessful')}
          onClosePress={restoreController.DISMISS}
          testId={'restoreBackupSuccess'}
          customStyle={Theme.Styles.dataBackupSuccess}
        />
      )}
      {restoreController.isBackUpRestoreFailure && restoreFailure()}
    </>
  );
};
