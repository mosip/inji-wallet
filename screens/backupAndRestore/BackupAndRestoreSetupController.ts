import {useInterpret, useSelector} from '@xstate/react';
import {useRef} from 'react';

import {
  BackupAndRestoreSetupEvents,
  backupAndRestoreSetupMachine,
  selectIsLoading,
  selectIsNetworkOff,
  selectIsSigningIn,
  selectIsSigningFailure as selectIsSigningInFailure,
  selectIsSigningInSuccessful,
  selectProfileInfo,
  selectShowAccountSelectionConfirmation,
} from '../../machines/backupAndRestore/backupAndRestoreSetup';

export function useBackupAndRestoreSetup() {
  const machine = useRef(
    backupAndRestoreSetupMachine.withContext({
      ...backupAndRestoreSetupMachine.context,
    }),
  );
  const service = useInterpret(machine.current);

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

    BACKUP_AND_RESTORE: () =>
      service.send(BackupAndRestoreSetupEvents.HANDLE_BACKUP_AND_RESTORE()),
    PROCEED_ACCOUNT_SELECTION: () =>
      service.send(BackupAndRestoreSetupEvents.PROCEED()),
    GO_BACK: () => service.send(BackupAndRestoreSetupEvents.GO_BACK()),
    TRY_AGAIN: () => service.send(BackupAndRestoreSetupEvents.TRY_AGAIN()),
    DISMISS: () => service.send(BackupAndRestoreSetupEvents.DISMISS()),
  };
}
