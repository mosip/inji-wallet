import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { AuthEvents, selectAuthorized } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';
import { biometricsMachine } from '../machines/biometrics';

export function useBiometricScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const [biometricState, biometricSend] = useMachine(biometricsMachine);

  const isAuthorized = useSelector(authService, selectAuthorized);

  useEffect(() => {
    if (isAuthorized) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      return;
    }

    console.log("[BIOMETRICS] value", biometricState.value);
    console.log("[BIOMETRICS] context", biometricState.context);

    // if biometic state is success then lets send auth service BIOMETRICS
    if (biometricState.matches('success')) {
      authService.send(AuthEvents.LOGIN());
      return;
    }

  }, [isAuthorized, biometricState]);

  const useBiometrics = () => {
    biometricSend({ type: 'AUTHENTICATE' });
  };

  return {
    useBiometrics
  };
}
