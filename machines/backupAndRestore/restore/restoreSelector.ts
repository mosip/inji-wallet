import {StateFrom} from 'xstate';
import {restoreMachine} from './restoreMachine';

export function selectErrorReason(state: State) {
  return state.context.errorReason;
}
export function selectIsBackUpRestoring(state: State) {
  return (
    state.matches('restoreBackup') &&
    !state.matches('restoreBackup.success') &&
    !state.matches('restoreBackup.failure')
  );
}
export function selectIsBackUpRestoreSuccess(state: State) {
  return state.matches('restoreBackup.success');
}
export function selectIsBackUpRestoreFailure(state: State) {
  return state.matches('restoreBackup.failure');
}
export function selectShowRestoreInProgress(state: State) {
  return state.context.showRestoreInProgress;
}
type State = StateFrom<typeof restoreMachine>;
