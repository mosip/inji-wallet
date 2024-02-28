import {StateFrom} from 'xstate';
import {scanMachine} from './scanMachine';

type State = StateFrom<typeof scanMachine>;

export function selectReceiverInfo(state: State) {
  return state.context.receiverInfo;
}

export function selectVcName(state: State) {
  return state.context.vcName;
}

export function selectSelectedVc(state: State) {
  return state.context.selectedVc;
}

export function selectQrLoginRef(state: State) {
  return state.context.QrLoginRef;
}

export function selectIsScanning(state: State) {
  return state.matches('findingConnection');
}

export function selectIsConnecting(state: State) {
  return state.matches('connecting.inProgress');
}

export function selectIsConnectingTimeout(state: State) {
  return state.matches('connecting.timeout');
}

export function selectIsSelectingVc(state: State) {
  return state.matches('reviewing.selectingVc');
}

export function selectIsSendingVc(state: State) {
  return state.matches('reviewing.sendingVc.inProgress');
}

export function selectIsFaceIdentityVerified(state: State) {
  return (
    state.matches('reviewing.sendingVc.inProgress') &&
    state.context.showFaceCaptureSuccessBanner
  );
}

export function selectIsSendingVcTimeout(state: State) {
  return state.matches('reviewing.sendingVc.timeout');
}

export function selectIsSent(state: State) {
  return state.matches('reviewing.sendingVc.sent');
}

export function selectIsInvalid(state: State) {
  return state.matches('invalid');
}

export function selectIsLocationDenied(state: State) {
  return state.matches('checkingLocationState.denied');
}

export function selectIsLocationDisabled(state: State) {
  return state.matches('checkingLocationState.disabled');
}

export function selectIsShowQrLogin(state: State) {
  return state.matches('showQrLogin');
}

export function selectIsQrLoginDone(state: State) {
  return state.matches('showQrLogin.navigatingToHistory');
}

export function selectIsQrLoginStoring(state: State) {
  return state.matches('showQrLogin.storing');
}

export function selectIsDone(state: State) {
  return state.matches('reviewing.disconnect');
}
