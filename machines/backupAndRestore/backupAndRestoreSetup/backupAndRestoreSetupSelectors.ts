import {StateFrom} from 'xstate';
import {backupAndRestoreSetupMachine} from './backupAndRestoreSetupMachine';

export function selectIsLoading(state: State) {
  return state.context.isLoading;
}

export function selectProfileInfo(state: State) {
  return state.context.profileInfo;
}

export function selectIsNetworkError(state: State) {
  return (
    state.matches('init.noInternet') ||
    state.matches('checkSignIn.noInternet') ||
    state.matches('signIn.noInternet')
  );
}

export function selectShouldTriggerAutoBackup(state: State) {
  return state.context.shouldTriggerAutoBackup;
}

export function selectShowAccountSelectionConfirmation(state: State) {
  return state.matches('selectCloudAccount');
}

export function selectIsSigningIn(state: State) {
  return state.matches('signIn');
}

export function selectIsSigningInSuccessful(state: State) {
  return state.matches('backupAndRestore');
}

export function selectIsSigningFailure(state: State) {
  return state.matches('signIn.error') || state.matches('checkSignIn.error');
}

export function selectIsCloudSignedInFailed(state: State) {
  return state.matches('checkSignIn.error');
}
type State = StateFrom<typeof backupAndRestoreSetupMachine>;
