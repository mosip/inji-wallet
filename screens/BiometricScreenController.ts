import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { AuthEvents, selectAuthorized } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';
import { biometricsMachine, selectIsAvailable, selectIsSuccess, selectIsUnenrolled, selectIsUnvailable } from '../machines/biometrics';

export function useBiometricScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const [initAuthBio, updateInitAuthBio] = useState(true);
  const [bioState, bioSend, bioService] = useMachine(biometricsMachine);

  const isAuthorized:boolean  = useSelector(authService, selectAuthorized);
  const isAvailable:boolean   = useSelector(bioService, selectIsAvailable);
  const isUnavailable:boolean = useSelector(bioService, selectIsUnvailable);
  const isSuccessBio:boolean  = useSelector(bioService, selectIsSuccess);
  const isUnenrolled:boolean  = useSelector(bioService, selectIsUnenrolled);

  useEffect(() => {
    if (isAuthorized) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      return;
    }

    if (initAuthBio && isAvailable) {
      bioSend({ type: 'AUTHENTICATE' });

      // so we only init authentication of biometrics just once
      updateInitAuthBio(false);
    }

    // if biometic state is success then lets send auth service BIOMETRICS
    if (isSuccessBio) {
      authService.send(AuthEvents.LOGIN());
      return;
    }

    if (isUnavailable || isUnenrolled) {

      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Passcode'}],
      });
      return;
    }

  }, [
    isAuthorized,
    isSuccessBio,
    isAvailable,
    isUnenrolled,
    isUnavailable
  ]);

  const useBiometrics = () => {
    bioSend({ type: 'AUTHENTICATE' });
  };

  return {
    isSuccessBio,
    useBiometrics
  };
}
