import {StateFrom} from 'xstate';
import {EsignetMosipVCItemMachine} from './EsignetMosipVCItem/EsignetMosipVCItemMachine';
import {ExistingMosipVCItemMachine} from './ExistingMosipVCItem/ExistingMosipVCItemMachine';

type State = StateFrom<
  typeof ExistingMosipVCItemMachine & typeof EsignetMosipVCItemMachine
>;

export function selectVerifiableCredential(state: State) {
  return state.context.verifiableCredential;
}

export function selectKebabPopUp(state: State) {
  return state.matches('kebabPopUp');
}

export function selectContext(state: State) {
  return state.context;
}

export function selectGeneratedOn(state: State) {
  return state.context.generatedOn;
}

export function selectWalletBindingSuccess(state: State) {
  return state.context.walletBindingSuccess;
}

export function selectEmptyWalletBindingId(state: State) {
  const val = state.context.walletBindingResponse
    ? state.context.walletBindingResponse.walletBindingId
    : undefined;
  return val == undefined || val == null || val.length <= 0 ? true : false;
}

export function selectWalletBindingError(state: State) {
  return state.context.walletBindingError;
}

export function selectBindingAuthFailedError(state: State) {
  return state.context.bindingAuthFailedMessage;
}

export function selectKebabPopUpAcceptingBindingOtp(state: State) {
  return state.matches('kebabPopUp.acceptingBindingOtp');
}

export function selectKebabPopUpShowWalletBindingError(state: State) {
  return state.matches('kebabPopUp.showingWalletBindingError');
}

export function selectKebabPopUpWalletBindingInProgress(state: State) {
  return state.matches('kebabPopUp.requestingBindingOtp') ||
    state.matches('kebabPopUp.addingWalletBindingId') ||
    state.matches('kebabPopUp.addKeyPair') ||
    state.matches('kebabPopUp.updatingPrivateKey')
    ? true
    : false;
}

export function selectKebabPopUpBindingWarning(state: State) {
  return state.matches('kebabPopUp.showBindingWarning');
}

export function selectRemoveWalletWarning(state: State) {
  return state.matches('kebabPopUp.removeWallet');
}

export function selectIsPinned(state: State) {
  return state.context.vcMetadata.isPinned;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}

export function selectShowActivities(state: State) {
  return state.matches('kebabPopUp.showActivities');
}

export function selectShowWalletBindingError(state: State) {
  return (
    state.matches('showingWalletBindingError') ||
    state.matches('kebabPopUp.showingWalletBindingError')
  );
}
