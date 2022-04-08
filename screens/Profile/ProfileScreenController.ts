import { useMachine, useSelector } from '@xstate/react';
import { useContext, useState } from 'react';
import { AuthEvents, selectCanUseBiometrics } from '../../machines/auth';
import {
  selectBiometricUnlockEnabled,
  selectName,
  selectVcLabel,
  SettingsEvents,
} from '../../machines/settings';

import {
  biometricsMachine,
  selectError,
  selectIsEnabled,
  selectIsSuccess,
  selectIsUnvailable,
  selectUnenrolledNotice,
} from '../../machines/biometrics';
import { MainRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

export function useProfileScreen({ navigation }: MainRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const settingsService = appService.children.get('settings');

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

  // if biometic state is success then lets send auth service BIOMETRICS
  if (isSuccessBio) {
    authService.send(AuthEvents.SETUP_BIOMETRICS('true'));
    settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(true));
  // handle biometric failure unknown error
  } else if (errorMsgBio) {
    // show alert message whenever biometric state gets failure
    setHasAlertMsg(errorMsgBio);


  // handle any unenrolled notice
  } else if (unEnrolledNoticeBio) {
    setHasAlertMsg(unEnrolledNoticeBio);

  // we dont need to see this page to user once biometric is unavailable on its device
  }

  const useBiometrics = (value: boolean) => {
    if(value){
      if (biometricState.matches({failure: 'unenrolled'})) {
        //static since it gives error when retry and unEnrolledNoticeBio is empty
        setHasAlertMsg('To use Biometrics, please enroll your fingerprint in your device settings');
        //biometricSend({ type: 'RETRY_AUTHENTICATE' });
        return;
      }

      biometricSend({ type: 'AUTHENTICATE' });
    } else {
      authService.send(AuthEvents.SETUP_BIOMETRICS(''));
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(false));
    }
  };

  const hideAlert = () => {
    setHasAlertMsg('');
  }

  return {
    alertMsg,
    hideAlert,
    name: useSelector(settingsService, selectName),
    vcLabel: useSelector(settingsService, selectVcLabel),
    isBiometricUnlockEnabled: useSelector(
      settingsService,
      selectBiometricUnlockEnabled
    ),
    canUseBiometrics: useSelector(authService, selectCanUseBiometrics),
    useBiometrics,

    UPDATE_NAME: (name: string) =>
      settingsService.send(SettingsEvents.UPDATE_NAME(name)),

    UPDATE_VC_LABEL: (label: string) =>
      settingsService.send(SettingsEvents.UPDATE_VC_LABEL(label)),

    TOGGLE_BIOMETRIC: (enable: boolean) =>
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(enable)),

    LOGOUT: () => {
      authService.send(AuthEvents.LOGOUT());
      navigation.navigate('Welcome');
    },
  };
}
