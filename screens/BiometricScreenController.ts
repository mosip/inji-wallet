import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { AuthEvents, selectAuthorized } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';
import { biometricsMachine } from '../machines/biometrics';

export function useBiometricScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const [initAuthBio, updateInitAuthBio] = useState(true);
  const [bioState, bioSend] = useMachine(biometricsMachine);

  const isAuthorized = useSelector(authService, selectAuthorized);

  useEffect(() => {
    if (isAuthorized) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      return;
    }

    if (initAuthBio && bioState.matches('available')) {
      bioSend({ type: 'AUTHENTICATE' });

      // so we only init authentication of biometrics just once
      updateInitAuthBio(false);
    }

    // if biometic state is success then lets send auth service BIOMETRICS
    if (bioState.matches('success')) {
      authService.send(AuthEvents.LOGIN());
      return;
    }

    if (
      bioState.matches({ failure: 'unavailable' }) ||
      bioState.matches({ failure: 'unenrolled' })
    ) {
      authService.send(AuthEvents.RESET_BIOMETRICS());

      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
      return;
    }

  }, [isAuthorized, bioState]);

  const useBiometrics = () => {
    bioSend({ type: 'AUTHENTICATE' });
  };

  return {
    useBiometrics
  };
}
