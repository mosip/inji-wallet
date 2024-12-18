import {StateFrom} from 'xstate';
import {backupMachine} from './backupMachine';

type State = StateFrom<typeof backupMachine>;

export function selectIsBackupInprogress(state: State) {
  return (
    state.matches('backingUp.checkDataAvailabilityForBackup') ||
    state.matches('backingUp.checkStorageAvailability') ||
    state.matches('backingUp.fetchDataFromDB') ||
    state.matches('backingUp.writeDataToFile') ||
    state.matches('backingUp.zipBackupFile') ||
    state.matches('backingUp.uploadBackupFile')
  );
}
export function selectIsLoadingBackupDetails(state: State) {
  return state.context.isLoadingBackupDetails;
}
export function selectIsBackingUpSuccess(state: State) {
  return state.matches('backingUp.success');
}
export function selectIsBackingUpFailure(state: State) {
  return state.matches('backingUp.failure');
}
export function selectIsNetworkError(state: State) {
  return state.matches('fetchLastBackupDetails.noInternet');
}
export function lastBackupDetails(state: State) {
  return state.context.lastBackupDetails;
}
export function selectBackupErrorReason(state: State) {
  return state.context.errorReason;
}
export function selectShowBackupInProgress(state: State) {
  return state.context.showBackupInProgress;
}
