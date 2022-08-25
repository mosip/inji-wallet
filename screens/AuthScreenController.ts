import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

import {
  AuthEvents,
  selectSettingUp,
  selectAuthorized,
} from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';
import {
  biometricsMachine,
  selectError,
  selectIsEnabled,
  selectIsSuccess,
  selectIsUnvailable,
  selectUnenrolledNotice,
} from '../machines/biometrics';
import { SettingsEvents } from '../machines/settings';
import { useTranslation } from 'react-i18next';

export function useAuthScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const settingsService = appService.children.get('settings');

  const isSettingUp = useSelector(authService, selectSettingUp);
  const isAuthorized = useSelector(authService, selectAuthorized);

  const [alertMsg, setHasAlertMsg] = useState('');
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [biometricState, biometricSend, bioService] =
    useMachine(biometricsMachine);

  const isEnabledBio = useSelector(bioService, selectIsEnabled);
  const isUnavailableBio = useSelector(bioService, selectIsUnvailable);
  const isSuccessBio = useSelector(bioService, selectIsSuccess);
  const errorMsgBio = useSelector(bioService, selectError);
  const unEnrolledNoticeBio = useSelector(bioService, selectUnenrolledNotice);

  const usePasscode = () => {
    props.navigation.navigate('Passcode', { setup: isSettingUp });
  };

  const { t } = useTranslation('AuthScreen');

  const fetchIsAvailable = async () => {
    const result = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricsAvailable(result);
  };
  fetchIsAvailable();

  useEffect(() => {
    if (isAuthorized) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      return;
    }

    // if biometic state is success then lets send auth service BIOMETRICS
    if (isSuccessBio) {
      authService.send(AuthEvents.SETUP_BIOMETRICS('true'));
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(true));
      // setup passcode aswell
      usePasscode();

      // handle biometric failure unknown error
    } else if (errorMsgBio) {
      // show alert message whenever biometric state gets failure
      setHasAlertMsg(t(errorMsgBio));

      // handle any unenrolled notice
    } else if (unEnrolledNoticeBio) {
      setHasAlertMsg(t(unEnrolledNoticeBio));

      // we dont need to see this page to user once biometric is unavailable on its device
    } else if (isUnavailableBio) {
      usePasscode();
    }
  }, [isSuccessBio, isUnavailableBio, errorMsgBio, unEnrolledNoticeBio]);

  const useBiometrics = async () => {
    const isBiometricsEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (isBiometricsEnrolled) {
      if (biometricState.matches({ failure: 'unenrolled' })) {
        biometricSend({ type: 'RETRY_AUTHENTICATE' });
        return;
      }

      biometricSend({ type: 'AUTHENTICATE' });
    } else {
      setHasAlertMsg(t('errors.unenrolled'));
    }
  };

  const hideAlert = () => {
    setHasAlertMsg('');
  };

  return {
    isBiometricsAvailable,
    isSettingUp,
    alertMsg,
    isEnabledBio,

    hideAlert,
    useBiometrics,
    usePasscode,
  };
}
