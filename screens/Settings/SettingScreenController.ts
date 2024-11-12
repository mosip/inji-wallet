import {useMachine, useSelector} from '@xstate/react';
import {useContext, useEffect, useState} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  AuthEvents,
  selectBiometrics,
  selectCanUseBiometrics,
  selectPasscode,
  selectSettingUp,
} from '../../machines/auth';
import {
  selectBiometricUnlockEnabled,
  selectName,
  selectCredentialRegistryResponse,
  selectVcLabel,
  selectCredentialRegistry,
  SettingsEvents,
  selectAppId,
  selectEsignetHostUrl,
  selectIsKeymanagementTourGuideExplored,
  selectIsKeyOrderSet,
} from '../../machines/settings';

import {
  biometricsMachine,
  selectError,
  selectIsSuccess,
  selectUnenrolledNotice,
} from '../../machines/biometrics';
import {GlobalContext} from '../../shared/GlobalContext';
import {useTranslation} from 'react-i18next';
import {RequestRouteProps, RootRouteProps} from '../../routes';
import {BOTTOM_TAB_ROUTES, REQUEST_ROUTES} from '../../routes/routesConstants';
import {useCopilot} from 'react-native-copilot';

export function useSettingsScreen(props: RootRouteProps & RequestRouteProps) {
  const {appService} = useContext(GlobalContext);
  const authService = appService?.children?.get('auth') || {};
  const settingsService = appService?.children?.get('settings') || {};

  const [isVisible, setIsVisible] = useState(false);

  const [alertMsg, setHasAlertMsg] = useState('');
  const authBiometrics = useSelector(authService, selectBiometrics);
  const [biometricState, biometricSend, bioService] =
    useMachine(biometricsMachine);
  const passcode = useSelector(authService, selectPasscode);
  const isPasscodeSet = () => !!passcode;
  const isSettingUp = useSelector(authService, selectSettingUp);

  const isSuccessBio: boolean = useSelector(bioService, selectIsSuccess);
  const errorMsgBio: string = useSelector(bioService, selectError);
  const unEnrolledNoticeBio: string = useSelector(
    bioService,
    selectUnenrolledNotice,
  );
  const {t} = useTranslation('AuthScreen');

  useEffect(() => {
    setTimeout(async () => {
      const hasEnrolledBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!hasEnrolledBiometrics) {
        authService.send(AuthEvents.SETUP_BIOMETRICS(''));
        settingsService.send(
          SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(false, false),
        );
      }
    }, 0);

    // if biometic state is success then lets send auth service BIOMETRICS
    if (isSuccessBio) {
      authService.send(AuthEvents.SETUP_BIOMETRICS('true'));
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(true, true));

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
        settingsService.send(
          SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(true, true),
        );
      } else if (biometricState.matches({failure: 'unenrolled'})) {
        biometricSend({type: 'RETRY_AUTHENTICATE'});
      } else {
        biometricSend({type: 'AUTHENTICATE'});
      }
    } else {
      authService.send(AuthEvents.SETUP_BIOMETRICS(''));
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(false, true));
    }
  };

  const hideAlert = () => {
    setHasAlertMsg('');
  };

  const {start} = useCopilot();

  return {
    isVisible,
    alertMsg,
    hideAlert,
    isPasscodeSet,
    isSettingUp,
    appId: useSelector(settingsService || {}, selectAppId),
    name: useSelector(settingsService || {}, selectName),
    vcLabel: useSelector(settingsService || {}, selectVcLabel),
    credentialRegistry: useSelector(
      settingsService || {},
      selectCredentialRegistry,
    ),
    esignetHostUrl: useSelector(settingsService || {}, selectEsignetHostUrl),
    credentialRegistryResponse: useSelector(
      settingsService || {},
      selectCredentialRegistryResponse,
    ),
    isBiometricUnlockEnabled: useSelector(
      settingsService || {},
      selectBiometricUnlockEnabled,
    ),
    isKeyManagementTourGuideExplored: useSelector(
      settingsService,
      selectIsKeymanagementTourGuideExplored,
    ),
    isKeyOrderSet: useSelector(settingsService, selectIsKeyOrderSet),
    canUseBiometrics: useSelector(authService || {}, selectCanUseBiometrics),
    useBiometrics,

    UPDATE_NAME: (name: string) =>
      settingsService.send(SettingsEvents.UPDATE_NAME(name)),

    TOGGLE_SETTINGS: () => setIsVisible(!isVisible),

    UPDATE_VC_LABEL: (label: string) =>
      settingsService.send(SettingsEvents.UPDATE_VC_LABEL(label)),

    UPDATE_CREDENTIAL_REGISTRY: (
      credentialRegistry: string,
      esignetHostUrl: string,
    ) => {
      settingsService.send(
        SettingsEvents.UPDATE_HOST(credentialRegistry, esignetHostUrl),
      );
    },

    UPDATE_CREDENTIAL_REGISTRY_RESPONSE: (credentialRegistryResponse: string) =>
      settingsService.send(
        SettingsEvents.UPDATE_CREDENTIAL_REGISTRY_RESPONSE(
          credentialRegistryResponse,
        ),
      ),

    RECEIVE_CARD: () => {
      props.navigation.navigate(REQUEST_ROUTES.Request);
      setIsVisible(false);
    },

    CHANGE_UNLOCK_METHOD: (val: boolean) => {
      authService.send(AuthEvents.CHANGE_METHOD(true));
      settingsService.send(SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(val, true));
      props.navigation.navigate('Passcode', {setup: true});
    },

    SET_KEY_MANAGEMENT_EXPLORED: () => {
      settingsService.send(SettingsEvents.SET_KEY_MANAGEMENT_EXPLORED());
    },

    SET_KEY_ORDER_RESPONSE: (status: boolean) => {
      settingsService.send(SettingsEvents.SET_KEY_ORDER_RESPONSE(status));
    },

    RESET_KEY_ORDER_RESPONSE: () => {
      settingsService.send(SettingsEvents.RESET_KEY_ORDER_RESPONSE());
    },

    SET_KEY_MANAGEMENT_TOUR_GUIDE_EXPLORED: () => {
      settingsService.send(
        SettingsEvents.SET_KEY_MANAGEMENT_TOUR_GUIDE_EXPLORED(),
      );
    },
    INJI_TOUR_GUIDE: () => {
      settingsService.send(SettingsEvents.INJI_TOUR_GUIDE());
      props.navigation.navigate(BOTTOM_TAB_ROUTES.home);
      setIsVisible(false);
      authService.send(AuthEvents.SET_TOUR_GUIDE(true));
      start();
    },

    BACK: () => {
      settingsService.send(SettingsEvents.BACK());
    },

    TOGGLE_BIOMETRIC: (enable: boolean) => {
      settingsService.send(
        SettingsEvents.TOGGLE_BIOMETRIC_UNLOCK(enable, true),
      );
    },

    LOGOUT: () => {
      setIsVisible(false);
      const navigate = () => {
        props.navigation.navigate('Welcome');
        authService.send(AuthEvents.LOGOUT());
      };
      setTimeout(() => navigate(), 10);
    },

    CANCEL: () => {
      settingsService.send(SettingsEvents.CANCEL());
    },
  };
}
