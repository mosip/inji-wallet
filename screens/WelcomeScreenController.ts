import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  AuthEvents,
  selectBiometrics,
  selectLanguagesetup,
  selectPasscode,
  selectSettingUp,
} from '../machines/auth';
import {
  SettingsEvents,
  selectBiometricUnlockEnabled,
} from '../machines/settings';
import {RootRouteProps} from '../routes';
import {GlobalContext} from '../shared/GlobalContext';
import {
  getData,
  getImpressionData,
  getInteractData,
  sendImpressionEvent,
  sendInteractEvent,
  sendStartEvent,
} from '../shared/telemetry/TelemetryUtils';

export function useWelcomeScreen(props: RootRouteProps) {
  const {appService} = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const settingsService = appService.children.get('settings');

  const isSettingUp = useSelector(authService, selectSettingUp);
  const passcode = useSelector(authService, selectPasscode);

  const isPasscodeSet = () => {
    if (passcode) {
      return false;
    } else {
      return true;
    }
  };

  const biometrics = useSelector(authService, selectBiometrics);
  const isLanguagesetup = useSelector(authService, selectLanguagesetup);
  const isBiometricUnlockEnabled = useSelector(
    settingsService,
    selectBiometricUnlockEnabled,
  );

  return {
    isSettingUp,
    isLanguagesetup,
    isPasscodeSet,
    NEXT: () => {
      authService.send(AuthEvents.NEXT()), props.navigation.navigate('Auth');
    },
    SELECT: () => {
      authService.send(AuthEvents.SELECT()),
        props.navigation.navigate('IntroSliders');
    },
    BACK: () => {
      settingsService.send(SettingsEvents.BACK()),
        props.navigation.navigate('Main');
    },
    unlockPage: () => {
      // prioritize biometrics
      if (!isSettingUp && isBiometricUnlockEnabled && biometrics !== '') {
        props.navigation.navigate('Biometric', {setup: isSettingUp});
      } else if (!isSettingUp && passcode !== '') {
        sendStartEvent(getData('App Login'));
        sendInteractEvent(
          getInteractData('TOUCH', 'Unlock application button'),
        );
        sendImpressionEvent(getImpressionData('Passcode'));
        props.navigation.navigate('Passcode', {setup: isSettingUp});
      } else {
        props.navigation.navigate('Auth');
      }
    },
  };
}
