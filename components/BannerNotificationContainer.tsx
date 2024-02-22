import React from 'react';
import {View} from 'react-native';
import {BannerNotification} from './BannerNotification';
import {UseWalletBindingSuccess} from './WalletBindingSuccessController';
import {BackupAndRestoreBannerNotification} from './BackupAndRestoreBannerNotification';
import {t} from 'i18next';
import {UseBannerNotification} from './BannerNotificationController';

export const BannerNotificationContainer: React.FC = () => {
  const WalletBindingController = UseWalletBindingSuccess();
  const WalletBindingSuccess = WalletBindingController.isBindingSuccess;
  const bannerNotificationController = UseBannerNotification();

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

      {bannerNotificationController.isPasscodeUnlock && (
        <BannerNotification
          type="success"
          message="Success! You can now use passcode to unlock Inji app."
          onClosePress={bannerNotificationController.DISMISS}
          testId={'dataBackupSuccessPopup'}
          key={'updatePassword'}
        />
      )}

      {bannerNotificationController.isBiometricUnlock && (
        <BannerNotification
          type="success"
          message="Success! You can now use biometrics to unlock Inji app."
          onClosePress={bannerNotificationController.DISMISS}
          testId={'dataBackupSuccessPopup'}
          key={'updateBio'}
        />
      )}
    </>
  );
};
