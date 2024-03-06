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
import {
  BackupEvents,
  selectIsNetworkError,
} from '../../machines/backupAndRestore/backup';

export function useBackupAndRestoreSetup() {
  const {appService} = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const backupService = appService.children.get('backup');
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

  const isNetworkErrorDuringAccountSetup = useSelector(
    service,
    selectIsNetworkOff,
  );
  const isNetworkErrorWhileFetchingLastBackupDetails = useSelector(
    backupService!!,
    selectIsNetworkError,
  );

  const tryAgain = () => {
    if (isNetworkErrorDuringAccountSetup)
      return service.send(BackupAndRestoreSetupEvents.TRY_AGAIN());
    return backupService?.send(BackupEvents.TRY_AGAIN());
  };

  return {
    isLoading: useSelector(service, selectIsLoading),
    profileInfo: useSelector(service, selectProfileInfo),
    isNetworkOff:
      isNetworkErrorDuringAccountSetup ||
      isNetworkErrorWhileFetchingLastBackupDetails,

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
        settingsService?.send(
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
    RECONFIGURE_ACCOUNT: () =>
      service.send(BackupAndRestoreSetupEvents.RECONFIGURE_ACCOUNT()),
    TRY_AGAIN: tryAgain,
    OPEN_SETTINGS: () =>
      service.send(BackupAndRestoreSetupEvents.OPEN_SETTINGS()),
    DISMISS: () => {
      if (isNetworkErrorWhileFetchingLastBackupDetails)
        backupService?.send(BackupAndRestoreSetupEvents.DISMISS());
      return service.send(BackupAndRestoreSetupEvents.DISMISS());
    },
  };
}
