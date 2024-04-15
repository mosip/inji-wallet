import {ErrorMessage} from '../../shared/openId4VCI/Utils';
import {StateFrom} from 'xstate';
import {IssuersMachine} from './IssuersMachine';

type State = StateFrom<typeof IssuersMachine>;

export function selectIssuers(state: State) {
  return state.context.issuers;
}

export function selectSelectedIssuer(state: State) {
  return state.context.selectedIssuer;
}

export function selectErrorMessageType(state: State) {
  const nonGenericErrors = ['', ErrorMessage.NO_INTERNET];
  return nonGenericErrors.includes(state.context.errorMessage)
    ? state.context.errorMessage
    : ErrorMessage.GENERIC;
}

export function selectLoadingReason(state: State) {
  return state.context.loadingReason;
}

export function selectIsDownloadCredentials(state: State) {
  return state.matches('downloadCredentials');
}

export function selectIsBiometricCancelled(state: State) {
  return (
    state.matches('downloadCredentials.userCancelledBiometric') ||
    state.matches('performAuthorization.userCancelledBiometric')
  );
}

export function selectIsDone(state: State) {
  return state.matches('done');
}

export function selectIsIdle(state: State) {
  return state.matches('idle');
}

export function selectStoring(state: State) {
  return state.matches('storing');
}

export function selectVerificationErrorMessage(state: State) {
  return state.context.verificationErrorMessage;
}

export function selectSelectingCredentialType(state: State) {
  return state.matches('selectingCredentialType');
}

export function selectCredentialTypes(state: State) {
  return state.context.credentialTypes;
}
