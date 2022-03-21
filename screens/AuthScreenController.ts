import { useInterpret, useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { AuthEvents, selectSettingUp, selectAuthorized } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';
import { biometricsMachine, selectIsEnabled } from '../machines/biometrics';

export function useAuthScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const [hasAlertMsg, setHasAlertMsg] = useState(null);

  const isSettingUp = useSelector(authService, selectSettingUp);
  const isAuthorized = useSelector(authService, selectAuthorized);

  const biometricService = useInterpret(biometricsMachine);
  const [biometricState, biometricSend] = useMachine(biometricsMachine);

  const enableBiometric:boolean = useSelector(biometricService, selectIsEnabled);

  useEffect(() => {

    if (isAuthorized) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      return
    }

    console.log("[BIOMETRICS] value", biometricState.value);
    console.log("[BIOMETRICS] context", biometricState.context);

    // if biometic state is success then lets send auth service BIOMETRICS
    if (biometricState.matches('success')) {
      authService.send(AuthEvents.SETUP_BIOMETRICS());
      return;
    }

    // handle biometric failure
    if (biometricState.matches('failure')) {

      // we dont need to see this page to user once biometric is unavailable on its device
      if (biometricState.matches({ failure: 'unavailable' })) {
        props.navigation.navigate('Passcode', { setup: isSettingUp });
        return;
      }

      // show alert message whenever biometric state gets failure
      setHasAlertMsg(Object.values(biometricState.meta).join(', '));
    }

  }, [isAuthorized, biometricState]);


  const useBiometrics = () => {
    biometricSend({ type: 'AUTHENTICATE' });
  };

  const hideAlert = () => {
    setHasAlertMsg(null);
  }

  return {
    isSettingUp,
    hasAlertMsg,
    enableBiometric,
    hideAlert,
    useBiometrics,
    usePasscode: () => {
      props.navigation.navigate('Passcode', { setup: isSettingUp });
    }
  };
}
