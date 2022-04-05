import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { AuthEvents, selectCanUseBiometrics } from '../../machines/auth';
import {
  selectBiometricUnlockEnabled,
  selectName,
  selectVcLabel,
  SettingsEvents,
} from '../../machines/settings';
import { MainRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

export function useProfileScreen({ navigation }: MainRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const settingsService = appService.children.get('settings');

  return {
    name: useSelector(settingsService, selectName),
    vcLabel: useSelector(settingsService, selectVcLabel),
    isBiometricUnlockEnabled: useSelector(
      settingsService,
      selectBiometricUnlockEnabled
    ),
    canUseBiometrics: useSelector(authService, selectCanUseBiometrics),

    UPDATE_NAME: (name: string) =>
      settingsService.send(SettingsEvents.UPDATE_NAME(name)),

    UPDATE_VC_LABEL: (label: string) =>
      settingsService.send(SettingsEvents.UPDATE_VC_LABEL(label)),

    LOGOUT: () => {
      authService.send(AuthEvents.LOGOUT());
      navigation.navigate('Welcome');
    },
  };
}
