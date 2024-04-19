import React from 'react';
import {View} from 'react-native';
import {BannerNotification} from './BannerNotification';
import {UseWalletBindingSuccess} from './WalletBindingSuccessController';
import {BackupAndRestoreBannerNotification} from './BackupAndRestoreBannerNotification';
import {UseBannerNotification} from './BannerNotificationController';
import {useTranslation} from 'react-i18next';
import {BANNER_TYPE_SUCCESS} from '../shared/constants';
import {useScanScreen} from '../screens/Scan/ScanScreenController';
import {Theme} from './ui/styleUtils';

export const BannerNotificationContainer: React.FC = () => {
  const WalletBindingController = UseWalletBindingSuccess();
  const WalletBindingSuccess = WalletBindingController.isBindingSuccess;
  const scanScreenController = useScanScreen();
  const showQuickShareSuccessBanner =
    scanScreenController.showQuickShareSuccessBanner;

  const bannerNotificationController = UseBannerNotification();
  const {t} = useTranslation('BannerNotification');
  const rt = useTranslation('RequestScreen').t;

  return (
    <>
      <BackupAndRestoreBannerNotification />

      {WalletBindingSuccess && (
        <View style={Theme.BannerStyles.topBanner}>
          <BannerNotification
            type={BANNER_TYPE_SUCCESS}
            message={t('activated')}
            onClosePress={WalletBindingController.DISMISS}
            key={'activatedVcPopup'}
            testId={'activatedVcPopup'}
          />
        </View>
      )}

      {showQuickShareSuccessBanner && (
        <View style={Theme.BannerStyles.topBanner}>
          <BannerNotification
            type={BANNER_TYPE_SUCCESS}
            message={rt('status.accepted.message')}
            onClosePress={scanScreenController.DISMISS_QUICK_SHARE_BANNER}
            key={'quickShareSuccessBanner'}
            testId={'quickShareSuccessBanner'}
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
