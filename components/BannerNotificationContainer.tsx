import React from 'react';
import {View} from 'react-native';
import {
  BannerNotification,
  BannerStatus,
  BannerStatusType,
} from './BannerNotification';
import {UseBannerNotificationContainer} from './WalletBindingSuccessController';
import {BackupAndRestoreBannerNotification} from './BackupAndRestoreBannerNotification';
import {UseBannerNotification} from './BannerNotificationController';
import {useTranslation} from 'react-i18next';
import {useScanScreen} from '../screens/Scan/ScanScreenController';
import {Theme} from './ui/styleUtils';

export const BannerNotificationContainer: React.FC<
  BannerNotificationContainerProps
> = ({showBannerNotificationContainer = true}) => {
  const controller = UseBannerNotificationContainer();
  const WalletBindingSuccess = controller.isBindingSuccess;
  const scanScreenController = useScanScreen();
  const showQuickShareSuccessBanner =
    scanScreenController.showQuickShareSuccessBanner;

  const bannerNotificationController = UseBannerNotification();
  const {t} = useTranslation('BannerNotification');
  const rt = useTranslation('RequestScreen').t;
  const verificationStatus = controller.verificationStatus;

  return (
    <>
      <BackupAndRestoreBannerNotification />

      {WalletBindingSuccess && (
        <View style={Theme.BannerStyles.topBanner}>
          <BannerNotification
            type={BannerStatusType.SUCCESS}
            message={t('activated')}
            onClosePress={controller.DISMISS}
            key={'activatedVcPopup'}
            testId={'activatedVcPopup'}
          />
        </View>
      )}

      {showQuickShareSuccessBanner && (
        <View style={Theme.BannerStyles.topBanner}>
          <BannerNotification
            type={BannerStatusType.SUCCESS}
            message={rt('status.accepted.message')}
            onClosePress={scanScreenController.DISMISS_QUICK_SHARE_BANNER}
            key={'quickShareSuccessBanner'}
            testId={'quickShareSuccessBanner'}
          />
        </View>
      )}

      {bannerNotificationController.isPasscodeUnlock && (
        <BannerNotification
          type={BannerStatusType.SUCCESS}
          message={t('alternatePasscodeSuccess')}
          onClosePress={bannerNotificationController.DISMISS}
          testId={'alternatePasscodeSuccess'}
          key={'updatePassword'}
        />
      )}

      {bannerNotificationController.isBiometricUnlock && (
        <BannerNotification
          type={BannerStatusType.SUCCESS}
          message={t('alternateBiometricSuccess')}
          onClosePress={bannerNotificationController.DISMISS}
          testId={'alternateBiometricSuccess'}
          key={'updateBiometric'}
        />
      )}

      {verificationStatus != null && showBannerNotificationContainer && (
        <BannerNotification
          type={verificationStatus.statusType}
          message={t(`VcVerificationBanner:${verificationStatus?.statusType}`, {
            vcDetails: `${verificationStatus.vcType} ${verificationStatus.vcNumber}`,
          })}
          onClosePress={() => controller.RESET_VERIFICATION_STATUS()}
          key={'reVerificationInProgress'}
          testId={'reVerificationInProgress'}
        />
      )}
    </>
  );
};

export type vcVerificationBannerDetails = {
  statusType: BannerStatus;
  vcType: string;
  vcNumber: string;
};

export interface BannerNotificationContainerProps {
  showBannerNotificationContainer?: boolean;
}
