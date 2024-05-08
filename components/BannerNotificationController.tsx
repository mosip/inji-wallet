import {useSelector} from '@xstate/react';
import {
  selectIsPasscodeUnlock,
  selectIsBiometricUnlock,
  SettingsEvents,
} from '../machines/settings';
import {useContext} from 'react';
import {GlobalContext} from '../shared/GlobalContext';
import {VcMetaEvents} from '../machines/VerifiableCredential/VCMetaMachine/VCMetaMachine';
import {selectIsDownloadingFailed} from '../machines/VerifiableCredential/VCMetaMachine/VCMetaSelectors';
import {
  selectVerificationStatus,
  selectWalletBindingSuccess,
} from '../machines/VerifiableCredential/VCItemMachine/VCItemSelectors';

export const UseBannerNotification = () => {
  const {appService} = useContext(GlobalContext);
  const settingsService = appService.children.get('settings')!!;
  const vcMetaService = appService.children.get('vcMeta')!!;

  return {
    isBindingSuccess: useSelector(vcMetaService, selectWalletBindingSuccess),
    verificationStatus: useSelector(vcMetaService, selectVerificationStatus),
    isPasscodeUnlock: useSelector(settingsService, selectIsPasscodeUnlock),

    isBiometricUnlock: useSelector(settingsService, selectIsBiometricUnlock),
    isDownloadingFailed: useSelector(vcMetaService, selectIsDownloadingFailed),
    DISMISS: () => {
      settingsService.send(SettingsEvents.DISMISS());
    },
    RESET_WALLET_BINDING_SUCCESS: () =>
      vcMetaService.send(VcMetaEvents.RESET_WALLET_BINDING_SUCCESS()),
    RESET_VERIFICATION_STATUS: () =>
      vcMetaService.send(VcMetaEvents.RESET_VERIFICATION_STATUS(null)),
    RESET_DOWNLOADING_FAILED: () => {
      vcMetaService.send(VcMetaEvents.RESET_DOWNLOADING_FAILED());
    },
  };
};
