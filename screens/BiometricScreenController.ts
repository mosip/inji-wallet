import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import RNFingerprintChange from 'react-native-biometrics-changed';
import { AuthEvents, selectAuthorized, selectPasscode } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';
import {
  biometricsMachine,
  selectIsAvailable,
  selectIsSuccess,
  selectIsUnenrolled,
  selectIsUnvailable,
} from '../machines/biometrics';
import { Platform } from 'react-native';

export function useBiometricScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const [error, setError] = useState('');
  const [isReEnabling, setReEnabling] = useState(false);
  const [initAuthBio, updateInitAuthBio] = useState(true);
  const [bioSend, bioService] = useMachine(biometricsMachine);

  const isAuthorized = useSelector(authService, selectAuthorized);
  const isAvailable = useSelector(bioService, selectIsAvailable);
  const isUnavailable = useSelector(bioService, selectIsUnvailable);
  const isSuccessBio = useSelector(bioService, selectIsSuccess);
  const isUnenrolled = useSelector(bioService, selectIsUnenrolled);

  useEffect(() => {
    if (isAuthorized) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
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

    if (isUnavailable || isUnenrolled) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Passcode' }],
      });
    }
  }, [isAuthorized, isAvailable, isUnenrolled, isUnavailable, isSuccessBio]);

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
        }
      );
    } else {
      // TODO: solution for iOS
    }
  };

  const useBiometrics = () => {
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
