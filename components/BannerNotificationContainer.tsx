import React from 'react';
import {View} from 'react-native';
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
        <View style={{marginTop: 10, marginBottom: 10}}>
          <BannerNotification
            type="success"
            message={t('MyVcsTab:activated')}
            onClosePress={WalletBindingController.DISMISS}
            key={'activatedVcPopup'}
            testId={'activatedVcPopup'}
          />
        </View>
      )}
    </>
  );
};
