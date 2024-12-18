import {useInterpret, useSelector} from '@xstate/react';
import {useContext, useRef} from 'react';

import {
  BackupAndRestoreSetupEvents,
  backupAndRestoreSetupMachine,
} from '../../machines/backupAndRestore/backupAndRestoreSetup/backupAndRestoreSetupMachine';

import {
  selectIsCloudSignedInFailed,
  selectIsLoading,
  selectIsNetworkError as selectIsNetworkErrorDuringSetup,
  selectIsSigningIn,
  selectIsSigningFailure as selectIsSigningInFailure,
  selectIsSigningInSuccessful,
  selectProfileInfo,
  selectShouldTriggerAutoBackup,
  selectShowAccountSelectionConfirmation,
} from '../../machines/backupAndRestore/backupAndRestoreSetup/backupAndRestoreSetupSelectors';
import {GlobalContext} from '../../shared/GlobalContext';
import {BackupEvents} from '../../machines/backupAndRestore/backup/backupMachine';
import {selectIsNetworkError as selectIsNetworkErrorWhileFetchingLastBackupDetails} from '../../machines/backupAndRestore/backup/backupSelector';

export function useBackupAndRestoreSetup() {
  const {appService} = useContext(GlobalContext);
  const settingsService = appService.children.get('settings')!!;
  const backupService = appService.children.get('backup')!!;
  const storeService = appService.children.get('store');
  const machine = useRef(
    backupAndRestoreSetupMachine.withContext({
      ...backupAndRestoreSetupMachine.context,
      serviceRefs: {settings: settingsService, store: storeService},
    }),
  );
  const backupAndRestoreSetupService = useInterpret(machine.current);

  const isNetworkErrorDuringAccountSetup = useSelector(
    backupAndRestoreSetupService,
    selectIsNetworkErrorDuringSetup,
  );
  const isNetworkErrorWhileFetchingLastBackupDetails = useSelector(
    backupService,
    selectIsNetworkErrorWhileFetchingLastBackupDetails,
  );

  const tryAgain = () => {
    if (isNetworkErrorDuringAccountSetup)
      return backupAndRestoreSetupService.send(
        BackupAndRestoreSetupEvents.TRY_AGAIN(),
      );
    return backupService.send(BackupEvents.TRY_AGAIN());
  };

  return {
    isLoading: useSelector(backupAndRestoreSetupService, selectIsLoading),
    profileInfo: useSelector(backupAndRestoreSetupService, selectProfileInfo),
    isNetworkError:
      isNetworkErrorDuringAccountSetup ||
      isNetworkErrorWhileFetchingLastBackupDetails,

    showAccountSelectionConfirmation: useSelector(
      backupAndRestoreSetupService,
      selectShowAccountSelectionConfirmation,
    ),
    isSigningIn: useSelector(backupAndRestoreSetupService, selectIsSigningIn),
    isSigningInFailed: useSelector(
      backupAndRestoreSetupService,
      selectIsSigningInFailure,
    ),
    isCloudSignInFailed: useSelector(
      backupAndRestoreSetupService,
      selectIsCloudSignedInFailed,
    ),
    isSigningInSuccessful: useSelector(
      backupAndRestoreSetupService,
      selectIsSigningInSuccessful,
    ),
    BACKUP_AND_RESTORE: () => {
      backupAndRestoreSetupService.send(
        BackupAndRestoreSetupEvents.HANDLE_BACKUP_AND_RESTORE(),
      );
    },
    shouldTriggerAutoBackup: useSelector(
      backupAndRestoreSetupService,
      selectShouldTriggerAutoBackup,
    ),
    PROCEED_ACCOUNT_SELECTION: () =>
      backupAndRestoreSetupService.send(BackupAndRestoreSetupEvents.PROCEED()),
    GO_BACK: () =>
      backupAndRestoreSetupService.send(BackupAndRestoreSetupEvents.GO_BACK()),
    RECONFIGURE_ACCOUNT: () =>
      backupAndRestoreSetupService.send(
        BackupAndRestoreSetupEvents.RECONFIGURE_ACCOUNT(),
      ),
    TRY_AGAIN: tryAgain,
    OPEN_SETTINGS: () =>
      backupAndRestoreSetupService.send(
        BackupAndRestoreSetupEvents.OPEN_SETTINGS(),
      ),
    DISMISS: () => {
      if (isNetworkErrorWhileFetchingLastBackupDetails)
        backupService.send(BackupEvents.DISMISS());
      return backupAndRestoreSetupService.send(
        BackupAndRestoreSetupEvents.DISMISS(),
      );
    },
  };
}
