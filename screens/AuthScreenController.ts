import { useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { selectSettingUp } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';

export function useAuthScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const [hasBiometric, setHasBiometric] = useState(null);

  const isSettingUp = useSelector(authService, selectSettingUp);

  useEffect(() => {
    (async () => {
      const response = await LocalAuthentication.hasHardwareAsync();
      console.log('-------> biometrics response', response);
      setHasBiometric(response);
      const available = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('-------> biometrics available', available);
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('-------> biometrics enrolled', enrolled);

    })();
  }, [])

  return {
    isSettingUp,

    hasBiometric,
    useBiometrics: () => {
      props.navigation.navigate('Biometric', { setup: isSettingUp });
    },
    usePasscode: () => {
      props.navigation.navigate('Passcode', { setup: isSettingUp });
    },
  };
}
