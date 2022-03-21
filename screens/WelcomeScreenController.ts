import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectBiometrics, selectPasscode, selectSettingUp } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';

export function useWelcomeScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const isSettingUp = useSelector(authService, selectSettingUp);
  const passcode = useSelector(authService, selectPasscode);
  const biometrics = useSelector(authService, selectBiometrics);

  return {
    isSettingUp,

    unlockPage: () => {
      if (!isSettingUp && passcode !== '') {
        props.navigation.navigate('Passcode', { setup: isSettingUp });
      } else if (!isSettingUp && biometrics) {
        props.navigation.navigate('Biometric', { setup: isSettingUp });
      } else {
        props.navigation.navigate('Auth');
      }
    },
  };
}
