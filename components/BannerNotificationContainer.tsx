import React from 'react';
import {View} from 'react-native';
import {BannerNotification} from './BannerNotification';
import {UseWalletBindingSuccess} from './WalletBindingSuccessController';
import {BackupAndRestoreBannerNotification} from './BackupAndRestoreBannerNotification';
import {t} from 'i18next';
import {BANNER_TYPE_SUCCESS} from '../shared/constants';

export const BannerNotificationContainer: React.FC = () => {
  const WalletBindingController = UseWalletBindingSuccess();
  const WalletBindingSuccess = WalletBindingController.isBindingSuccess;

  return (
    <>
      <BackupAndRestoreBannerNotification />

      {WalletBindingSuccess && (
        <View style={{marginTop: 10, marginBottom: 10}}>
          <BannerNotification
            type={BANNER_TYPE_SUCCESS}
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
