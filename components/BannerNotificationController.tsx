import {useSelector} from '@xstate/react';
import {
  selectIsPasscodeUnlock,
  selectIsBiometricUnlock,
  SettingsEvents,
} from '../machines/settings';
import {useContext} from 'react';
import {GlobalContext} from '../shared/GlobalContext';

export const UseBannerNotification = () => {
  const {appService} = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    isPasscodeUnlock: useSelector(settingsService, selectIsPasscodeUnlock),

    isBiometricUnlock: useSelector(settingsService, selectIsBiometricUnlock),

    DISMISS: () => {
      settingsService.send(SettingsEvents.DISMISS());
    },
  };
};
