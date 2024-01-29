import React from 'react';
import {useBackupScreen} from '../screens/backupAndRestore/BackupController';
import {BannerNotification} from './BannerNotification';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';

export const BackupAndRestoreAllScreenBanner: React.FC = () => {
  const backUpController = useBackupScreen();
  const {t} = useTranslation('BackupAndRestoreBanner');

  function backupFailure() {
    const translationPath = t(
      `backupFailure.${backUpController.backupErrorReason}`,
    );

    return (
      <BannerNotification
        message={translationPath}
        onClosePress={backUpController.DISMISS}
        testId={'dataBackupFailure'}
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
    </>
  );
};
