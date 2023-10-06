import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import RNFingerprintChange from 'react-native-biometrics-changed';
import { AuthEvents, selectAuthorized, selectPasscode } from '../machines/auth';
import {
  biometricsMachine,
  selectError,
  selectErrorResponse,
  selectIsAvailable,
  selectIsSuccess,
  selectIsUnenrolled,
  selectIsUnvailable,
} from '../machines/biometrics';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';
import {
  getData,
  getEndData,
  getErrorData,
  getImpressionData,
  getInteractData,
  sendEndEvent,
  sendErrorEvent,
  sendImpressionEvent,
  sendInteractEvent,
  sendStartEvent,
} from '../shared/telemetry/TelemetryUtils';

export function useBiometricScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const [error, setError] = useState('');
  const [isReEnabling, setReEnabling] = useState(false);
  const [initAuthBio, updateInitAuthBio] = useState(true);
  const [, bioSend, bioService] = useMachine(biometricsMachine);

  const isAuthorized = useSelector(authService, selectAuthorized);
  const isAvailable = useSelector(bioService, selectIsAvailable);
  const isUnavailable = useSelector(bioService, selectIsUnvailable);
  const isSuccessBio = useSelector(bioService, selectIsSuccess);
  const isUnenrolled = useSelector(bioService, selectIsUnenrolled);
  const errorMsgBio = useSelector(bioService, selectError);
  const errorResponse = useSelector(bioService, selectErrorResponse);

  useEffect(() => {
    if (isAuthorized) {
      sendEndEvent(getEndData('App Login', 'SUCCESS'));
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      sendImpressionEvent(getImpressionData('Main'));
      return;
    }

    if (initAuthBio && isAvailable) {
      checkBiometricsChange();

      // so we only init authentication of biometrics just once
      updateInitAuthBio(false);
    }

    // if biometic state is success then lets send auth service BIOMETRICS
    if (isSuccessBio) {
      authService.send(AuthEvents.LOGIN());
      return;
    }

    if (errorMsgBio) {
      sendErrorEvent(
        getErrorData(
          'App Login',
          errorResponse.res.error,
          errorResponse.res.warning,
          errorResponse.stacktrace,
        ),
      );
      sendEndEvent(getEndData('App Login', 'FAILURE'));
    }

    if (isUnavailable || isUnenrolled) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Passcode' }],
      });
    }
  }, [
    isAuthorized,
    isAvailable,
    isUnenrolled,
    isUnavailable,
    isSuccessBio,
    errorMsgBio,
  ]);

  const checkBiometricsChange = () => {
    if (Platform.OS === 'android') {
      RNFingerprintChange.hasFingerPrintChanged().then(
        async (biometricsHasChanged: boolean) => {
          //if new biometrics are added, re-enable Biometrics Authentication
          if (biometricsHasChanged) {
            setReEnabling(true);
          } else {
            bioSend({ type: 'AUTHENTICATE' });
          }
        },
      );
    } else {
      // TODO: solution for iOS
    }
  };

  const useBiometrics = () => {
    sendStartEvent(getData('App login'));
    sendInteractEvent(
      getInteractData('TOUCH', 'Unlock with biometrics button'),
    );
    bioSend({ type: 'AUTHENTICATE' });
  };

  const onSuccess = () => {
    bioSend({ type: 'AUTHENTICATE' });
  };

  const onError = (value: string) => {
    setError(value);
  };

  const onDismiss = () => {
    setReEnabling(false);
  };

  return {
    error,
    isReEnabling,
    isSuccessBio,
    storedPasscode: useSelector(authService, selectPasscode),
    useBiometrics,

    onSuccess,
    onError,
    onDismiss,
  };
}
