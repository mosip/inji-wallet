import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { AuthEvents, selectSettingUp, selectAuthorized } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';
import {
  biometricsMachine,
  selectError,
  selectIsEnabled,
  selectIsSuccess,
  selectIsUnvailable,
  selectUnenrolledNotice
} from '../machines/biometrics';

export function useAuthScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService    = appService.children.get('auth');

  const isSettingUp    = useSelector(authService, selectSettingUp);
  const isAuthorized   = useSelector(authService, selectAuthorized);

  const [alertMsg, setHasAlertMsg] = useState('');
  const [
    biometricState,
    biometricSend,
    bioService
  ] = useMachine(biometricsMachine);

  const isEnabledBio:boolean       = useSelector(bioService, selectIsEnabled);
  const isUnavailableBio:boolean   = useSelector(bioService, selectIsUnvailable);
  const isSuccessBio:boolean       = useSelector(bioService, selectIsSuccess);
  const errorMsgBio:string         = useSelector(bioService, selectError);
  const unEnrolledNoticeBio:string = useSelector(bioService, selectUnenrolledNotice);

  const usePasscode = () => {
    props.navigation.navigate('Passcode', { setup: isSettingUp });
  }


  useEffect(() => {

    if (isAuthorized) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      return
    }

    // if biometic state is success then lets send auth service BIOMETRICS
    if (isSuccessBio) {
      authService.send(AuthEvents.SETUP_BIOMETRICS('true'));
      // setup passcode aswell
      usePasscode();

    // handle biometric failure unknown error
    } else if (errorMsgBio) {
      // show alert message whenever biometric state gets failure
      setHasAlertMsg(errorMsgBio);


    // handle any unenrolled notice
    } else if (unEnrolledNoticeBio) {
      setHasAlertMsg(unEnrolledNoticeBio);


    // we dont need to see this page to user once biometric is unavailable on its device
    } else if (isUnavailableBio) {
      usePasscode();
    }


  }, [
    isSuccessBio,
    isUnavailableBio,
    errorMsgBio,
    unEnrolledNoticeBio,
  ]);

  const useBiometrics = () => {
    if (biometricState.matches({failure: 'unenrolled'})) {
      biometricSend({ type: 'RETRY_AUTHENTICATE' });
      return;
    }

    biometricSend({ type: 'AUTHENTICATE' });
  };

  const hideAlert = () => {
    setHasAlertMsg('');
  }

  return {
    isSettingUp,
    alertMsg,
    isEnabledBio,
    hideAlert,
    useBiometrics,
    usePasscode
  };
}
