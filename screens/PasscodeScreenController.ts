import {useSelector} from '@xstate/react';
import {useContext, useEffect, useState} from 'react';
import {
  AuthEvents,
  selectAuthorized,
  selectPasscode,
  selectPasscodeSalt,
} from '../machines/auth';
import {PasscodeRouteProps} from '../routes';
import {GlobalContext} from '../shared/GlobalContext';
import {
  getEndData,
  getErrorData,
  getImpressionData,
  sendEndEvent,
  sendErrorEvent,
  sendImpressionEvent,
} from '../shared/telemetry/TelemetryUtils';

export function usePasscodeScreen(props: PasscodeRouteProps) {
  const {appService} = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const isAuthorized = useSelector(authService, selectAuthorized);

  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [PasscodeRetryCount, setPasscodeRetryCount] = useState(1);

  const incrementPasscodeRetryCount = () => {
    if (PasscodeRetryCount < 5) {
      setPasscodeRetryCount(PasscodeRetryCount + 1);
    } else {
      if (props.route.params?.setup) {
        sendErrorEvent(
          getErrorData(
            'App Onboarding',
            'not_match',
            'Passcode did not match',
            {},
          ),
        );
      } else {
        sendErrorEvent(
          getErrorData('App Login', 'not_match', 'Passcode did not match', {}),
        );
      }
      setPasscodeRetryCount(1);
    }
  };
  useEffect(() => {
    if (isAuthorized) {
      if (props.route.params?.setup) {
        sendEndEvent(getEndData('App Onboarding', 'SUCCESS'));
      } else {
        sendEndEvent(getEndData('App login', 'SUCCESS'));
      }
      props.navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
      sendImpressionEvent(getImpressionData('Main'));
    }
  }, [isAuthorized]);

  return {
    passcode,
    setPasscode,
    error,
    setError,
    incrementPasscodeRetryCount,

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
