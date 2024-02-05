import React from 'react';
import {BannerNotification} from './BannerNotification';
import {UseWalletBindingSuccess} from './WalletBindingSuccessController';
import {BackupAndRestoreBannerNotification} from './BackupAndRestoreBannerNotification';
import {t} from 'i18next';

export const BannerNotificationContainer: React.FC = () => {
  const WalletBindingController = UseWalletBindingSuccess();
  const WalletBindingSuccess = WalletBindingController.isBindingSuccess;

  return (
    <>
      <BackupAndRestoreBannerNotification />

      {WalletBindingSuccess && (
        <BannerNotification
          message={t('MyVcsTab:activated')}
          onClosePress={WalletBindingController.DISMISS}
          key={'activatedVcPopup'}
          testId={'activatedVcPopup'}
        />
      )}
    </>
  );
};
