import {useInterpret, useSelector} from '@xstate/react';
import {useRef} from 'react';

import {
  BackupAndRestoreEvents,
  backupAndRestoreMachine,
  selectIsLoading,
  selectIsSigningIn,
  selectIsSigningFailure as selectIsSigningInFailure,
  selectIsSigningInSuccessful,
  selectProfileInfo,
  selectShowAccountSelectionConfirmation,
} from '../../machines/backupAndRestore/backupAndRestore';
// import { logState } from '../../shared/commonUtil';

export function useBackupAndRestore() {
  const machine = useRef(
    backupAndRestoreMachine.withContext({
      ...backupAndRestoreMachine.context,
    }),
  );
  const service = useInterpret(machine.current);
  //TODO: Remove backUp and restore machine log as it has sensitive info
  // service.subscribe(logState);

  return {
    isLoading: useSelector(service, selectIsLoading),
    profileInfo: useSelector(service, selectProfileInfo),

    showAccountSelectionConfirmation: useSelector(
      service,
      selectShowAccountSelectionConfirmation,
    ),
    isSigningIn: useSelector(service, selectIsSigningIn),
    isSigningInFailed: useSelector(service, selectIsSigningInFailure),
    isSigningInSuccessful: useSelector(service, selectIsSigningInSuccessful),

    BACKUP_AND_RESTORE: () =>
      service.send(BackupAndRestoreEvents.HANDLE_BACKUP_AND_RESTORE()),
    PROCEED_ACCOUNT_SELECTION: () =>
      service.send(BackupAndRestoreEvents.PROCEED()),
    GO_BACK: () => service.send(BackupAndRestoreEvents.GO_BACK()),
    TRY_AGAIN: () => service.send(BackupAndRestoreEvents.TRY_AGAIN()),
  };
}
