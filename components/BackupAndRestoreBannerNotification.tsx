import React from 'react';
import {useBackupScreen} from '../screens/backupAndRestore/BackupController';
import {BannerNotification} from './BannerNotification';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {useBackupRestoreScreen} from '../screens/Settings/BackupRestoreController';

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
        message={translation}
        onClosePress={backUpController.DISMISS}
        key={`backupFailure-${backUpController.backupErrorReason}`}
        testId={`backupFailure-${backUpController.backupErrorReason}`}
        customStyle={Theme.Styles.dataBackupFailure}
      />
    );
  }

  function restoreFailure() {
    const translation = t(
      `restoreFailure.${restoreController.restoreErrorReason}`,
    );

    return (
      <BannerNotification
        key={`restoreFailure-${restoreController.restoreErrorReason}`}
        message={translation}
        onClosePress={restoreController.DISMISS}
        testId={`restoreFailure-${restoreController.restoreErrorReason}`}
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
          key={'dataBackupSuccess'}
          testId={'dataBackupSuccess'}
          customStyle={Theme.Styles.dataBackupSuccess}
        />
      )}

      {backUpController.isBackingUpFailure && backupFailure()}

      {restoreController.isBackUpRestoreSuccess && (
        <BannerNotification
          message={t('restoreSuccessful')}
          onClosePress={restoreController.DISMISS}
          key={'restoreBackupSuccess'}
          testId={'restoreBackupSuccess'}
          customStyle={Theme.Styles.dataBackupSuccess}
        />
      )}
      {restoreController.isBackUpRestoreFailure && restoreFailure()}
    </>
  );
};
