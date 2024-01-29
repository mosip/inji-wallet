import React from 'react';
import {useBackupScreen} from '../screens/backupAndRestore/BackupController';
import {BannerNotification} from './BannerNotification';
import {Theme} from './ui/styleUtils';

export const DataBackupAllScreenBanner: React.FC = () => {
  const backUpController = useBackupScreen();
  return (
    <>
      {backUpController.isBackingUpSuccess && (
        <BannerNotification
          isBackup={true}
          message={'Your backup was successful!'}
          onClosePress={backUpController.DISMISS}
          testId={'dataBackupSuccess'}
          customStyle={Theme.Styles.dataBackupSuccess}
        />
      )}

      {backUpController.isBackingUpFailure && (
        <BannerNotification
          isBackup={true}
          message={
            'Due to <Unstable Connection>, we were unable to perform data backup. Please try again later.'
          }
          onClosePress={backUpController.DISMISS}
          testId={'dataBackupFailure'}
          customStyle={Theme.Styles.dataBackupFailure}
        />
      )}
    </>
  );
};
