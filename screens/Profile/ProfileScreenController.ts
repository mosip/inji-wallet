import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { selectBackendInfo } from '../../machines/app';
import {
  AuthEvents,
  selectBiometrics,
  selectCanUseBiometrics,
} from '../../machines/auth';
import {
  selectBiometricUnlockEnabled,
  selectName,
  selectCredentialRegistryResponse,
  selectVcLabel,
  selectCredentialRegistry,
  SettingsEvents,
} from '../../machines/settings';

import {
  biometricsMachine,
  selectError,
  selectIsSuccess,
  selectUnenrolledNotice,
} from '../../machines/biometrics';
import { MainRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';
import { useTranslation } from 'react-i18next';

export function useProfileScreen({ navigation }: MainRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const settingsService = appService.children.get('settings');

  const [alertMsg, setHasAlertMsg] = useState('');
  const authBiometrics = useSelector(authService, selectBiometrics);
  const [biometricState, biometricSend, bioService] =
    useMachine(biometricsMachine);

  const isSuccessBio: boolean = useSelector(bioService, selectIsSuccess);
  const errorMsgBio: string = useSelector(bioService, selectError);
  const unEnrolledNoticeBio: string = useSelector(
    bioService,
    selectUnenrolledNotice
  );
  const { t } = useTranslation('AuthScreen');

  useEffect(() => {
    setTimeout(async () => {
      const hasEnrolledBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!hasEnrolledBiometrics) {
        authService.send(AuthEvents.SETUP_BIOMETRICS(''));
        settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(false));
      }
    }, 0);

    // if biometic state is success then lets send auth service BIOMETRICS
    if (isSuccessBio) {
      authService.send(AuthEvents.SETUP_BIOMETRICS('true'));
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(true));

      // handle biometric failure unknown error
    } else {
      const error: string = errorMsgBio ?? unEnrolledNoticeBio ?? '';
      if (error != '') {
        setHasAlertMsg(t(error));
      }
    }
  }, [isSuccessBio, errorMsgBio, unEnrolledNoticeBio]);

  const useBiometrics = (value: boolean) => {
    if (value) {
      // But check if we already enrolled biometrics
      if (authBiometrics) {
        authService.send(AuthEvents.SETUP_BIOMETRICS('true'));
        settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(true));

        // but if device does not have any enrolled biometrics
      } else if (biometricState.matches({ failure: 'unenrolled' })) {
        biometricSend({ type: 'RETRY_AUTHENTICATE' });

        // otherwise lets do a biometric auth
      } else {
        biometricSend({ type: 'AUTHENTICATE' });
      }
    } else {
      authService.send(AuthEvents.SETUP_BIOMETRICS(''));
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(false));
    }
  };

  const hideAlert = () => {
    setHasAlertMsg('');
  };

  return {
    alertMsg,
    hideAlert,
    backendInfo: useSelector(appService, selectBackendInfo),
    name: useSelector(settingsService, selectName),
    vcLabel: useSelector(settingsService, selectVcLabel),
    credentialRegistry: useSelector(settingsService, selectCredentialRegistry),
    credentialRegistryResponse: useSelector(
      settingsService,
      selectCredentialRegistryResponse
    ),
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

    UPDATE_CREDENTIAL_REGISTRY: (credentialRegistry: string) =>
      settingsService.send(
        SettingsEvents.UPDATE_CREDENTIAL_REGISTRY(credentialRegistry)
      ),

    UPDATE_CREDENTIAL_REGISTRY_RESPONSE: (credentialRegistryResponse: string) =>
      settingsService.send(
        SettingsEvents.UPDATE_CREDENTIAL_REGISTRY_RESPONSE(
          credentialRegistryResponse
        )
      ),

    TOGGLE_BIOMETRIC: (enable: boolean) =>
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(enable)),

    LOGOUT: () => {
      authService.send(AuthEvents.LOGOUT());
      navigation.navigate('Welcome');
    },
  };
}
