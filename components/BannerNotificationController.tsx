import {useSelector} from '@xstate/react';
import {
  selectIsPasswordUnlock,
  selectIsBiometricUnlock,
  SettingsEvents,
} from '../machines/settings';
import {useContext} from 'react';
import {GlobalContext} from '../shared/GlobalContext';

export const UseBannerNotification = () => {
  const {appService} = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    isPasscodeUnlock: useSelector(settingsService, selectIsPasswordUnlock),

    isBiometricUnlock: useSelector(settingsService, selectIsBiometricUnlock),

    DISMISS: () => {
      settingsService.send(SettingsEvents.DISMISS());
    },
  };
};
