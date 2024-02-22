import {useInterpret, useSelector} from '@xstate/react';
import {useContext, useRef} from 'react';

import {
  BackupAndRestoreSetupEvents,
  backupAndRestoreSetupMachine,
  selectIsLoading,
  selectIsNetworkOff,
  selectIsSigningIn,
  selectIsSigningFailure as selectIsSigningInFailure,
  selectIsSigningInSuccessful,
  selectProfileInfo,
  selectShouldTriggerAutoBackup,
  selectShowAccountSelectionConfirmation,
} from '../../machines/backupAndRestore/backupAndRestoreSetup';
import {GlobalContext} from '../../shared/GlobalContext';
import {selectIsBackUpAndRestoreExplored} from '../../machines/settings';
import {SettingsEvents} from '../../machines/settings';

export function useBackupAndRestoreSetup() {
  const {appService} = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const storeService = appService.children.get('store');
  const machine = useRef(
    backupAndRestoreSetupMachine.withContext({
      ...backupAndRestoreSetupMachine.context,
      serviceRefs: {settings: settingsService, store: storeService},
    }),
  );
  const service = useInterpret(machine.current);
  const isBackupAndRestoreExplored = useSelector(
    settingsService,
    selectIsBackUpAndRestoreExplored,
  );

  return {
    isLoading: useSelector(service, selectIsLoading),
    profileInfo: useSelector(service, selectProfileInfo),
    isNetworkOff: useSelector(service, selectIsNetworkOff),

    showAccountSelectionConfirmation: useSelector(
      service,
      selectShowAccountSelectionConfirmation,
    ),
    isSigningIn: useSelector(service, selectIsSigningIn),
    isSigningInFailed: useSelector(service, selectIsSigningInFailure),
    isSigningInSuccessful: useSelector(service, selectIsSigningInSuccessful),
    isBackupAndRestoreExplored,
    BACKUP_AND_RESTORE: () => {
      service.send(BackupAndRestoreSetupEvents.HANDLE_BACKUP_AND_RESTORE());
      if (!isBackupAndRestoreExplored) {
        settingsService.send(
          SettingsEvents.SET_IS_BACKUP_AND_RESTORE_EXPLORED(),
        );
      }
    },
    shouldTriggerAutoBackup: useSelector(
      service,
      selectShouldTriggerAutoBackup,
    ),
    PROCEED_ACCOUNT_SELECTION: () =>
      service.send(BackupAndRestoreSetupEvents.PROCEED()),
    GO_BACK: () => service.send(BackupAndRestoreSetupEvents.GO_BACK()),
    TRY_AGAIN: () => service.send(BackupAndRestoreSetupEvents.TRY_AGAIN()),
    OPEN_SETTINGS: () =>
      service.send(BackupAndRestoreSetupEvents.OPEN_SETTINGS()),
    DISMISS: () => service.send(BackupAndRestoreSetupEvents.DISMISS()),
  };
}
