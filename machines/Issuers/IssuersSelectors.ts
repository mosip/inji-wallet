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
  return state.context.errorMessage;
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

export function selectIsNonGenericError(state: State) {
  return (
    state.context.errorMessage !== ErrorMessage.GENERIC &&
    state.context.errorMessage !== ''
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

export function selectIsError(state: State) {
  return state.matches('error');
}

export function selectVerificationErrorMessage(state: State) {
  return state.context.verificationErrorMessage;
}

export function selectAutoWalletBindingFailure(state: State) {
  return state.context.isAutoWalletBindingFailed;
}

export function selectSelectingCredentialType(state: State) {
  return state.matches('selectingCredentialType');
}

export function selectSupportedCredentialTypes(state: State) {
  return state.context.supportedCredentialTypes;
}
