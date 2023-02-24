import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  selectBiometrics,
  selectLanguagesetup,
  selectPasscode,
  selectSettingUp,
} from '../machines/auth';
import { selectBiometricUnlockEnabled } from '../machines/settings';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';

export function useWelcomeScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const settingsService = appService.children.get('settings');

  const isSettingUp = useSelector(authService, selectSettingUp);
  const passcode = useSelector(authService, selectPasscode);
  const biometrics = useSelector(authService, selectBiometrics);
  const isBiometricUnlockEnabled = useSelector(
    settingsService,
    selectBiometricUnlockEnabled
  );
  const isLanguagesetup = useSelector(authService, selectLanguagesetup);

  return {
    isSettingUp,
    isLanguagesetup,
    NEXT: () => {
      authService.send(AuthEvents.NEXT()), props.navigation.navigate('Auth');
    },
    SELECT: () => {
      authService.send(AuthEvents.SELECT()),
        props.navigation.navigate('IntroSliders');
    },
    SPLASSH_SCREEN_DONE: () => {
      authService.send(AuthEvents.SPLASSH_SCREEN_DONE),
        props.navigation.navigate('Welcome');
    },
    unlockPage: () => {
      // prioritize biometrics
      if (!isSettingUp && isBiometricUnlockEnabled && biometrics !== '') {
        props.navigation.navigate('Biometric', { setup: isSettingUp });
      } else if (!isSettingUp && passcode !== '') {
        props.navigation.navigate('Passcode', { setup: isSettingUp });
      } else {
        props.navigation.navigate('Auth');
      }
    },
  };
}
