import React from 'react';
import {View} from 'react-native';
import {BannerNotification} from './BannerNotification';
import {UseWalletBindingSuccess} from './WalletBindingSuccessController';
import {BackupAndRestoreBannerNotification} from './BackupAndRestoreBannerNotification';
import {UseBannerNotification} from './BannerNotificationController';
import {useTranslation} from 'react-i18next';
import {BANNER_TYPE_SUCCESS} from '../shared/constants';

export const BannerNotificationContainer: React.FC = () => {
  const WalletBindingController = UseWalletBindingSuccess();
  const WalletBindingSuccess = WalletBindingController.isBindingSuccess;
  const bannerNotificationController = UseBannerNotification();
  const {t} = useTranslation('BannerNotification');

  return (
    <>
      <BackupAndRestoreBannerNotification />

      {WalletBindingSuccess && (
        <View style={{marginTop: 10, marginBottom: 10}}>
          <BannerNotification
            type={BANNER_TYPE_SUCCESS}
            message={t('activated')}
            onClosePress={WalletBindingController.DISMISS}
            key={'activatedVcPopup'}
            testId={'activatedVcPopup'}
          />
        </View>
      )}

      {bannerNotificationController.isPasscodeUnlock && (
        <BannerNotification
          type="success"
          message={t('alternatePasscodeSuccess')}
          onClosePress={bannerNotificationController.DISMISS}
          testId={'alternatePasscodeSuccess'}
          key={'updatePassword'}
        />
      )}

      {bannerNotificationController.isBiometricUnlock && (
        <BannerNotification
          type="success"
          message={t('alternateBiometricSuccess')}
          onClosePress={bannerNotificationController.DISMISS}
          testId={'alternateBiometricSuccess'}
          key={'updateBiometric'}
        />
      )}
    </>
  );
};
