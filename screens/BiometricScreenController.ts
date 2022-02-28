import { useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { AuthEvents, selectAuthorized, selectBiometrics } from '../machines/auth';
import { RouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';

export function useBiometricScreen(props: RouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const isAuthorized = useSelector(authService, selectAuthorized);

  const [biometric, setBiometric] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthorized) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [isAuthorized]);

  return {
    biometric,
    setBiometric,
    error,
    setError,

    storedBiometric: useSelector(authService, selectBiometrics),

    LOGIN: () => {
      authService.send(AuthEvents.LOGIN());
    },

    SETUP_BIOMETRIC: () => {
      authService.send(AuthEvents.SETUP_BIOMETRIC(biometric));
    },
  };
}
