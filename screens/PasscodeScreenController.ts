import { useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import {
  AuthEvents,
  selectAuthorized,
  selectPasscode,
  selectPasscodeSalt,
} from '../machines/auth';
import { PasscodeRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';

export function usePasscodeScreen(props: PasscodeRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const isAuthorized = useSelector(authService, selectAuthorized);

  const [passcode, setPasscode] = useState('');
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
    passcode,
    setPasscode,
    error,
    setError,

    storedPasscode: useSelector(authService, selectPasscode),

    LOGIN: () => {
      authService.send(AuthEvents.LOGIN());
    },

    SETUP_PASSCODE: () => {
      authService.send(AuthEvents.SETUP_PASSCODE(passcode));
    },

    storedSalt: useSelector(authService, selectPasscodeSalt),
  };
}
